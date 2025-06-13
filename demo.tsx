import { cn } from "~/lib/utils"

import { useState } from "react"
import { DynamicSelect } from "~/components/ui/dynamic-select"
import type { SelectOption } from "./app/types/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"

const initialOptions: SelectOption[] = [
  { id: "1", label: "輕小說", color: "blue", value: "light-novel" },
  { id: "2", label: "漫畫", color: "orange", value: "manga" },
  { id: "3", label: "同人誌", color: "purple", value: "doujinshi" },
  { id: "4", label: "雜誌", color: "green", value: "magazine" },
  { id: "5", label: "書集", color: "gray", value: "book-collection" },
  { id: "6", label: "設定集", color: "purple", value: "settings-collection" },
]

const colors = ["blue", "green", "purple", "red", "orange", "yellow", "gray", "pink"]

export default function DynamicSelectDemo() {
  const [singleValue, setSingleValue] = useState<string>("")
  const [multiValue, setMultiValue] = useState<string[]>(["settings-collection"])
  const [options, setOptions] = useState<SelectOption[]>(initialOptions)
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Add this state to track keyboard navigation status
  const [keyboardNavActive, setKeyboardNavActive] = useState(false)

  const handleCreateOption = (label: string) => {
    const newValue = label.toLowerCase().replace(/\s+/g, "-")
    const newOption: SelectOption = {
      id: Date.now().toString(),
      label,
      color: colors[Math.floor(Math.random() * colors.length)],
      value: newValue,
    }
    setOptions([...options, newOption])

    // Note: We don't need to manually set the selection here anymore
    // as it's now handled directly in the DynamicSelect component
  }

  const handleReorder = (newOptions: SelectOption[]) => {
    setOptions(newOptions)
  }

  // Add this function to handle keyboard activity detection
  const handleKeyboardActivity = () => {
    setKeyboardNavActive(true)
    setTimeout(() => setKeyboardNavActive(false), 2000)
  }

  return (
    <div className={cn("min-h-screen p-8", isDarkMode && "dark")}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notion-Style Select Component</h1>
            <p className="text-muted-foreground mt-2">Dynamic select component with single and multi-select modes</p>
          </div>
          <Button onClick={() => setIsDarkMode(!isDarkMode)} variant="outline">
            Toggle {isDarkMode ? "Light" : "Dark"} Mode
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Single Select Mode</CardTitle>
              <CardDescription>Choose one option from the list</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <DynamicSelect
                options={options}
                value={singleValue}
                onChange={(value) => setSingleValue(value as string)}
                mode="single"
                placeholder="Select a category..."
                createNewOption={handleCreateOption}
                onReorder={handleReorder}
                onKeyboardActivity={handleKeyboardActivity}
              />
              <div className="text-sm text-muted-foreground">Selected: {singleValue || "None"}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Multi Select Mode</CardTitle>
              <CardDescription>Choose multiple options from the list</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <DynamicSelect
                options={options}
                value={multiValue}
                onChange={(value) => setMultiValue(value as string[])}
                mode="multi"
                placeholder="Select categories..."
                createNewOption={handleCreateOption}
                onReorder={handleReorder}
                onKeyboardActivity={handleKeyboardActivity}
              />
              <div className="text-sm text-muted-foreground">
                Selected: {multiValue.length > 0 ? multiValue.join(", ") : "None"}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✅ Single and multi-select modes</li>
              <li>✅ Search and filter options</li>
              <li>✅ Create new options on the fly</li>
              <li>✅ Duplicate option prevention</li>
              <li>✅ Full keyboard navigation (↑↓ arrows, Enter, Escape)</li>
              <li>✅ Drag and drop reordering</li>
              <li>✅ Screen reader accessible</li>
              <li>✅ Dark mode support</li>
              <li>✅ Notion-inspired design</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Keyboard Navigation & Duplicate Prevention</CardTitle>
            <CardDescription>Try these features to see the enhancements in action</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Keyboard Navigation:</h4>
                <ul className="space-y-1 text-muted-foreground ml-4">
                  <li>
                    • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">↑</kbd> /{" "}
                    <kbd className="px-1 py-0.5 bg-muted rounded text-xs">↓</kbd> Navigate options
                  </li>
                  <li>
                    • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> Select highlighted option
                  </li>
                  <li>
                    • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Escape</kbd> Close dropdown
                  </li>
                  <li>
                    • <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Tab</kbd> Close and move to next element
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Duplicate Prevention:</h4>
                <ul className="space-y-1 text-muted-foreground ml-4">
                  <li>• Try typing "輕小說&quot; or "manga&quot; - it will select the existing option</li>
                  <li>• Case-insensitive matching (try "MANGA&quot; or "manga")</li>
                  <li>• Only creates new options when they don't already exist</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {keyboardNavActive && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium shadow-lg">
          🎹 Keyboard Navigation Active
        </div>
      )}
    </div>
  )
}
