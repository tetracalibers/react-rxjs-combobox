import { RefObject, useCallback, useLayoutEffect, useState } from "react"
import { ChoiceItem } from "../types/ChoiceItem"
import { fromEvent, merge } from "rxjs"

export type ScanTarget<T extends HTMLElement = HTMLElement> = {
  ref: RefObject<T>
  scanChildren: boolean
}

const getChildren = <T extends HTMLElement>(parent: T | null): HTMLElement[] =>
  parent ? (Array.from(parent.children) as HTMLElement[]) : []

const isValidTarget = (target: EventTarget | null): target is HTMLElement =>
  target !== null

const pickSibling = (elems: HTMLElement[], offset: number) => (e: Event) => {
  if (isValidTarget(e.target)) {
    const idx = elems.indexOf(e.target)
    return elems[idx + offset]
  }
  return null
}

const getElems = <T extends HTMLElement>(
  targets: ScanTarget<T>[],
): HTMLElement[] => {
  return targets
    .map(({ ref, scanChildren }) => {
      return scanChildren
        ? getChildren(ref.current)
        : ref.current
        ? ref.current
        : []
    })
    .flat()
}

export const useScanToggleList = <T extends HTMLElement>(
  targets: ScanTarget<T>[],
  visibleItems: ChoiceItem<string>[],
) => {
  const [isOpen, setIsOpen] = useState(false)

  const onKeyStroke = useCallback(
    (e: KeyboardEvent) => {
      const elems = getElems(targets)
      const key = e.key
      if (key === "ArrowDown") {
        if (!isOpen) setIsOpen(true)
        return pickSibling(elems, 1)(e)?.focus()
      }
      if (key === "ArrowUp") {
        return pickSibling(elems, -1)(e)?.focus()
      }
      if (key === "Tab") {
        return setIsOpen(false)
      }
      if (key === "Escape") {
        elems[0].focus()
        return setIsOpen(false)
      }
    },
    [visibleItems, isOpen],
  )

  useLayoutEffect(() => {
    const keyEvtByRef$ = targets
      .map(({ ref }) =>
        ref.current ? fromEvent<KeyboardEvent>(ref.current, "keydown") : [],
      )
      .flat()
    const keyEvt$ = merge(...keyEvtByRef$)
    const keyEventSubscription = keyEvt$.subscribe(e => onKeyStroke(e))

    return () => {
      keyEventSubscription.unsubscribe()
    }
  }, [])

  return { isOpen, setIsOpen }
}
