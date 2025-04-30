"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ChevronLeft, AlertCircle, Check } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import axios from "axios"
import '../styles/ForgotPassword.css'

function ForgotPasswordPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isCodeSent, setIsCodeSent] = useState(false)

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setError("이메일을 입력해주세요.")
      return
    }
    setIsLoading(true)
    setError("")
    try {
      const response = await axios.post("/api/auth/forgot-password", { email })
      if (response.data.success) {
        setIsCodeSent(true)
        setStep(2)
      } else {
        setError("등록되지 않은 이메일입니다.")
      }
    } catch (err) {
      console.error("비밀번호 찾기 오류:", err)
      setError("서버 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    if (!verificationCode) {
      setError("인증 코드를 입력해주세요.")
      return
    }
    setIsLoading(true)
    setError("")
    try {
      const response = await axios.post("/api/auth/verify-reset-code", {
        email,
        code: verificationCode,
      })
      if (response.data.valid) {
        setStep(3)
      } else {
        setError("인증 코드가 일치하지 않습니다.")
      }
    } catch (err) {
      console.error("인증 코드 확인 오류:", err)
      setError("서버 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!newPassword || newPassword.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }
    setIsLoading(true)
    setError("")
    try {
      const response = await axios.post("/api/auth/reset-password", {
        email,
        code: verificationCode,
        newPassword,
      })
      if (response.data.success) {
        setStep(4)
      } else {
        setError("비밀번호 재설정에 실패했습니다.")
      }
    } catch (err) {
      console.error("비밀번호 재설정 오류:", err)
      setError("서버 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="forgot-container flex flex-col min-h-screen">
      {/* 헤더 */}
      <header className="forgot-header bg-white border-b">
        <div className="flex items-center px-4 py-3">
          <Link to="/" className="mr-4">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-medium">비밀번호 찾기</h1>
        </div>
      </header>

      {/* 메인 */}
      <main className="forgot-main flex-grow flex items-center justify-center p-4">
        <div className="forgot-card w-full max-w-md">
          {error && (
            <div className="forgot-error mb-4 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="forgot-form">
              <h2 className="text-xl font-semibold mb-4">비밀번호 찾기</h2>
              <p className="text-sm text-gray-600 mb-4">
                가입 시 등록한 이메일을 입력하시면 비밀번호 재설정 안내 메일을 보내드립니다.
              </p>

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button type="submit" className="forgot-btn" disabled={isLoading}>
                {isLoading ? "처리 중..." : "인증 코드 받기"}
              </button>

              <div className="forgot-text-center text-sm text-blue-500 mt-4">
                <Link to="/login" className="hover:underline">
                  로그인 페이지로 돌아가기
                </Link>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="forgot-form">
              <h2 className="text-xl font-semibold mb-4">인증 코드 확인</h2>
              <p className="text-sm text-gray-600 mb-4">{email}로 전송된 인증 코드를 입력해주세요.</p>

              <div className="space-y-2">
                <Label htmlFor="verificationCode">인증 코드</Label>
                <Input
                  id="verificationCode"
                  placeholder="인증 코드 6자리"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                />
              </div>

              <button type="submit" className="forgot-btn" disabled={isLoading}>
                {isLoading ? "확인 중..." : "확인"}
              </button>

              <div className="forgot-text-center text-sm text-blue-500 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCodeSent(false)
                    handleEmailSubmit({ preventDefault: () => {} })
                  }}
                  className="hover:underline"
                >
                  인증 코드 재전송
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="forgot-form">
              <h2 className="text-xl font-semibold mb-4">새 비밀번호 설정</h2>
              <p className="text-sm text-gray-600 mb-4">새로운 비밀번호를 입력해주세요.</p>

              <div className="space-y-2">
                <Label htmlFor="newPassword">새 비밀번호</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="8자 이상 비밀번호"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="비밀번호 확인"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="forgot-btn" disabled={isLoading}>
                {isLoading ? "처리 중..." : "비밀번호 변경"}
              </button>
            </form>
          )}

          {step === 4 && (
            <div className="forgot-text-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">비밀번호 변경 완료</h2>
              <p className="text-sm text-gray-600 mb-6">
                비밀번호가 성공적으로 변경되었습니다.<br />새 비밀번호로 로그인해주세요.
              </p>
              <Link to="/login">
                <button className="forgot-btn">로그인 페이지로 이동</button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ForgotPasswordPage
