"use server";

import { Resend } from "resend";
import { z } from "zod";

export type ContactField = "name" | "email" | "message";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<ContactField, string[]>>;
  // Sent back on errors so the form can refill what the visitor typed.
  values?: Partial<Record<ContactField, string>>;
  // Counted on the client: each submission gets a fresh form and spam check.
  attempt?: number;
};

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100, "That name is too long."),
  email: z.email("Please enter a valid email address.").max(200),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least a sentence or two.")
    .max(5000, "Please keep it under 5,000 characters."),
});

const isProduction = process.env.NODE_ENV === "production";

/** Asks Cloudflare whether the Turnstile token proves a real visitor. */
async function passesTurnstile(token: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return !isProduction; // only skipped in local development
  if (!token) return false;

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token }),
  });
  if (!response.ok) return false;
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

/**
 * Handles the contact form. This is a public endpoint like any server
 * action, so it checks a honeypot, validates input and verifies Turnstile
 * before anything is sent.
 */
export async function sendContactMessage(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Honeypot: a field people never see. Bots fill it in; pretend it worked.
  if (String(formData.get("company") ?? "") !== "") return { status: "success" };

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    return {
      status: "error",
      message: "A couple of fields need another look.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  const emailConfigured = Boolean(apiKey && to && from);

  // In production, a missing key is a setup problem, not the visitor's fault.
  if (isProduction && (!emailConfigured || !process.env.TURNSTILE_SECRET_KEY)) {
    console.error("[contact] Missing email or Turnstile environment variables");
    return {
      status: "error",
      message: "The contact form isn't working right now. Please reach out on LinkedIn instead.",
      values,
    };
  }

  const token = formData.get("cf-turnstile-response");
  if (!(await passesTurnstile(typeof token === "string" ? token : null))) {
    return {
      status: "error",
      message: "We couldn't confirm you're human. Please try the check again.",
      values,
    };
  }

  if (!apiKey || !to || !from) {
    console.info("[contact] Email isn't configured; message not sent:", parsed.data);
    return { status: "success", message: "Development mode: logged instead of sent." };
  }

  const { name, email, message } = parsed.data;
  const { error } = await new Resend(apiKey).emails.send({
    from,
    to,
    replyTo: email,
    subject: `Portfolio message from ${name}`,
    // Plain text only, so nothing a visitor types can become HTML in the email.
    text: `${message}\n\n---\nFrom: ${name} <${email}>\nSent from the contact form on jdtripp.com`,
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return {
      status: "error",
      message: "Something went wrong sending your message. Please try again in a minute.",
      values,
    };
  }

  return { status: "success" };
}
