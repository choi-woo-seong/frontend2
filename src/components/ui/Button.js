import React from "react"
import "./Button.css"

/**
 * 버튼 컴포넌트
 *
 * @component
 * @param {Object} props - 컴포넌트 props
 * @param {string} [props.className] - 추가 클래스명
 * @param {string} [props.variant="default"] - 버튼 스타일 변형
 * @param {string} [props.size="default"] - 버튼 크기
 * @param {React.ReactNode} props.children - 버튼 내용
 * @param {React.Ref} ref - 전달된 ref
 * @returns {React.ReactElement} 버튼 컴포넌트
 */
const Button = React.forwardRef(({ className, variant = "default", size = "default", children, ...props }, ref) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":       // ✅ primary 추가!!
        return "btn-primary"
      case "outline":
        return "btn-outline"
      case "secondary":
        return "btn-secondary"
      case "ghost":
        return "btn-ghost"
      case "link":
        return "btn-link"
      case "destructive":
        return "btn-destructive"
      default:
        return "btn-default"
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "btn-sm"
      case "lg":
        return "btn-lg"
      case "icon":
        return "btn-icon"
      default:
        return "btn-default-size"
    }
  }

  const buttonClasses = `btn ${getVariantClasses()} ${getSizeClasses()} ${className || ""}`

  return (
    <button className={buttonClasses} ref={ref} {...props}>
      {children}
    </button>
  )
})

Button.displayName = "Button"

export { Button }
