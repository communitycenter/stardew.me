"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const backgrounds = [
  {
    label: "No background",
    value: null,
  },
  {
    label: "Day background",
    value: "day",
  },
  {
    label: "Night background",
    value: "night",
  },
];

interface ComboboxDemoProps {
  value: React.SetStateAction<string | null>;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
}

const ComboboxDemo: React.FC<ComboboxDemoProps> = ({ value, setValue }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? backgrounds.find((background) => background.value === value)
                ?.label || "No background"
            : "No background"}

          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandGroup>
            {backgrounds.map((background) => (
              <CommandItem
                key={background.value}
                onSelect={() => {
                  setValue(background.value); // Set the value to the background value
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === background.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {background.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboboxDemo;
