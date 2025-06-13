import {
  ChevronDown,
  GripVertical,
  MoreHorizontal,
  Plus,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";
import type { DynamicSelectProps, SelectOption } from "~/types/select";

const colorClasses = {
  blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  purple:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  orange:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  yellow:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  gray: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  pink: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
};

export function DynamicSelect({
  options,
  value,
  onChange,
  mode = "single",
  placeholder = "Select an option...",
  createNewOption,
  onReorder,
  onKeyboardActivity,
  className,
}: DynamicSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value)
  );

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate a unique ID for the component instance
  const selectId = useRef(
    `notion-select-${Math.random().toString(36).substring(2, 9)}`
  ).current;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleOptionSelect = (option: SelectOption) => {
    if (mode === "single") {
      onChange(option.value);
      setIsOpen(false);
      setSearchTerm("");
    } else {
      const newValue = selectedValues.includes(option.value)
        ? selectedValues.filter((v) => v !== option.value)
        : [...selectedValues, option.value];
      onChange(newValue);
    }
  };

  const handleRemoveOption = (optionValue: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (mode === "single") {
      onChange("");
    } else {
      onChange(selectedValues.filter((v) => v !== optionValue));
    }
  };

  const handleCreateNew = () => {
    if (searchTerm.trim() && createNewOption) {
      const trimmedTerm = searchTerm.trim();

      // Check if an option with the same label already exists (case-insensitive)
      const existingOption = options.find(
        (option) => option.label.toLowerCase() === trimmedTerm.toLowerCase()
      );

      if (existingOption) {
        // If option exists, select it instead of creating a duplicate
        if (mode === "single") {
          onChange(existingOption.value);
          setIsOpen(false);
        } else {
          if (!selectedValues.includes(existingOption.value)) {
            onChange([...selectedValues, existingOption.value]);
          }
        }
        setSearchTerm("");
        return;
      }

      // Create new option if it doesn't exist
      const newOptionValue = trimmedTerm.toLowerCase().replace(/\s+/g, "-");
      createNewOption(trimmedTerm);

      // Auto-select the newly created option
      if (mode === "single") {
        onChange(newOptionValue);
        setIsOpen(false);
      } else {
        onChange([...selectedValues, newOptionValue]);
      }

      setSearchTerm("");
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (event: React.DragEvent, index: number) => {
    event.preventDefault();
    if (draggedIndex === null) return;

    const newOptions = [...options];
    const draggedOption = newOptions[draggedIndex];
    newOptions.splice(draggedIndex, 1);
    newOptions.splice(index, 0, draggedOption);

    if (onReorder) {
      onReorder(newOptions);
    }
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Trigger keyboard activity callback
    if (
      onKeyboardActivity &&
      (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter")
    ) {
      onKeyboardActivity();
    }

    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
        // Set initial highlight after opening
        setTimeout(() => setHighlightedIndex(0), 0);
      }
      return;
    }

    const maxIndex = filteredOptions.length - 1;
    const hasCreateOption =
      searchTerm.trim() && createNewOption && filteredOptions.length === 0;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (hasCreateOption) {
          setHighlightedIndex(0);
        } else if (filteredOptions.length > 0) {
          setHighlightedIndex((prev) => {
            const nextIndex = prev + 1;
            return nextIndex > maxIndex ? 0 : nextIndex;
          });
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (hasCreateOption) {
          setHighlightedIndex(0);
        } else if (filteredOptions.length > 0) {
          setHighlightedIndex((prev) => {
            const nextIndex = prev - 1;
            return nextIndex < 0 ? maxIndex : nextIndex;
          });
        }
        break;
      case "Enter":
        e.preventDefault();
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < filteredOptions.length
        ) {
          handleOptionSelect(filteredOptions[highlightedIndex]);
        } else if (searchTerm.trim() && createNewOption) {
          handleCreateNew();
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
        break;
      case "Tab":
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
        break;
    }
  };

  // Reset highlighted index when dropdown opens/closes
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(filteredOptions.length > 0 ? 0 : -1);
    } else {
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  // Adjust highlighted index when filtered options change
  useEffect(() => {
    if (isOpen && filteredOptions.length > 0) {
      // If current highlight is out of bounds, reset to first option
      if (highlightedIndex >= filteredOptions.length) {
        setHighlightedIndex(0);
      } else if (highlightedIndex < 0) {
        setHighlightedIndex(0);
      }
    } else if (isOpen && filteredOptions.length === 0) {
      // No filtered options, reset highlight
      setHighlightedIndex(-1);
    }
  }, [filteredOptions.length, isOpen]);

  // Get the ID of the currently highlighted option
  const getHighlightedOptionId = () => {
    if (highlightedIndex === -1) return undefined;

    if (filteredOptions.length === 0 && searchTerm && createNewOption) {
      return `${selectId}-create-option`;
    }

    if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
      return `${selectId}-option-${filteredOptions[highlightedIndex].id}`;
    }

    return undefined;
  };

  return (
    <div
      className={cn("relative", className)}
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      {/* Selected Values Display */}
      <div
        className="min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${selectId}-listbox`}
        aria-activedescendant={isOpen ? getHighlightedOptionId() : undefined}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <div className="flex flex-wrap gap-1 items-center">
          {selectedOptions.map((option) => (
            <span
              key={option.id}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
                colorClasses[option.color as keyof typeof colorClasses] ||
                  colorClasses.gray
              )}
            >
              {option.label}
              <button
                onClick={(e) => handleRemoveOption(option.value, e)}
                className="hover:bg-black/10 dark:hover:bg-white/10 rounded p-0.5"
                aria-label={`Remove ${option.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {selectedOptions.length === 0 && (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="h-4 w-4 ml-auto text-muted-foreground" />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg">
          <div className="p-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search or create..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1 text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground"
              onKeyDown={(e) => {
                // Only handle Enter for creating new options, let parent handle navigation
                if (
                  e.key === "Enter" &&
                  searchTerm.trim() &&
                  createNewOption &&
                  filteredOptions.length === 0
                ) {
                  e.preventDefault();
                  handleCreateNew();
                }
                // Don't handle arrow keys here - let the parent component handle them
              }}
            />
          </div>

          <div
            className="max-h-60 overflow-y-auto"
            ref={listboxRef}
            role="listbox"
            id={`${selectId}-listbox`}
            aria-multiselectable={mode === "multi"}
          >
            {filteredOptions.length === 0 && searchTerm ? (
              createNewOption ? (
                <div
                  id={`${selectId}-create-option`}
                  onClick={handleCreateNew}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2 cursor-pointer",
                    highlightedIndex === 0 &&
                      filteredOptions.length === 0 &&
                      "bg-accent text-accent-foreground ring-1 ring-ring"
                  )}
                  onMouseEnter={() => setHighlightedIndex(0)}
                  role="option"
                  aria-selected={false}
                >
                  <Plus className="h-4 w-4" />
                  Create "{searchTerm}"
                </div>
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No options found
                </div>
              )
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={option.id}
                  id={`${selectId}-option-${option.id}`}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground",
                    selectedValues.includes(option.value) && "bg-accent/50",
                    highlightedIndex === index &&
                      "bg-accent/70 ring-1 ring-ring"
                  )}
                  onClick={() => handleOptionSelect(option)}
                  role="option"
                  aria-selected={selectedValues.includes(option.value)}
                  draggable={!!onReorder}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {onReorder && (
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  )}
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-1 rounded text-xs font-medium flex-1",
                      colorClasses[option.color as keyof typeof colorClasses] ||
                        colorClasses.gray
                    )}
                  >
                    {option.label}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle option menu actions
                    }}
                    className="p-1 hover:bg-accent rounded"
                    aria-label={`More options for ${option.label}`}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
