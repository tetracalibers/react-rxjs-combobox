import { VisuallyHidden } from "@polym/a11y"
import { ComponentPropsWithRef, ForwardedRef, forwardRef } from "react"
import styled from "styled-components"

const Root = styled.div``

const Input = styled.input`
  box-sizing: border-box;
  outline: none;
  font-size: 16px;
  padding: 0.5em 1em;
  border: none;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4px);
  border-radius: 10px;
  box-shadow: rgb(50 50 105 / 15%) 0px 2px 5px 0px,
    rgb(0 0 0 / 5%) 0px 1px 1px 0px;
  margin: 0;
  padding: 1.8rem 1rem 0.6rem;
  font-size: 1rem;

  /* 表示状態を検知するために透明にして残しておく */
  &::placeholder {
    color: rgba(255, 255, 255, 0);
  }
`

const Label = styled.label`
  display: flex;
  position: relative;
  max-height: 0;
  pointer-events: none;
  width: 100%;
  justify-content: center;

  &::before {
    color: var(--color);
    content: attr(data-label);
    display: inline-block;
    filter: blur(0);
    backface-visibility: hidden;
    transform-origin: left top;
    transition: transform 0.2s ease;
    position: relative;
  }

  ${Input}:placeholder-shown + &::before {
    transform: translate3d(0, -2.2rem, 0) scale3d(1, 1, 1);
  }

  &::before,
  ${Input}:focus + &::before {
    transform: translate3d(0, -3.12rem, 0) scale3d(0.82, 0.82, 1);
  }

  /* focus時と入力済みの場合 */
  ${Input}:focus + &::before,
  ${Input}:not(:placeholder-shown) + &::before {
    color: var(--float-color);
  }
`

interface FloatLabelInputProps extends ComponentPropsWithRef<"input"> {
  label: string
  id: string
}

const _FloatLabelInput = (
  { label, id, ...props }: FloatLabelInputProps,
  ref: ForwardedRef<HTMLInputElement>,
) => {
  return (
    <Root>
      <Input {...props} placeholder={label} ref={ref} id={id} />
      <Label data-label={label} htmlFor={id}>
        <VisuallyHidden>{label}</VisuallyHidden>
      </Label>
    </Root>
  )
}

export const FloatLabelInput = forwardRef(_FloatLabelInput)
