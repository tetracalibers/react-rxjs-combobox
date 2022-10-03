import { VisuallyHidden as _VisuallyHidden } from "@polym/a11y"
import { ComponentPropsWithRef, ForwardedRef, forwardRef, memo } from "react"
import styled from "styled-components"

const _Root = styled.div`
  width: 100%;
`

const _Input = styled.input`
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
  width: 100%;

  /* 表示状態を検知するために透明にして残しておく */
  &::placeholder {
    color: rgba(255, 255, 255, 0);
  }

  &:placeholder-shown + label::before {
    transform: translate3d(0, -2.2rem, 0) scale3d(1, 1, 1);
  }

  &:focus + label::before {
    transform: translate3d(0, -3.12rem, 0) scale3d(0.82, 0.82, 1);
  }

  /* focus時と入力済みの場合 */
  &:focus + label::before,
  &:not(:placeholder-shown) + label::before {
    color: var(--float-color);
  }
`

const _Label = styled.label`
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
    line-height: 1;
    transform: translate3d(0, -3.12rem, 0) scale3d(0.82, 0.82, 1);
  }
`

const Root = memo(_Root)
const VisuallyHidden = memo(_VisuallyHidden)
const Label = memo(_Label)
const Input = memo(_Input)

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
