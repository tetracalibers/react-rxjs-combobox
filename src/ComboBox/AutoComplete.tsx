import styled from "styled-components"
import { ChoiceItem } from "./types/ChoiceItem"
import { FloatLabelInput } from "./FloatLabelInput"
import { SelectList } from "./SelectList"
import { useRef } from "react"
import { useInputFilter } from "./hooks/useInputFilter"

const Root = styled.div`
  --icon-size: 2rem;
  --icon-color: #0396ff;

  display: flex;
  position: relative;

  & button {
    position: absolute;
    right: 2.5%;
    top: 50%;
    transform: translateY(-50%);
  }

  & button svg {
    width: var(--icon-size);
    height: var(--icon-size);
    fill: var(--icon-color);
    stroke: var(--icon-color);
    transform: rotate(0deg);
    transition: transform 0.5s ease;
  }

  & button[data-open="true"] svg {
    transform: rotate(180deg);
  }
`

type AutoCompleteProps = {
  label: string
  choices: ChoiceItem[]
}

export const AutoComplete = ({ label, choices }: AutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const filtered = useInputFilter(inputRef, choices)

  return (
    <Root>
      <FloatLabelInput label={label} ref={inputRef} />
      <SelectList label={label} items={filtered} />
    </Root>
  )
}
