import { catchError, of, switchMap } from "rxjs"
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

export const getQueryUrl = ({
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

export const useiTunesAPI = ({
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

  const url = `https://itunes.apple.com/${mode}?lang=${lang}&entity=${entity}&country=${country}${byModeParam}&limit=${limit}${optionsParam}`

  const fetch$ = (url: string) =>
    fromFetch(url).pipe(
      switchMap(res => {
        if (res.ok) {
          return res.json()
        }
        // サーバーエラー
        return of({ error: true, message: `Error ${res.status}` })
      }),
      catchError(err => {
        // ネットワークエラーとか
        console.error(err)
        return of({ error: true, message: err.message })
      }),
    )

  return fetch$
}
