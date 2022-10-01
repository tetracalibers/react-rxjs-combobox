import { RefObject, useState, useEffect } from "react"
import { ChoiceItem } from "../types/ChoiceItem"
import { fromEvent } from "rxjs"
import { map } from "rxjs/operators"

export const useInputFilter = (
  inputRef: RefObject<HTMLInputElement>,
  all: ChoiceItem[],
) => {
  const [filtered, setFiltered] = useState(all)

  useEffect(() => {
    const searchWord$ = fromEvent(inputRef.current!, "input").pipe(
      map(e => (e.target as HTMLInputElement).value),
      map(s => s.trim().toLowerCase()),
    )

    const filtered$ = searchWord$.pipe(
      map(s =>
        all.filter(({ label }) => label.trim().toLowerCase().includes(s)),
      ),
    )

    const subscription = filtered$.subscribe(items => setFiltered(items))

    return () => subscription.unsubscribe()
  }, [])

  return filtered
}
