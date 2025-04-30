import { forwardRef } from "react"
import { cn } from "../../utils/utils"
import "./Select.css"

/**
 * Select 컴포넌트
 *
 * @component
 * @param {Object} props - 컴포넌트 props
 * @param {string} [props.className] - 추가 클래스명
 * @param {React.ReactNode} props.children - Select 옵션들
 * @param {React.Ref} ref - 전달된 ref
 * @returns {React.ReactElement} Select 컴포넌트
 */
const Select = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select className={cn("select", className)} ref={ref} {...props}>
      {children}
    </select>
  )
})

Select.displayName = "Select"

export { Select }
