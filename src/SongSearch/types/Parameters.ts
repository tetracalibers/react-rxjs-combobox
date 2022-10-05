export type Parameters = {
  mode?: string
  country?: string
  lang?: string
  entity: string
  attribute: string
  term: string
  sort?: string
  limit?: number
  options?: {
    [t in string]: string
  }
}
