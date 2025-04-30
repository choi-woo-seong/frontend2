import React from "react"
import "./Input.css"

/**
 * 입력 필드 컴포넌트
 *
 * @component
 * @param {Object} props - 컴포넌트 props
 * @param {string} [props.className] - 추가 클래스명
 * @param {string} [props.type="text"] - 입력 필드 타입
 * @param {React.Ref} ref - 전달된 ref
 * @returns {React.ReactElement} 입력 필드 컴포넌트
 */
const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  return <input type={type} className={`input ${className || ""}`} ref={ref} {...props} />
})

Input.displayName = "Input"

export { Input }
