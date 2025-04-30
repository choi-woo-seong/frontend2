import React from "react"
import "./Checkbox.css"

const Checkbox = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div className="checkbox-wrapper">
      <input type="checkbox" className={`checkbox ${className || ""}`} ref={ref} {...props} />
      <div className="checkbox-indicator"></div>
    </div>
  )
})

Checkbox.displayName = "Checkbox"

export default Checkbox
