import _ from "lodash"
import { ChoiceItem } from "./types/ChoiceItem"
import { AutoComplete } from "./AutoComplete"
import styled from "styled-components"

const Root = styled.div`
  position: relative;
  display: block;
  width: 200px;
  height: 50vh;
  margin: 0 auto;
  font-size: 18px;
  color: #60666d;
`

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
