"use client"

import { createContext, forwardRef, useContext, useId } from "react"
import { cn } from "../../utils/utils"
import "./RadioGroup.css"

const RadioGroupContext = createContext(null)

/**
 * RadioGroup 컴포넌트
 *
 * @component
 * @param {Object} props - 컴포넌트 props
 * @param {string} [props.className] - 추가 클래스명
 * @param {string} [props.value] - 선택된 값
 * @param {Function} [props.onValueChange] - 값 변경 핸들러
 * @param {React.ReactNode} props.children - RadioGroup 아이템들
 * @returns {React.ReactElement} RadioGroup 컴포넌트
 */
const RadioGroup = forwardRef(({ className, value, onValueChange, ...props }, ref) => {
  const name = useId()

  return (
    <RadioGroupContext.Provider value={{ name, value, onValueChange }}>
      <div className={cn("radio-group", className)} ref={ref} role="radiogroup" {...props} />
    </RadioGroupContext.Provider>
  )
})

RadioGroup.displayName = "RadioGroup"

/**
 * RadioGroupItem 컴포넌트
 *
 * @component
 * @param {Object} props - 컴포넌트 props
 * @param {string} [props.className] - 추가 클래스명
 * @param {string} props.value - 라디오 아이템 값
 * @param {React.ReactNode} [props.children] - 라디오 아이템 내용
 * @param {React.Ref} ref - 전달된 ref
 * @returns {React.ReactElement} RadioGroupItem 컴포넌트
 */
const RadioGroupItem = forwardRef(({ className, value, children, ...props }, ref) => {
  const context = useContext(RadioGroupContext)

  if (!context) {
    throw new Error("RadioGroupItem must be used within a RadioGroup")
  }

  const { name, value: groupValue, onValueChange } = context
  const checked = value === groupValue

  return (
    <label className="radio-item">
      <input
        type="radio"
        className={cn("radio-input", className)}
        ref={ref}
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onValueChange && onValueChange(e.target.value)}
        {...props}
      />
      <div className="radio-indicator"></div>
      {children && <span className="radio-label">{children}</span>}
    </label>
  )
})

RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
