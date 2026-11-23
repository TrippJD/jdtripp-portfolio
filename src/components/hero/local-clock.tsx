"use client";

import { useSyncExternalStore } from "react";

function subscribe(onTick: () => void) {
  const id = window.setInterval(onTick, 1000);
  return () => window.clearInterval(id);
}

/** Live clock for a time zone. Renders a placeholder on the server. */
export function LocalClock({ timeZone }: { timeZone: string }) {
  const time = useSyncExternalStore(
    subscribe,
    () =>
      new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      }).format(new Date()),
    () => "--:-- --",
  );

  return <span suppressHydrationWarning>{time}</span>;
}
