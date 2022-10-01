import styled from "styled-components"
import { ChoiceItem } from "./types/ChoiceItem"
import { FloatLabelInput } from "./FloatLabelInput"
import { SelectList } from "./SelectList"
import { useMemo, useRef } from "react"
import { useInputFilter } from "./hooks/useInputFilter"
import { nanoid } from "nanoid"
import { useKeyCommand } from "./hooks/useKeyCommand"
import { ToggleArrowButton } from "./ToggleArrowButton"

const Root = styled.div`
  display: flex;
  position: relative;
`

type AutoCompleteProps = {
  label: string
  choices: ChoiceItem[]
}

export const AutoComplete = ({ label, choices }: AutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const filtered = useInputFilter(inputRef, choices)

  const inputId = useMemo(() => nanoid(), [])
  const listId = useMemo(() => nanoid(), [])

  useKeyCommand(listRef)

  return (
    <Root>
      <FloatLabelInput
        label={label}
        ref={inputRef}
        aria-owns={listId}
        aria-autocomplete="list"
        role="combobox"
        aria-expanded="true"
        autoCapitalize="none"
        autoComplete="off"
        type="text"
        id={inputId}
      />
      <ToggleArrowButton isOpen={true} />
      <SelectList label={label} items={filtered} id={listId} ref={listRef} />
    </Root>
  )
}
