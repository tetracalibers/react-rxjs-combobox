import _ from "lodash"
import {
  ComponentPropsWithRef,
  ForwardedRef,
  forwardRef,
  KeyboardEvent,
  memo,
  useCallback,
  useRef,
} from "react"
import styled from "styled-components"
import { useVirtualScroll } from "./hooks/useVirtualScroll"
import { ChoiceItem } from "./types/ChoiceItem"

const Virtual__VisibleArea = styled.div`
  --bg-color: #f7f9ff;
  --shadow-color: #b1b2ff;
  --float-color: #8c1bab;
  --gap: 1rem;

  /* メニューをスクロール可能にする */
  max-height: 12em;
  overflow-y: auto;
  /* iOSで慣性スクロールができるようにする */
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background-color: #cdf0ea;
    border-radius: 6px;
    box-shadow: rgb(0 0 0 / 6%) 0px 2px 4px 0px inset;
    box-shadow: rgb(171 216 255) -3px -3px 6px 0px inset,
      rgb(255 255 255 / 50%) 3px 3px 6px 1px inset;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ecc5fb;
    border-radius: 6px;
    border: 1px solid transparent;
    background-clip: content-box;
  }

  /* scroll hint */
  background: linear-gradient(var(--bg-color) 33%, rgba(255, 255, 255, 0)),
    linear-gradient(rgba(255, 255, 255, 0), var(--bg-color) 66%) 0 100%,
    radial-gradient(
      farthest-side at 50% 0,
      var(--shadow-color),
      rgba(255, 255, 255, 0)
    ),
    radial-gradient(
        farthest-side at 50% 100%,
        var(--shadow-color),
        rgba(255, 255, 255, 0)
      )
      0 100%;
  background-color: var(--bg-color);
  background-repeat: no-repeat;
  background-attachment: local, local, scroll, scroll;
  background-size: 100% 33px, 100% 33px, 100% 11px, 100% 11px;

  /* design */
  position: absolute;
  width: 100%;
  top: 110%;
  list-style: none;
  box-shadow: rgba(0, 0, 0, 0.1) -4px 9px 25px -6px;
  border-radius: 10px;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`

const Virtual__HasListHeight = styled.div`
  height: fit-content;
`

const _Ul = styled.ul`
  padding: 0;
  margin: 0;
`

const _Li = styled.li`
  &[role="option"] {
    display: block;
    padding: var(--gap);
    border: none;
  }

  &[role="option"]:hover,
  &[role="option"]:focus {
    background-image: linear-gradient(to right, #fdeb71 10%, #f8d800 100%);
    box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
  }
`

const Ul = memo(_Ul)
const Li = memo(_Li)

interface SelectListProps extends ComponentPropsWithRef<"ul"> {
  items: ChoiceItem<string>[]
  label: string
  id: string
  hidden: boolean
  onSelectItem?: (item: ChoiceItem<string>) => void
}

const vAreaHeight = 192
const vItemHeight = 56

const _SelectList = (
  { items, label, id, hidden, onSelectItem, ...props }: SelectListProps,
  ref: ForwardedRef<HTMLUListElement>,
) => {
  const vRootRef = useRef<HTMLDivElement>(null)

  const { renderItems, startIdx } = useVirtualScroll({
    rootRef: vRootRef,
    items,
    vAreaHeight,
    vItemHeight,
  })

  const selectByEnter = useCallback(
    (e: KeyboardEvent<HTMLLIElement>, item: ChoiceItem<string>) => {
      if (e.key === "Enter") {
        onSelectItem && onSelectItem(item)
      }
    },
    [],
  )

  return (
    <Virtual__VisibleArea ref={vRootRef}>
      <Virtual__HasListHeight>
        <Ul
          {...props}
          role="listbox"
          id={id}
          ref={ref}
          style={{ position: "relative", top: startIdx * vItemHeight }}
        >
          {!hidden &&
            renderItems.map(item => (
              <Li
                key={`${id}__item_${item.value}`}
                role="option"
                aria-selected="false"
                tabIndex={-1}
                onClick={() => onSelectItem && onSelectItem(item)}
                onKeyDown={(e: KeyboardEvent<HTMLLIElement>) =>
                  selectByEnter(e, item)
                }
              >
                {item.label}
              </Li>
            ))}
        </Ul>
      </Virtual__HasListHeight>
    </Virtual__VisibleArea>
  )
}

export const SelectList = memo(forwardRef(_SelectList))
