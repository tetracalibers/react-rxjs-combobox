import { useEffect, useRef, useState } from "react"
import {
  catchError,
  debounceTime,
  exhaustMap,
  fromEvent,
  map,
  of,
  switchMap,
} from "rxjs"
import { fromFetch } from "rxjs/fetch"

type Parameters = {
  mode?: string
  country?: string
  lang?: string
  entity: string
  attribute: string
  term: string
  sort?: string
  limit?: number
  options?: { [t in string]: string }
}

const getQueryUrl = ({
  mode = "search",
  country = "jp",
  lang = "ja_jp",
  entity,
  attribute,
  term,
  sort = "popular",
  limit = 200,
  options = {},
}: Parameters) => {
  const optionsParam = Object.keys(options).map(
    key => `&${key}=${options[key]}`,
  )

  const byModeParam =
    mode == "search" ? `&term=${term}&attribute=${attribute}` : `&sort=${sort}`

  return `https://itunes.apple.com/${mode}?lang=${lang}&entity=${entity}&country=${country}${byModeParam}&limit=${limit}${optionsParam}`
}

const getArtistSearchParameters = (term: string) => ({
  entity: "musicArtist",
  attribute: "artistTerm",
  term,
})

type ArtistInfo = {
  amgArtistId: number
  artistId: number
  artistLinkUrl: string
  artistName: string
  artistType: string
  primaryGenreId: number
  primaryGenreName: string
  wrapperType: string
}

type ResponseJson = {
  results: ArtistInfo[]
  resultCount: number
}

export const ArtistInput = () => {
  const [result, setResult] = useState<string[]>([])

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const word$ = fromEvent(inputRef.current!, "input")
      .pipe(
        map(e => (e.target as HTMLInputElement)?.value),
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
            map((obj: ResponseJson) =>
              setResult(obj.results.map(o => o.artistName)),
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

  return (
    <>
      <input type="text" placeholder="Artist Name" ref={inputRef} />
      <ul>
        {result.map(result => (
          <li>{result}</li>
        ))}
      </ul>
    </>
  )
}
