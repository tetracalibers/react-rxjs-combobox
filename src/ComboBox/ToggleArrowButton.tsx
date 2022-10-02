import { IconButton } from "./IconButton"
import { VscChevronDown } from "react-icons/vsc"
import styled from "styled-components"
import { ComponentPropsWithRef } from "react"

const ArrowIconButton = styled(IconButton).attrs({
  icon: <VscChevronDown />,
})`
  --icon-size: 1.5rem;
  --icon-color: #b1b2ff;

  appearance: none;
  border: none;
  outline: none;
  background: rgba(255, 255, 255, 0);

  position: absolute;
  right: 2.5%;
  top: 50%;
  transform: translateY(-50%);

  & svg {
    width: var(--icon-size);
    height: var(--icon-size);
    fill: var(--icon-color);
    stroke: var(--icon-color);
    transform: rotate(0deg);
    transition: transform 0.5s ease;
  }

  &[data-open="true"] svg {
    transform: rotate(180deg);
  }
`

interface ToggleArrowButtonProps extends ComponentPropsWithRef<"button"> {
  isOpen: boolean
}

export const ToggleArrowButton = ({
  isOpen,
  ...props
}: ToggleArrowButtonProps) => {
  return (
    <ArrowIconButton
      label={isOpen ? "ppen" : "close"}
      data-open={isOpen}
      {...props}
    />
  )
}