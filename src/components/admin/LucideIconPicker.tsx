import { useState } from "react";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import DynamicIcon from "./DynamicIcon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const COMMON_ICONS = [
  "users", "church", "wine", "utensils-crossed", "music", "disc-3",
  "tent", "triangle-alert", "bath", "shower-head", "home",
  "heart", "star", "camera", "map-pin", "clock", "calendar",
  "gift", "sun", "moon", "cloud", "umbrella", "plane",
  "car", "bus", "train", "bike", "coffee", "beer",
  "cake", "pizza", "mic", "guitar", "drum",
  "sparkles", "flame", "leaf", "flower-2", "tree-pine",
  "mountain", "waves", "anchor", "compass", "flag",
  "trophy", "medal", "crown", "gem", "palette",
  "party-popper", "glass-water", "utensils", "salad", "sandwich",
];

interface LucideIconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

const LucideIconPicker = ({ value, onChange }: LucideIconPickerProps) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const allIcons = search
    ? Object.keys(dynamicIconImports).filter(name => name.includes(search.toLowerCase()))
    : COMMON_ICONS;

  const displayIcons = allIcons.slice(0, 60);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2">
          {value && <DynamicIcon name={value} className="w-4 h-4" />}
          <span className="text-sm truncate">{value || "Seleccionar icono"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="start">
        <Input
          placeholder="Buscar icono..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-2"
        />
        <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto">
          {displayIcons.map(name => (
            <button
              key={name}
              type="button"
              onClick={() => { onChange(name); setOpen(false); setSearch(""); }}
              className={`p-2 rounded hover:bg-muted transition-colors ${value === name ? "bg-primary/20 ring-1 ring-primary" : ""}`}
              title={name}
            >
              <DynamicIcon name={name} className="w-4 h-4 mx-auto" />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LucideIconPicker;
