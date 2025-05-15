"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import { Check, AlertCircle } from "lucide-react"
import axios from "axios"
import "./login.css"

const API_BASE_URL = process.env.REACT_APP_API_URL

const SignupStep = {
  BasicInfo: 0,
  EmailVerification: 1,
  Password: 2,
  Complete: 3,
}

function SignupForm() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(SignupStep.BasicInfo)
  const [formData, setFormData] = useState({
    userId: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const [validation, setValidation] = useState({
    userId: true,
    email: true,
    phone: true,
    password: true,
    confirmPassword: true,
  })
  const [errors, setErrors] = useState({
    userId: "",
    email: "",
    phone: "",
  })
  

  const [verificationCode, setVerificationCode] = useState("")

  const handleCompleteSignup = async () => {
    const isPasswordValid = formData.password.length >= 8
    const isConfirmValid = formData.password === formData.confirmPassword
  
    setValidation({
      ...validation,
      password: isPasswordValid,
      confirmPassword: isConfirmValid,
    })
  
    if (isPasswordValid && isConfirmValid) {
      try {
        // ✅ 서버로 회원가입 데이터 전송
        await axios.post(`${API_BASE_URL}/auth/signup`, {
          userId: formData.userId,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        })

        console.log(formData)
  
        setCurrentStep(SignupStep.Complete) // 회원가입 성공하면 완료 단계로 이동
      } catch (error) {
        console.error("회원가입 실패:", error)
        alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.")
      }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSendVerification = async () => {
  console.log("[SEND] 이메일 인증 요청 시작");

  try {
    const res = await axios.post(`${API_BASE_URL}/email/send`, {
      email: formData.email,
    });

    console.log("[SEND] 응답:", res.data);
    alert("인증 코드가 전송되었습니다.");
  } catch (err) {
    console.error("[SEND] 인증 코드 전송 실패:", err);
    alert("메일 전송 실패");
  }
};

  const handleVerifyEmail = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/email/verify`, {
      email: formData.email,
      code: verificationCode,
    });

    if (response.status === 200) {
      setCurrentStep(SignupStep.Password);
    } else {
      alert("인증 실패. 다시 시도해주세요.");
    }
  } catch (error) {
    console.error("인증 실패:", error);
    alert("인증 코드가 일치하지 않거나 만료되었습니다.");
  }
};

  const handleNextStep = async () => {
    if (currentStep === SignupStep.BasicInfo) {
      const isUserIdValid = formData.userId.length >= 4;
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      const isPhoneValid = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/.test(formData.phone);
  
      setErrors({
        userId: isUserIdValid ? "" : "아이디를 4자 이상 입력해주세요.",
        email: isEmailValid ? "" : "유효한 이메일 형식을 입력해주세요.",
        phone: isPhoneValid ? "" : "유효한 전화번호를 입력해주세요.",
      });
  
      if (isUserIdValid && isEmailValid && isPhoneValid) {
        try {
          const res = await axios.get(`${API_BASE_URL}/auth/check-userid?userId=${formData.userId}`);
          if (!res.data) {
            setCurrentStep(SignupStep.EmailVerification);
          } else {
            alert("이미 사용중인 아이디입니다.");
          }
        } catch (error) {
          console.error(error);
          alert("서버 오류. 다시 시도해주세요.");
        }
      }
    }
  };
  

  const handlePrevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const renderProgressBar = () => {
    const steps = ["기본 정보", "이메일 인증", "비밀번호 설정", "가입 완료"]

    return (
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${idx <= currentStep ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-400"}`}>
                {idx < currentStep ? <Check className="w-5 h-5" /> : idx + 1}
              </div>
              <span className="text-xs">{step}</span>
            </div>
          ))}
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full">
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>
      </div>
    )
  }

  const renderBasicInfoStep = () => (
    <>
      <div className="space-y-4 mb-6">
        {/* 아이디 */}
        <div className="space-y-2">
          <Label>아이디</Label>
          <Input
            name="userId"
            placeholder="아이디 (4자 이상)"
            value={formData.userId}
            onChange={handleChange}
            className={errors.userId ? "border-red-500" : ""}
          />
          {errors.userId && (
            <p className="text-sm text-red-500 mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" /> {errors.userId}
            </p>
          )}
        </div>

        {/* 아이디 */}
        <div className="space-y-2">
          <Label>이름</Label>
          <Input
            name="name"
            placeholder="이름 입력"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.userId && (
            <p className="text-sm text-red-500 mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" /> {errors.userId}
            </p>
          )}
        </div>
  
        {/* 이메일 */}
        <div className="space-y-2">
          <Label>이메일</Label>
          <Input
            name="email"
            placeholder="이메일 입력"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" /> {errors.email}
            </p>
          )}
        </div>
  
        {/* 전화번호 */}
        <div className="space-y-2">
          <Label>핸드폰 번호</Label>
          <Input
            name="phone"
            placeholder="01012345678"
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" /> {errors.phone}
            </p>
          )}
        </div>
      </div>
  
      {/* 다음 버튼 */}
      <Button
        onClick={handleNextStep}
        className="login-btn w-full bg-blue-500 hover:bg-blue-600"
      >
        다음
      </Button>
    </>
  );
  

  const renderEmailVerificationStep = () => (
    <>
      <div className="space-y-4 mb-6">
        <div className="bg-blue-50 text-blue-800 text-sm rounded p-3">{formData.email}로 인증 코드를 전송합니다.</div>
        <div className="flex items-center gap-2">
          <Input placeholder="인증 코드 6자리" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="flex-1" />
          <Button type="button" onClick={handleSendVerification} className="w-36">인증코드 전송</Button>
        </div>
        <div>
          <span className="text-gray-800">인증 코드가 오지 않았나요?</span>
          <button type="button" onClick={handleSendVerification} className="text-blue-500 ml-1">재전송</button>
        </div>
      </div>
      <div className="flex justify-between gap-2">
      <Button
          onClick={handlePrevStep}
          className="w-1/2 py-3 border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 rounded-xl"
        >
          이전
        </Button>

        <Button
          onClick={handleVerifyEmail} // or handleCompleteSignup
          className="w-1/2 py-3 bg-blue-500 text-white hover:bg-blue-600 rounded-xl"
        >
          다음
        </Button>


      </div>
    </>
  )

  const renderPasswordStep = () => (
    <>
      <div className="space-y-4 mb-6">
        <div className="space-y-2">
          <Label>비밀번호</Label>
          <Input name="password" type="password" placeholder="비밀번호 (8자 이상)" value={formData.password} onChange={handleChange} className={!validation.password ? "border-red-500" : ""} />
          {!validation.password && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />비밀번호는 8자 이상이어야 합니다.
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>비밀번호 확인</Label>
          <Input name="confirmPassword" type="password" placeholder="비밀번호 재입력" value={formData.confirmPassword} onChange={handleChange} className={!validation.confirmPassword ? "border-red-500" : ""} />
          {!validation.confirmPassword && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />비밀번호가 일치하지 않습니다.
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-between gap-2">
      <Button
        onClick={handlePrevStep}
        type="button"
        className="w-1/2 py-3 border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 rounded-xl"
      >
        이전
      </Button>

      <Button
        type="button"
        onClick={handleCompleteSignup}
        className="w-1/2 py-3 bg-blue-500 text-white hover:bg-blue-600 rounded-xl"
      >
        가입 완료
      </Button>

      </div>
    </>
  )

  {/* 4단계 회원가입 완료 화면 */}
  const renderCompleteStep = () => (
<div className="flex flex-col items-center justify-center space-y-6">
  <h2 className="text-2xl font-bold text-gray-800">회원가입이 완료되었습니다!</h2>
  <Link
  to="/login"
  className="w-full py-3 bg-blue-500 text-white text-center text-sm rounded-xl hover:bg-blue-600 transition"
>
  로그인 하러 가기
</Link>

</div>

  )

  const renderStepContent = () => {
    switch (currentStep) {
      case SignupStep.BasicInfo:
        return renderBasicInfoStep()
      case SignupStep.EmailVerification:
        return renderEmailVerificationStep()
      case SignupStep.Password:
        return renderPasswordStep()
      case SignupStep.Complete:
        return renderCompleteStep()
      default:
        return <div>잘못된 접근입니다.</div>
    }
  }

  return (
    <div className="sign-container bg-white p-6 rounded-lg shadow-md">
      {renderProgressBar()}
      {renderStepContent()}
    </div>
  )
}

export default SignupForm