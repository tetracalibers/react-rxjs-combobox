import _ from "lodash"
import { ChoiceItem } from "./types/ChoiceItem"
import { Root } from "./Root"
import { AutoComplete } from "./AutoComplete"

type ComboBoxProps = {
  choices: ChoiceItem[]
  label: string
  onSelect?: (selected: ChoiceItem) => void
  initialSelected?: ChoiceItem
}

export const ComboBox = ({
  choices,
  label,
  onSelect,
  initialSelected,
}: ComboBoxProps) => {
  return (
    <Root>
      <AutoComplete label={label} choices={choices} />
    </Root>
  )
}
