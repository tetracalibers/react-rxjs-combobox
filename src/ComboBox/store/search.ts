import { ChoiceItem } from "../types/ChoiceItem"
import { Subject } from "rxjs"
import { Dispatch, SetStateAction } from "react"

type State = {
  all: ChoiceItem[]
  filtered: ChoiceItem[]
  selected: ChoiceItem | null
  word: string
}

const subject$ = new Subject<State>()

const emptyState: State = {
  all: [],
  filtered: [],
  selected: null,
  word: "",
}

let state: State = emptyState

export const store = {
  emptyState,
  init: (all: ChoiceItem[]) => {
    state = { ...emptyState, all }
    subject$.next(state)
  },
  subscribe: (setState: Dispatch<SetStateAction<State>>) => {
    return subject$.subscribe(setState)
  },
  unsubscribe: () => subject$.unsubscribe,
  search: (word: string) => {
    state = { ...state, word }
  },
}
