import { RefObject, useEffect } from "react"
import { fromEvent } from "rxjs"
import { pluck } from "rxjs/operators"

export const useKeyCommand = <T extends HTMLElement>(ref: RefObject<T>) => {
  useEffect(() => {
    const key$ = fromEvent(ref.current!, "keydown").pipe(pluck("key"))
    const subscription = key$.subscribe(key => console.log(key))

    return () => subscription.unsubscribe()
  }, [])
}
