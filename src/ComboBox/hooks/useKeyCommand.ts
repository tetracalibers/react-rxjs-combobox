import { RefObject, useEffect } from "react"
import { fromEvent } from "rxjs"
import { pluck } from "rxjs/operators"

export const useKeyCommand = <T extends HTMLElement>(ref: RefObject<T>) => {
  useEffect(() => {
    const keyEvent$ = fromEvent(ref.current!, "keydown")
    const key$ = keyEvent$.pipe(pluck("key"))

    const evtSubsc = keyEvent$.subscribe(e => console.log(e.target))
    const keySubsc = key$.subscribe(key => console.log(key))

    return () => {
      evtSubsc.unsubscribe()
      keySubsc.unsubscribe()
    }
  }, [])
}
