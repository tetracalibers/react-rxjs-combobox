import { faker } from "@faker-js/faker"
import { ChoiceItem } from "./ComboBox/types/ChoiceItem"
import _ from "lodash"
import { createGlobalStyle } from "styled-components"
import { SongSearch } from "./SongSearch"

const PageStyle = createGlobalStyle`
  body {
    width: 100vw;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;
    background: radial-gradient(
        105.68% 45.69% at 92.95% 50%,
        rgba(105, 244, 253, 0.5) 0%,
        rgba(160, 255, 244, 0.095) 53.91%,
        rgba(254, 216, 255, 0) 100%
      ),
      radial-gradient(
        103.18% 103.18% at 90.11% 102.39%,
        #c9fff2 0%,
        rgba(230, 255, 250, 0) 100%
      ),
      radial-gradient(
        90.45% 90.45% at 87.84% 9.55%,
        #ffd2f5 0%,
        rgba(254, 219, 246, 0) 100%
      ),
      linear-gradient(
        135.66deg,
        rgba(203, 185, 255, 0.8) 14.89%,
        rgba(216, 202, 254, 0) 74.33%
      );
    background-blend-mode: normal, normal, normal, normal, normal, normal;
  }
`

const options: ChoiceItem[] = [...new Array(50)].map(() => {
  return {
    label: faker.animal.cat(),
    value: faker.datatype.uuid(),
  }
})

function App() {
  return (
    <>
      <PageStyle />
      <SongSearch />
    </>
  )
}

export default App
