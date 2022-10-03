import styled from "styled-components"
import { ChoiceItem } from "./types/ChoiceItem"
import { FloatLabelInput } from "./FloatLabelInput"
import { SelectList } from "./SelectList"
import { ChangeEvent, useMemo, useRef } from "react"
import { useInputFilter } from "./hooks/useInputFilter"
import { nanoid } from "nanoid"
import { ToggleArrowButton } from "./ToggleArrowButton"
import { useUnFocus } from "./hooks/useUnFocus"
import { ScanTarget, useScanToggleList } from "./hooks/useScanToggleList"

const Root = styled.div`
  display: flex;
  position: relative;
  width: 100%;
`

type AutoCompleteProps = {
  label: string
  choices: ChoiceItem[]
}

export const AutoComplete = ({ label, choices }: AutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const { filtered, word, updateWord: setWord } = useInputFilter(choices)

  const scanTargets: ScanTarget<HTMLInputElement | HTMLUListElement>[] =
    useMemo(
      () => [
        {
          ref: inputRef,
          scanChildren: false,
        },
        {
          ref: listRef,
          scanChildren: true,
        },
      ],
      [],
    )
  const { isOpen, setIsOpen } = useScanToggleList(scanTargets, filtered)

  useUnFocus(() => setIsOpen(false), rootRef)

  const typing = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isOpen) setIsOpen(true)
    setWord(e.target.value)
  }

  const select = (item: ChoiceItem) => {
    setIsOpen(false)
    setWord(item.label)
    inputRef.current?.focus()
  }

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
      <ToggleArrowButton
        isOpen={isOpen}
        onClick={() => setIsOpen(flg => !flg)}
      />
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
