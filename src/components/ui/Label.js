import React from "react"
import "./Label.css"

/**
 * 레이블 컴포넌트
 *
 * @component
 * @param {Object} props - 컴포넌트 props
 * @param {string} [props.className] - 추가 클래스명
 * @param {React.Ref} ref - 전달된 ref
 * @returns {React.ReactElement} 레이블 컴포넌트
 */
const Label = React.forwardRef(({ className, ...props }, ref) => {
  return <label className={`label ${className || ""}`} ref={ref} {...props} />
})

Label.displayName = "Label"

export { Label }
