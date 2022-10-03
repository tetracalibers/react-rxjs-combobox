import { VisuallyHidden } from "@polym/a11y"
import {
  ForwardedRef,
  cloneElement,
  forwardRef,
  ComponentPropsWithRef,
  ReactElement,
  memo,
} from "react"

interface IconButtonProps extends ComponentPropsWithRef<"button"> {
  icon: ReactElement
  label: string
}

const _IconButton = (
  { icon, label, type = "button", ...props }: IconButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) => {
  return (
    <button {...props} ref={ref} type={type}>
      {cloneElement(icon, { "aria-hidden": true })}
      <VisuallyHidden>{label}</VisuallyHidden>
    </button>
  )
}

export const IconButton = memo(forwardRef(_IconButton))
