"use client";

import { useSyncExternalStore } from "react";

const noSubscription = () => () => {};

// The year is read only in the browser. With Cache Components, reading the
// current time during prerender (even in a Client Component) is an error.
export function CurrentYear() {
  const year = useSyncExternalStore(
    noSubscription,
    () => new Date().getFullYear(),
    () => null,
  );
  return <span>{year}</span>;
}
