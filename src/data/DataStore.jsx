import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from "react";
import { source } from "./source";
import { COLLECTIONS } from "../mock/db";

const empty = Object.fromEntries(COLLECTIONS.map((c) => [c, []]));

const DataContext = createContext(null);

export function DataStoreProvider({ children }) {
  const [data, setData] = useState(empty);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const all = await source.listAll();
      setData({ ...empty, ...all });
      setStatus("ready");
    } catch (err) {
      setError(err.message || "Something went wrong");
      setStatus("error");
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const value = useMemo(() => ({
    data,
    status,
    error,
    reload,
    async create(collection, record) {
      const row = await source.create(collection, record);
      setData((d) => ({ ...d, [collection]: [row, ...d[collection]] }));
      return row;
    },
    async update(collection, id, patch) {
      const row = await source.update(collection, id, patch);
      setData((d) => ({ ...d, [collection]: d[collection].map((r) => (r.id === id ? row : r)) }));
      return row;
    },
    async remove(collection, id) {
      await source.remove(collection, id);
      setData((d) => ({ ...d, [collection]: d[collection].filter((r) => r.id !== id) }));
    },
  }), [data, status, error, reload]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useStore() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useStore must be used within DataStoreProvider");
  return ctx;
}

/** Rows of one collection, plus the shared load status. */
export function useCollection(name) {
  const { data, status, error, reload } = useStore();
  return { rows: data[name] || [], status, error, reload };
}

/** A single record by id. `notFound` is only meaningful once status is "ready". */
export function useRecord(name, id) {
  const { data, status, error, reload } = useStore();
  const record = (data[name] || []).find((r) => r.id === id) || null;
  return { record, status, error, reload, notFound: status === "ready" && !record };
}
