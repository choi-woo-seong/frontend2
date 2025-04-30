import { forwardRef } from "react"
import { cn } from "../../utils/utils"
import "./Textarea.css"

/**
 * Textarea 컴포넌트
 *
 * @component
 * @param {Object} props - 컴포넌트 props
 * @param {string} [props.className] - 추가 클래스명
 * @param {React.Ref} ref - 전달된 ref
 * @returns {React.ReactElement} Textarea 컴포넌트
 */
const Textarea = forwardRef(({ className, ...props }, ref) => {
  return <textarea className={cn("textarea", className)} ref={ref} {...props} />
})

Textarea.displayName = "Textarea"

export { Textarea }
