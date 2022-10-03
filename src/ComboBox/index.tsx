import _ from "lodash"
import { ChoiceItem } from "./types/ChoiceItem"
import { AutoComplete } from "./AutoComplete"
import styled from "styled-components"
import { memo } from "react"

const _Root = styled.div`
  position: relative;
  display: block;
  width: 250px;
  height: 50vh;
  margin: 0 auto;
  font-size: 16px;
  color: #60666d;
`

const Root = memo(_Root)

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
