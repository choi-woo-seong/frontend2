import React from "react"
import "./Badge.css"

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "secondary":
        return "badge-secondary"
      case "outline":
        return "badge-outline"
      case "destructive":
        return "badge-destructive"
      default:
        return "badge-default"
    }
  }

  return <span className={`badge ${getVariantClasses()} ${className || ""}`} ref={ref} {...props} />
})

Badge.displayName = "Badge"

export default Badge
