"use client";

import { useCollection } from "./useCollection";
import { CollectionEditor } from "./CollectionEditor";
import { TextInput, TextArea, Checkbox, StringList, nextId } from "./fields";
import type { Experience } from "@/types";

function blankExperience(items: Experience[]): Experience {
  return {
    id: nextId(items),
    company: "",
    position: "",
    location: "",
    type: "Full-time",
    startDate: "",
    endDate: null,
    current: false,
    description: "",
    responsibilities: [],
    technologies: [],
    achievements: [],
  };
}

export function ExperienceAdmin() {
  const controller = useCollection<Experience>(
    "/api/admin/experience",
    "experience",
    blankExperience
  );

  return (
    <CollectionEditor
      controller={controller}
      addLabel="Add role"
      itemLabel={(e) => e.position}
      itemSub={(e) => `${e.company}${e.current ? " · current" : ""}`}
      renderForm={(e, update) => (
        <>
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Position"
              value={e.position}
              onChange={(v) => update({ position: v })}
            />
            <TextInput
              label="Company"
              value={e.company}
              onChange={(v) => update({ company: v })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Location"
              value={e.location}
              onChange={(v) => update({ location: v })}
            />
            <TextInput
              label="Type"
              value={e.type}
              onChange={(v) => update({ type: v })}
              hint="Full-time, Internship, Contract…"
            />
          </div>
          <div className="grid grid-cols-2 items-end gap-4">
            <TextInput
              label="Start date"
              value={e.startDate}
              onChange={(v) => update({ startDate: v })}
              placeholder="YYYY-MM"
              mono
            />
            <TextInput
              label="End date"
              value={e.endDate ?? ""}
              onChange={(v) => update({ endDate: v.trim() === "" ? null : v })}
              placeholder="YYYY-MM (blank = present)"
              mono
            />
          </div>
          <Checkbox
            label="Current role"
            checked={e.current}
            onChange={(v) => update({ current: v })}
          />
          <TextArea
            label="Description"
            value={e.description}
            onChange={(v) => update({ description: v })}
            rows={3}
          />
          <StringList
            label="Responsibilities"
            value={e.responsibilities}
            onChange={(v) => update({ responsibilities: v })}
          />
          <StringList
            label="Achievements"
            value={e.achievements}
            onChange={(v) => update({ achievements: v })}
          />
          <StringList
            label="Technologies"
            value={e.technologies}
            onChange={(v) => update({ technologies: v })}
            placeholder="e.g. PostgreSQL"
          />
        </>
      )}
    />
  );
}
