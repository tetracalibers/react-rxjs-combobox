import { useState, useEffect, useMemo } from "react"
import { ChoiceItem } from "../types/ChoiceItem"
import { BehaviorSubject } from "rxjs"

export const useInputFilter = (all: ChoiceItem[]) => {
  const [filtered, setFiltered] = useState(all)
  const [word, setWord] = useState("")

  const subject$ = useMemo(() => new BehaviorSubject<string>(""), [])

  useEffect(() => {
    const subscription = subject$.subscribe(s => {
      setWord(s)
      setFiltered(
        all.filter(({ label }) =>
          label.trim().toLowerCase().includes(s.trim().toLowerCase()),
        ),
      )
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const updateWord = (word: string) => subject$.next(word)

  return { filtered, word, updateWord } as const
}
