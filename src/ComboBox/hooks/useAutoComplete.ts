import { ChangeEvent, RefObject, useMemo } from "react"
import { ChoiceItem } from "../types/ChoiceItem"
import { useInputFilter } from "./useInputFilter"
import { ScanTarget, useScanToggleList } from "./useScanToggleList"
import { useUnFocus } from "./useUnFocus"

export const useAutoComplete = <ROOT extends HTMLElement = HTMLDivElement>(
  options: ChoiceItem[],
  inputRef: RefObject<HTMLInputElement>,
  listRef: RefObject<HTMLUListElement>,
  rootRef: RefObject<ROOT>,
) => {
  const { filtered, word, updateWord: setWord } = useInputFilter(options)

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

  const toggleOpen = () => setIsOpen(flag => !flag)

  return {
    word,
    filtered,
    isOpen,
    typing,
    select,
    toggleOpen,
  }
}
