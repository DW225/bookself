export interface SelectOption {
  id: string
  label: string
  color: string
  value: string
}

export interface DynamicSelectProps {
  options: SelectOption[]
  value?: string | string[]
  onChange: (value: string | string[]) => void
  mode?: "single" | "multi"
  placeholder?: string
  createNewOption?: (label: string) => void
  onReorder?: (options: SelectOption[]) => void
  onKeyboardActivity?: () => void
  className?: string
}
