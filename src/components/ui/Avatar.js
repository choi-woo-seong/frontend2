"use client"

import React from "react"
import "./Avatar.css"

/**
 * 아바타 컴포넌트
 *
 * @param {Object} props
 * @param {string} [props.src] - 이미지 URL
 * @param {string} [props.alt] - 이미지 대체 텍스트
 * @param {string} [props.initials] - 이니셜 (이미지가 없을 때 표시)
 * @param {string} [props.size="md"] - 크기 (xs, sm, md, lg, xl)
 * @param {string} [props.shape="circle"] - 모양 (circle, square)
 * @param {string} [props.status] - 상태 (online, offline, away, busy)
 * @param {string} [props.className] - 추가 클래스명
 * @returns {JSX.Element}
 */
const Avatar = ({ src, alt = "", initials, size = "md", shape = "circle", status, className = "", ...props }) => {
  // 이미지 로드 실패 시 이니셜 표시
  const [imageError, setImageError] = React.useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  // 이니셜 생성 (이름이 주어진 경우)
  const getInitials = () => {
    if (initials) return initials
    if (alt) {
      return alt
        .split(" ")
        .map((word) => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    }
    return ""
  }

  // 이니셜 배경색 랜덤 생성 (이름 기반)
  const getRandomColor = () => {
    const colors = [
      "#F87171", // 빨강
      "#FB923C", // 주황
      "#FBBF24", // 노랑
      "#34D399", // 초록
      "#60A5FA", // 파랑
      "#A78BFA", // 보라
      "#F472B6", // 분홍
    ]

    if (!initials && !alt) return colors[0]

    const str = initials || alt
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div className={`avatar avatar-${size} avatar-${shape} ${className}`} {...props}>
      {src && !imageError ? (
        <img src={src || "/placeholder.svg"} alt={alt} onError={handleImageError} className="avatar-image" />
      ) : (
        <div className="avatar-initials" style={{ backgroundColor: getRandomColor() }}>
          {getInitials()}
        </div>
      )}
      {status && <span className={`avatar-status avatar-status-${status}`} />}
    </div>
  )
}

/**
 * 아바타 그룹 컴포넌트
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 아바타 컴포넌트들
 * @param {number} [props.max] - 최대 표시 개수
 * @param {string} [props.className] - 추가 클래스명
 * @returns {JSX.Element}
 */
Avatar.Group = ({ children, max, className = "" }) => {
  const avatars = React.Children.toArray(children)
  const visibleAvatars = max ? avatars.slice(0, max) : avatars
  const remainingCount = max && avatars.length > max ? avatars.length - max : 0

  return (
    <div className={`avatar-group ${className}`}>
      {visibleAvatars}
      {remainingCount > 0 && (
        <div className="avatar avatar-md avatar-circle avatar-more">
          <div className="avatar-initials">+{remainingCount}</div>
        </div>
      )}
    </div>
  )
}

export default Avatar
