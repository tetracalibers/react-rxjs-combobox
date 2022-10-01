import { ChoiceItem } from "../types/ChoiceItem"
import { Subject, Observable } from "rxjs"
import { Dispatch, Ref, SetStateAction } from "react"

type State = {
  visitsItem: ChoiceItem | null
  all: ChoiceItem[]
  selected: ChoiceItem[]
}

const subject$ = new Subject<State>()

const emptyState: State = {
  visitsItem: null,
  all: [],
  selected: [],
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
  visit: (item: ChoiceItem) => {
    state = { ...state, visitsItem: item }
    subject$.next(state)
  },
}
