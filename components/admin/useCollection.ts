"use client";

import { useCallback, useEffect, useState } from "react";

export interface CollectionStatus {
  msg: string;
  error?: boolean;
}

export interface CollectionController<T> {
  items: T[];
  selected: number;
  setSelected: (index: number) => void;
  loading: boolean;
  saving: boolean;
  dirty: boolean;
  status: CollectionStatus | null;
  update: (patch: Partial<T>) => void;
  add: () => void;
  remove: (index: number) => void;
  moveUp: (index: number) => void;
  save: () => Promise<void>;
}

/**
 * Loads a `{ [key]: T[] }` collection from a dev admin endpoint, tracks local
 * edits, and PUTs the whole collection back. Used for projects and experience,
 * which each live in a single JSON file.
 */
export function useCollection<T extends { id: string }>(
  endpoint: string,
  key: string,
  makeBlank: (items: T[]) => T
) {
  const [items, setItems] = useState<T[]>([]);
  const [selected, setSelected] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<CollectionStatus | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(endpoint)
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        setItems((d[key] as T[]) ?? []);
        setLoading(false);
      })
      .catch((e) => {
        if (!alive) return;
        setStatus({ msg: String(e), error: true });
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [endpoint, key]);

  const update = useCallback(
    (patch: Partial<T>) => {
      setItems((prev) =>
        prev.map((it, i) => (i === selected ? { ...it, ...patch } : it))
      );
      setDirty(true);
    },
    [selected]
  );

  const add = useCallback(() => {
    setItems((prev) => {
      const next = [...prev, makeBlank(prev)];
      setSelected(next.length - 1);
      return next;
    });
    setDirty(true);
  }, [makeBlank]);

  const remove = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
    setSelected((s) => (s === index ? -1 : s > index ? s - 1 : s));
    setDirty(true);
  }, []);

  const moveUp = useCallback((index: number) => {
    if (index <= 0) return;
    setItems((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
    setSelected((s) => (s === index ? index - 1 : s === index - 1 ? index : s));
    setDirty(true);
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: items }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Save failed");
      setDirty(false);
      setStatus({ msg: "Saved to disk" });
    } catch (e) {
      setStatus({ msg: (e as Error).message, error: true });
    } finally {
      setSaving(false);
    }
  }, [endpoint, key, items]);

  return {
    items,
    selected,
    setSelected,
    loading,
    saving,
    dirty,
    status,
    update,
    add,
    remove,
    moveUp,
    save,
  };
}
