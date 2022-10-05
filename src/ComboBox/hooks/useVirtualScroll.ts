import { RefObject, useEffect, useMemo, useState } from "react"
import { EMPTY, fromEvent, map, mergeMap, of } from "rxjs"
import { ChoiceItem } from "../types/ChoiceItem"

type HookArgs<T extends number | string> = {
  rootRef: RefObject<HTMLDivElement>
  items: ChoiceItem<T>[]
  vAreaHeight: number
  vItemHeight: number
}

const RESERVE_ITEM_COUNT = 3

export const useVirtualScroll = <T extends number | string>({
  rootRef,
  items,
  vItemHeight,
  vAreaHeight,
}: HookArgs<T>) => {
  const renderItemsMax = Math.floor(
    vAreaHeight / vItemHeight + RESERVE_ITEM_COUNT,
  )
  const [startIdx, setStartIdx] = useState(0)

  useEffect(() => {
    const ssc$ = of(rootRef?.current)
      .pipe(
        mergeMap(el => (el ? fromEvent(el, "scroll") : EMPTY)),
        map(e => e.target as HTMLElement),
        map(el => el.scrollTop),
        map(top => Math.floor(top / vItemHeight)),
      )
      .subscribe(nextStartIdx => setStartIdx(nextStartIdx))

    return () => ssc$.unsubscribe()
  }, [])

  const renderItems = useMemo(
    () => items.slice(startIdx, startIdx + renderItemsMax),
    [items, startIdx, renderItemsMax],
  )

  return { renderItems, startIdx }
}
