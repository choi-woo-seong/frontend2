import { useEffect } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"

export default function OAuth2RedirectHandler() {
  const navigate = useNavigate()
  const { provider } = useParams()            // "kakao" or "google"
  const [search] = useSearchParams()
  const token = search.get("token")
  const error = search.get("error")

  useEffect(() => {
    if (error) {
      alert("소셜 로그인 실패: " + error)
      return navigate("/login")
    }
    if (token) {
      localStorage.setItem("accessToken", token)
      navigate("/")  // 필요 시 관리자 체크 로직 추가
    }
  }, [token, error, navigate])

  return null
}
