"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

type FieldConfig = { key: string; label: string; type?: "text" | "textarea" };

export function CvRepeater<T extends Record<string, string>>({
  items,
  onChange,
  fields,
  emptyItem,
  addLabel,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  fields: FieldConfig[];
  emptyItem: T;
  addLabel: string;
}) {
  function updateItem(index: number, key: string, value: string) {
    const next = [...items];
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="relative rounded-md border border-border p-4">
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="absolute right-3 top-3 text-muted-foreground hover:text-destructive"
            aria-label="Remove"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <div className="grid gap-3 pr-6 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2 space-y-1.5" : "space-y-1.5"}>
                <Label className="text-xs">{f.label}</Label>
                {f.type === "textarea" ? (
                  <textarea
                    rows={2}
                    value={item[f.key] ?? ""}
                    onChange={(e) => updateItem(index, f.key, e.target.value)}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                ) : (
                  <Input value={item[f.key] ?? ""} onChange={(e) => updateItem(index, f.key, e.target.value)} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => onChange([...items, emptyItem])}>
        <Plus className="h-3.5 w-3.5" /> {addLabel}
      </Button>
    </div>
  );
}
