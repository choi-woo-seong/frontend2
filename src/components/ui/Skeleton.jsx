import "./Skeleton.css"

export const Skeleton = ({ className = "", variant = "text", width, height, ...props }) => {
  const variantClasses = {
    text: "skeleton-text",
    circular: "skeleton-circular",
    rectangular: "skeleton-rectangular",
  }

  const style = {
    width: width !== undefined ? (typeof width === "number" ? `${width}px` : width) : undefined,
    height: height !== undefined ? (typeof height === "number" ? `${height}px` : height) : undefined,
  }

  return <div className={`skeleton ${variantClasses[variant] || ""} ${className}`} style={style} {...props} />
}

export default Skeleton
