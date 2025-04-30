"use client"
import "./Card.css"

/**
 * Card 컴포넌트
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 카드 내부 콘텐츠
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {string} [props.variant='default'] - 카드 변형 (default, outline, filled)
 * @param {string} [props.size='md'] - 카드 크기 (sm, md, lg)
 * @param {boolean} [props.hoverable=false] - 호버 효과 적용 여부
 * @param {boolean} [props.clickable=false] - 클릭 효과 적용 여부
 * @param {Function} [props.onClick] - 클릭 이벤트 핸들러
 */
const Card = ({
  children,
  className = "",
  variant = "default",
  size = "md",
  hoverable = false,
  clickable = false,
  onClick,
  ...props
}) => {
  const cardClasses = [
    "card",
    `card-${variant}`,
    `card-${size}`,
    hoverable ? "card-hoverable" : "",
    clickable ? "card-clickable" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={cardClasses} onClick={clickable ? onClick : undefined} {...props}>
      {children}
    </div>
  )
}

/**
 * Card.Header 컴포넌트
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 헤더 내부 콘텐츠
 * @param {string} [props.className] - 추가 CSS 클래스
 */
Card.Header = ({ children, className = "", ...props }) => {
  return (
    <div className={`card-header ${className}`} {...props}>
      {children}
    </div>
  )
}

/**
 * Card.Title 컴포넌트
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 제목 내부 콘텐츠
 * @param {string} [props.className] - 추가 CSS 클래스
 */
Card.Title = ({ children, className = "", ...props }) => {
  return (
    <h3 className={`card-title ${className}`} {...props}>
      {children}
    </h3>
  )
}

/**
 * Card.Description 컴포넌트
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 설명 내부 콘텐츠
 * @param {string} [props.className] - 추가 CSS 클래스
 */
Card.Description = ({ children, className = "", ...props }) => {
  return (
    <div className={`card-description ${className}`} {...props}>
      {children}
    </div>
  )
}

/**
 * Card.Content 컴포넌트
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 콘텐츠 내부 콘텐츠
 * @param {string} [props.className] - 추가 CSS 클래스
 */
Card.Content = ({ children, className = "", ...props }) => {
  return (
    <div className={`card-content ${className}`} {...props}>
      {children}
    </div>
  )
}

/**
 * Card.Footer 컴포넌트
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 푸터 내부 콘텐츠
 * @param {string} [props.className] - 추가 CSS 클래스
 */
Card.Footer = ({ children, className = "", ...props }) => {
  return (
    <div className={`card-footer ${className}`} {...props}>
      {children}
    </div>
  )
}

/**
 * Card.Image 컴포넌트
 *
 * @param {Object} props
 * @param {string} props.src - 이미지 소스 URL
 * @param {string} props.alt - 이미지 대체 텍스트
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {string} [props.position='top'] - 이미지 위치 (top, bottom)
 */
Card.Image = ({ src, alt, className = "", position = "top", ...props }) => {
  return (
    <div className={`card-image card-image-${position} ${className}`}>
      <img src={src || "/placeholder.svg"} alt={alt} {...props} />
    </div>
  )
}

export default Card
