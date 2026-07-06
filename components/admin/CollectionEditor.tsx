"use client";

import { Save, Plus, Trash2, ArrowUp } from "lucide-react";
import { Button } from "./fields";
import type { CollectionController } from "./useCollection";

interface Props<T> {
  controller: CollectionController<T>;
  itemLabel: (item: T) => string;
  itemSub?: (item: T) => string;
  addLabel: string;
  renderForm: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
}

export function CollectionEditor<T extends { id: string }>({
  controller,
  itemLabel,
  itemSub,
  addLabel,
  renderForm,
}: Props<T>) {
  const { items, selected, setSelected, loading, saving, dirty, status } =
    controller;
  const current = selected >= 0 ? items[selected] : undefined;

  if (loading) {
    return <p className="text-sm text-secondary">Loading…</p>;
  }

  return (
    <div>
      {/* toolbar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Button variant="accent" onClick={controller.save} disabled={saving || !dirty}>
          <Save className="h-4 w-4" />
          {saving ? "Saving…" : "Save to disk"}
        </Button>
        {dirty && <span className="text-xs text-accent">Unsaved changes</span>}
        {status && (
          <span
            className={`text-xs ${status.error ? "text-red-500" : "text-secondary"}`}
          >
            {status.msg}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* list */}
        <div className="lg:col-span-1">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-secondary">
              {items.length} item{items.length === 1 ? "" : "s"}
            </span>
            <button
              type="button"
              onClick={controller.add}
              className="flex items-center gap-1 text-xs uppercase tracking-wider text-accent hover:underline"
            >
              <Plus className="h-3 w-3" /> {addLabel}
            </button>
          </div>
          <ul className="space-y-1">
            {items.map((item, i) => (
              <li key={item.id}>
                <div
                  className={`group flex items-center gap-1 border px-3 py-2 ${
                    i === selected
                      ? "border-accent bg-card"
                      : "border-muted-border hover:border-accent/50"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelected(i)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="block truncate text-sm text-foreground">
                      {itemLabel(item) || "(untitled)"}
                    </span>
                    {itemSub && (
                      <span className="block truncate text-xs text-secondary">
                        {itemSub(item)}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => controller.moveUp(i)}
                    aria-label="Move up"
                    className="text-secondary opacity-0 transition-opacity hover:text-accent group-hover:opacity-100"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => controller.remove(i)}
                    aria-label="Delete"
                    className="text-secondary opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* detail form */}
        <div className="lg:col-span-2">
          {current ? (
            <div className="space-y-5">{renderForm(current, controller.update)}</div>
          ) : (
            <p className="text-sm text-secondary">
              Select an item to edit, or add a new one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
