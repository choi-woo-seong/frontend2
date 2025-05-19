// src/components/OAuth2RedirectHandler.js
import { useEffect } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../hooks/use-auth"

const API_BASE_URL = process.env.REACT_APP_API_URL

export default function OAuth2RedirectHandler() {
  const navigate = useNavigate()
  const { provider } = useParams()            // "kakao" or "google"
  const [search] = useSearchParams()
  const token = search.get("token")
  const error = search.get("error")
  const { login } = useAuth()

  useEffect(() => {
    if (error) {
      alert("소셜 로그인 실패: " + error)
      return navigate("/login")
    }
    if (token) {
      // 1) 토큰을 로컬스토리지와 axios 기본 헤더에 세팅
      localStorage.setItem("accessToken", token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

      // 2) (선택) 백엔드에서 유저 프로필을 가져와 컨텍스트에 저장
      axios
        .get(`${API_BASE_URL}/auth/me`)
        .then(({ data: userObj }) => {
          login({
            token,
            user: userObj,
            role: userObj.role === "ADMIN" ? "ADMIN" : "USER",
          })
          navigate("/")
        })
        .catch(() => {
          // 프로필 API가 없다면, 최소한 유저 아이디라도 넘기기
          login({ token, user: { id: provider }, role: "USER" })
          navigate("/")
        })
    }
  }, [token, error, login, navigate, provider])

  return null
}
