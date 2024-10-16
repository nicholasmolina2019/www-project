// components/MultiSelect.tsx

"use client";

import * as React from "react";
import { Controller, Control } from "react-hook-form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/registry/new-york/ui/popover"; // Adjust the import path as necessary
import { Button } from "@/registry/new-york/ui/button"; // Adjust the import path as necessary
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandInput,
  CommandList,
} from "@/registry/new-york/ui/command"; // Import Command components
import { Check, ChevronsUpDown } from "lucide-react";

interface OptionType {
  label: string;
  value: string;
}

interface MultiSelectProps {
  control: Control<any>;
  name: string;
  options: OptionType[];
  placeholder: string;
  required?: boolean;
}

export function MultiSelect({
  control,
  name,
  options,
  placeholder,
  required = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const { value = [], onChange } = field;

        const handleSelectItem = (optionValue: string) => {
          if (value.includes(optionValue)) {
            onChange(value.filter((v: string) => v !== optionValue));
          } else {
            onChange([...value, optionValue]);
          }
        };

        const selectedLabels = options
          .filter((option) => value.includes(option.value))
          .map((option) => option.label);

        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                <span className="line-clamp-1">
                  {selectedLabels.length > 0 ? selectedLabels.join(", ") : placeholder}
                </span>
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-full p-0"
              align="start" // Align the dropdown to the start (left)
              sideOffset={4} // Adjust vertical spacing as needed
            >
              <Command>
                <CommandInput placeholder="Search..." />
                <CommandList>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        onSelect={() => handleSelectItem(option.value)}
                      >
                        <div className="mr-2 h-4 w-4 flex items-center justify-center">
                          {value.includes(option.value) ? (
                            <Check className="h-4 w-4" />
                          ) : null}
                        </div>
                        <span>{option.label}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
}
