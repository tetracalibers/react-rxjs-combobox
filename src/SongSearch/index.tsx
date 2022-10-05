import { memo } from "react"
import styled from "styled-components"
import { ArtistInput } from "./ArtistInput"

const _Root = styled.div`
  position: relative;
  display: block;
  width: 250px;
  height: 50vh;
  margin: 0 auto;
  font-size: 16px;
  color: #60666d;
`

const Root = memo(_Root)

export const SongSearch = () => {
  return (
    <Root>
      <ArtistInput />
    </Root>
  )
}
