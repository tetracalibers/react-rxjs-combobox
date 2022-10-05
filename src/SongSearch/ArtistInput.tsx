import { nanoid } from "nanoid"
import { ChangeEvent, memo, useEffect, useMemo, useRef, useState } from "react"
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  exhaustMap,
  map,
  of,
  switchMap,
  tap,
} from "rxjs"
import { fromFetch } from "rxjs/fetch"
import styled from "styled-components"
import { FloatLabelInput } from "../ComboBox/FloatLabelInput"
import { SelectList } from "../ComboBox/SelectList"
import { ChoiceItem } from "../ComboBox/types/ChoiceItem"
import { getQueryUrl } from "./hooks/useiTunesAPI"
import { ResponseJson } from "./types/ResponseJson"
import { getArtistSearchParameters } from "./utility/fetch"

const _Root = styled.div`
  display: flex;
  position: relative;
  width: 100%;
`

const Root = memo(_Root)

export const ArtistInput = () => {
  const [result, setResult] = useState<ChoiceItem<number>[]>([])
  const [artistId, setArtistId] = useState<number>()
  const [word, setWord] = useState("")

  const subject$ = useMemo(() => new BehaviorSubject<string>(""), [])

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const word$ = subject$
      .pipe(
        debounceTime(500),
        map(getArtistSearchParameters),
        map(getQueryUrl),
        exhaustMap(url =>
          fromFetch(url).pipe(
            switchMap(res => {
              if (res.ok) {
                return res.json()
              }
              // サーバーエラー
              return of({ error: true, message: `Error ${res.status}` })
            }),
            tap((obj: ResponseJson) =>
              setResult(
                obj.results.map(o => ({
                  label: o.artistName,
                  value: o.artistId,
                })),
              ),
            ),
            catchError(err => {
              // ネットワークエラーとか
              console.error(err)
              return of({ error: true, message: err.message })
            }),
          ),
        ),
      )
      .subscribe()

    return () => word$.unsubscribe()
  }, [])

  const label = useMemo(() => "Artist Name", [])

  const inputId = useMemo(() => nanoid(), [])
  const listId = useMemo(() => nanoid(), [])

  const typing = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setWord(v)
    subject$.next(v)
  }

  const select = (item: ChoiceItem<number>) => {
    setArtistId(item.value)
    setResult([])
    setWord(item.label)
  }

  return (
    <Root>
      <FloatLabelInput
        type="text"
        label={label}
        id={inputId}
        ref={inputRef}
        value={word}
        onChange={typing}
      />
      <SelectList
        label={label}
        id={listId}
        items={result}
        hidden={false}
        onSelectItem={select}
      />
    </Root>
  )
}
