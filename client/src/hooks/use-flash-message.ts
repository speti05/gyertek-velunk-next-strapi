"use client";

import { useEffect, useState } from "react";

type ActionResult = { successMessage?: string | null } | null | undefined;

// Visibility is derived during render, so the only state write is in the timer callback, not in the effect body
export function useFlashMessage(state: ActionResult, durationMs = 5000): string | null {
  const [expiredState, setExpiredState] = useState<ActionResult>(null);

  // Keyed on the state object, not the message text: a repeated identical message is still a new result
  useEffect(() => {
    if (!state?.successMessage) return;
    const t = setTimeout(() => setExpiredState(state), durationMs);
    return () => clearTimeout(t);
  }, [state, durationMs]);

  return state?.successMessage && expiredState !== state ? state.successMessage : null;
}
