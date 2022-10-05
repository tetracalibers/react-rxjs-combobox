import {
  Children,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  of,
  mergeMap,
  fromEvent,
  EMPTY,
  map,
  tap,
  debounceTime,
  throttleTime,
} from "rxjs"
import styled from "styled-components"

const Container = styled.div`
  margin: 0;
  height: 100vh;
  width: 100vw;
  overflow-y: auto;
  overflow-x: hidden;

  && > * {
    width: 100vw;
    height: 100vh;
    margin: 0;
  }
`

type ScrollifyProps = {
  children: [...ReactElement[]]
}

export const Scrollify = ({ children }: ScrollifyProps) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const [activePageIdx, setActivePageIdx] = useState(0)

  const prevPosY = useRef<number>(0)

  const pages = useMemo(() => {
    return Children.toArray(children)
  }, [children])

  const renderPages = useMemo(() => {
    const start = activePageIdx === 0 ? 0 : activePageIdx - 1
    const end =
      activePageIdx === pages.length ? activePageIdx - 1 : activePageIdx + 1

    return pages.slice(start, end + 1)
  }, [activePageIdx, pages])

  useEffect(() => {
    const ssc$ = of(rootRef?.current)
      .pipe(
        mergeMap(el => (el ? fromEvent(el, "scroll") : EMPTY)),
        throttleTime(500),
        map(e => e.target as HTMLElement),
        tap(el => {
          const wHeight = window.innerHeight
          const prevPageBottom = wHeight * (activePageIdx + 1)
          if (prevPosY.current < el.scrollTop) {
            el.scrollTop = wHeight * activePageIdx
            setActivePageIdx(prev => prev + 1)
          } else {
            el.scrollTop = wHeight * (activePageIdx - 1)
            setActivePageIdx(prevIdx => prevIdx - 1)
          }
          prevPosY.current = el.scrollTop
        }),
      )
      .subscribe()

    return () => ssc$.unsubscribe()
  }, [])

  return <Container ref={rootRef}>{children}</Container>
}
