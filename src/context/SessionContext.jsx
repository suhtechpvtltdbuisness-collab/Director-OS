import React, { createContext, useContext } from "react";

const SessionContext = createContext(null);

export function SessionProvider({ value, children }) {
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

/** Current user, role flag and the toast helper. */
export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
