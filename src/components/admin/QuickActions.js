"use client"
import { useNavigate } from "react-router-dom"
import { Button } from "../ui/Button"
import "./QuickActions.css"

/**
 * 관리자 대시보드의 빠른 작업 컴포넌트
 * 자주 사용하는 관리 기능에 빠르게 접근할 수 있는 버튼 그룹을 제공합니다.
 */
const QuickActions = () => {
  const navigate = useNavigate()

  // 빠른 작업 핸들러
  const handleQuickAction = (action) => {
    switch (action) {
      case "facility-list":
        console.log("시설 목록 페이지로 이동합니다.")
        navigate("/admin/facilities")
        break
      case "product-list":
        console.log("상품 목록 페이지로 이동합니다.")
        navigate("/admin/products")
        break
      case "product-registration":
        console.log("상품 등록 페이지로 이동합니다.")
        navigate("/admin/products/new")
        break
      case "notice-write":
        console.log("공지사항 작성 페이지로 이동합니다.")
        navigate("/admin/notices/new")
        break
      case "inquiry-answer":
        console.log("문의 답변 페이지로 이동합니다.")
        navigate("/admin/questions")
        break
      default:
        break
    }
  }

  return (
    <div className="admin-quick-actions">
      <h3 className="admin-section-title">빠른 작업</h3>
      <div className="admin-quick-actions-grid">
        <Button className="admin-quick-action-button" onClick={() => handleQuickAction("facility-list")}>
          시설 목록
        </Button>
        <Button className="admin-quick-action-button" onClick={() => handleQuickAction("product-list")}>
          상품 목록
        </Button>
        <Button className="admin-quick-action-button" onClick={() => handleQuickAction("notice-write")}>
          공지사항 작성
        </Button>
        <Button className="admin-quick-action-button" onClick={() => handleQuickAction("inquiry-answer")}>
          문의 답변
        </Button>
      </div>
    </div>
  )
}

export default QuickActions
