import { RefObject, useEffect, useState } from "react"
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

const getKeyEvent$ = <T extends HTMLElement>(targets: ScanTarget<T>[]) => {
  const keyEvtByRef$ = targets
    .map(({ ref }) =>
      ref.current ? fromEvent<KeyboardEvent>(ref.current, "keydown") : [],
    )
    .flat()
  return merge(...keyEvtByRef$)
}

export const useScanToggleList = <T extends HTMLElement>(
  targets: ScanTarget<T>[],
  visibleItems: ChoiceItem[],
) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const elems = getElems(targets)
    const keyEvt$ = getKeyEvent$(targets)

    const first = elems[0]
    const next = pickSibling(elems, 1)
    const prev = pickSibling(elems, -1)

    const keyEventSubscription = keyEvt$.subscribe(e => {
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
        first.focus()
        return setIsOpen(false)
      }
    })

    return () => {
      keyEventSubscription.unsubscribe()
    }
  }, [visibleItems, isOpen])

  return { isOpen, setIsOpen }
}