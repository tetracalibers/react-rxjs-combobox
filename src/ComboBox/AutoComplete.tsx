import styled from "styled-components"
import { ChoiceItem } from "./types/ChoiceItem"
import { FloatLabelInput } from "./FloatLabelInput"
import { SelectList } from "./SelectList"
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react"
import { useInputFilter } from "./hooks/useInputFilter"
import { nanoid } from "nanoid"
import { ToggleArrowButton } from "./ToggleArrowButton"
import { fromEvent, merge } from "rxjs"
import { useUnFocus } from "./hooks/useUnFocus"

const Root = styled.div`
  display: flex;
  position: relative;
`

const getChildren = <T extends HTMLElement>(parent: T | null): HTMLElement[] =>
  parent ? (Array.from(parent.children) as HTMLElement[]) : []

const isValidTarget = (target: EventTarget | null): target is HTMLElement =>
  target !== null

const pickChild = (elems: HTMLElement[], offset: number) => (e: Event) => {
  if (isValidTarget(e.target)) {
    const idx = elems.indexOf(e.target)
    return elems[idx + offset]
  }
  return null
}

type AutoCompleteProps = {
  label: string
  choices: ChoiceItem[]
}

export const AutoComplete = ({ label, choices }: AutoCompleteProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const { filtered, word, updateWord: setWord } = useInputFilter(choices)

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

  useUnFocus(() => setIsOpen(false), rootRef)

  useEffect(() => {
    const elems = [inputRef.current!, ...getChildren(listRef.current)]

    const listKeyEvt$ = fromEvent<KeyboardEvent>(listRef.current!, "keydown")
    const inputKeyEvt$ = fromEvent<KeyboardEvent>(inputRef.current!, "keydown")
    const keyEvt$ = merge(listKeyEvt$, inputKeyEvt$)

    const next = pickChild(elems, 1)
    const prev = pickChild(elems, -1)

    const evtSubsc = keyEvt$.subscribe(e => {
      const key = e.key
      if (key === "ArrowDown") {
        if (!isOpen) setIsOpen(true)
        return next(e)?.focus()
      }
      if (key === "ArrowUp") {
        return prev(e)?.focus()
      }
      if (key === "Tab") {
        return setIsOpen(false)
      }
      if (key === "Escape") {
        inputRef.current?.focus()
        return setIsOpen(false)
      }
    })

    return () => {
      evtSubsc.unsubscribe()
    }
  }, [filtered, isOpen])

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
