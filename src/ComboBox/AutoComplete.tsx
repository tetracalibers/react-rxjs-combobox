import styled from "styled-components"
import { ChoiceItem } from "./types/ChoiceItem"
import { FloatLabelInput } from "./FloatLabelInput"
import { SelectList } from "./SelectList"
import { memo, useMemo, useRef } from "react"
import { nanoid } from "nanoid"
import { ToggleArrowButton } from "./ToggleArrowButton"
import { useAutoComplete } from "./hooks/useAutoComplete"

const _Root = styled.div`
  display: flex;
  position: relative;
  width: 100%;
`

const Root = memo(_Root)

type AutoCompleteProps = {
  label: string
  choices: ChoiceItem[]
}

const _AutoComplete = ({ label, choices }: AutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const { word, filtered, isOpen, typing, select, toggleOpen } =
    useAutoComplete(choices, inputRef, listRef, rootRef)

  const inputId = useMemo(() => nanoid(), [])
  const listId = useMemo(() => nanoid(), [])

  return (
    <Root ref={rootRef}>
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
        value={word}
        onChange={typing}
      />
      <ToggleArrowButton isOpen={isOpen} onClick={toggleOpen} />
      <SelectList
        label={label}
        items={filtered}
        id={listId}
        ref={listRef}
        hidden={!isOpen}
        onSelectItem={select}
      />
    </Root>
  )
}

export const AutoComplete = memo(_AutoComplete)
