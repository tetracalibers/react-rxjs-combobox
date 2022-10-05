import { Parameters } from "../types/Parameters"

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

export const getArtistSearchParameters = (term: string) => ({
  entity: "musicArtist",
  attribute: "artistTerm",
  term,
})
