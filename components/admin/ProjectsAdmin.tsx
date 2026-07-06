"use client";

import { useCollection } from "./useCollection";
import { CollectionEditor } from "./CollectionEditor";
import { TextInput, TextArea, NumberInput, Select, StringList, nextId } from "./fields";
import type { Project } from "@/types";

const STATUSES = ["in-progress", "completed", "archived"];

function blankProject(items: Project[]): Project {
  return {
    id: nextId(items),
    title: "",
    description: "",
    longDescription: "",
    image: "",
    tags: [],
    category: "",
    status: "completed",
    year: new Date().getFullYear(),
    client: "",
    duration: "",
    role: "",
    links: {},
    metrics: { users: "", performance: "", impact: "" },
  };
}

export function ProjectsAdmin() {
  const controller = useCollection<Project>(
    "/api/admin/projects",
    "projects",
    blankProject
  );

  return (
    <CollectionEditor
      controller={controller}
      addLabel="Add project"
      itemLabel={(p) => p.title}
      itemSub={(p) => `${p.status} · ${p.year}`}
      renderForm={(p, update) => (
        <>
          <TextInput label="Title" value={p.title} onChange={(v) => update({ title: v })} />
          <TextArea
            label="Description"
            value={p.description}
            onChange={(v) => update({ description: v })}
            rows={2}
            hint="Short one-liner shown on cards"
          />
          <TextArea
            label="Long description"
            value={p.longDescription}
            onChange={(v) => update({ longDescription: v })}
            rows={5}
          />
          <TextInput
            label="Image URL"
            value={p.image}
            onChange={(v) => update({ image: v })}
            mono
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Status"
              value={p.status}
              onChange={(v) => update({ status: v as Project["status"] })}
              options={STATUSES}
            />
            <NumberInput label="Year" value={p.year} onChange={(v) => update({ year: v })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Category"
              value={p.category}
              onChange={(v) => update({ category: v })}
            />
            <TextInput label="Role" value={p.role} onChange={(v) => update({ role: v })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Client"
              value={p.client}
              onChange={(v) => update({ client: v })}
            />
            <TextInput
              label="Duration"
              value={p.duration}
              onChange={(v) => update({ duration: v })}
            />
          </div>
          <StringList
            label="Tags"
            value={p.tags}
            onChange={(v) => update({ tags: v })}
            placeholder="e.g. Python"
          />

          <fieldset className="border-t border-muted-border pt-4">
            <legend className="mb-3 text-xs uppercase tracking-wider text-accent">
              Links
            </legend>
            <div className="space-y-4">
              <TextInput
                label="GitHub"
                value={p.links.github ?? ""}
                onChange={(v) => update({ links: { ...p.links, github: v } })}
                mono
              />
              <TextInput
                label="Demo"
                value={p.links.demo ?? ""}
                onChange={(v) => update({ links: { ...p.links, demo: v } })}
                mono
              />
              <TextInput
                label="Documentation"
                value={p.links.documentation ?? ""}
                onChange={(v) => update({ links: { ...p.links, documentation: v } })}
                mono
              />
            </div>
          </fieldset>

          <fieldset className="border-t border-muted-border pt-4">
            <legend className="mb-3 text-xs uppercase tracking-wider text-accent">
              Metrics
            </legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <TextInput
                label="Users"
                value={p.metrics.users}
                onChange={(v) => update({ metrics: { ...p.metrics, users: v } })}
              />
              <TextInput
                label="Performance"
                value={p.metrics.performance}
                onChange={(v) => update({ metrics: { ...p.metrics, performance: v } })}
              />
              <TextInput
                label="Impact"
                value={p.metrics.impact}
                onChange={(v) => update({ metrics: { ...p.metrics, impact: v } })}
              />
            </div>
          </fieldset>
        </>
      )}
    />
  );
}
