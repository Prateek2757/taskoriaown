"use client";

import { useSyncExternalStore, type ReactNode } from "react";

const subscribe = () => () => {};
const getServerSnapshot = () => false;
const getSnapshot = () =>
  !["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);

// Vendor keys are configured for hosted domains. Keep loopback development
// and local audits from sending analytics or requesting unsupported widgets.
export default function HostedScripts({ children }: { children: ReactNode }) {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return enabled ? children : null;
}
