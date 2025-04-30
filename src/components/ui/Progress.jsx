import "./Progress.css"

export const Progress = ({ value = 0, max = 100, className = "", ...props }) => {
  // 값이 0-100 범위 내에 있도록 보장
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={`progress-container ${className}`} {...props}>
      <div
        className="progress-indicator"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

export default Progress
