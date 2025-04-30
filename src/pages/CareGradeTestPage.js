"use client"

// 기존 파일을 Next.js 스타일로 완전히 대체합니다
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Check, ChevronLeft, AlertCircle } from "lucide-react" // lucide-react 아이콘 사용
import "../styles/CareGradeTestPage.css"

/**
 * 요양 등급 자가 테스트 페이지
 *
 * 사용자가 간단한 질문에 답변하여 대략적인 요양 등급을 확인할 수 있는 페이지입니다.
 * 실제 요양 등급 판정은 전문가의 방문 평가가 필요함을 안내합니다.
 */
const CareGradeTestPage = () => {
  const navigate = useNavigate()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState(Array(questions.length).fill(-1))
  const [showResult, setShowResult] = useState(false)
  const [totalScore, setTotalScore] = useState(0)

  // 현재 진행 상태 계산
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  // 답변 선택 핸들러
  const handleSelectOption = (optionValue) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = optionValue
    setAnswers(newAnswers)
  }

  // 다음 질문으로 이동
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // 모든 질문에 답변했을 때 결과 계산
      calculateResult()
    }
  }

  // 이전 질문으로 이동
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  // 결과 계산
  const calculateResult = () => {
    // 총점 계산
    const score = answers.reduce((sum, answer) => sum + (answer >= 0 ? answer : 0), 0)
    setTotalScore(score)
    setShowResult(true)
  }

  // 등급 판정
  const determineGrade = (score) => {
    for (const standard of gradeStandards) {
      if (score >= standard.minScore) {
        return standard
      }
    }
    return {
      grade: "등급 외",
      minScore: 0,
      description: "장기요양인정 점수가 45점 미만으로 등급 판정 기준에 해당하지 않습니다.",
    }
  }

  // 테스트 다시 시작
  const handleRestartTest = () => {
    setCurrentQuestionIndex(0)
    setAnswers(Array(questions.length).fill(-1))
    setShowResult(false)
    setTotalScore(0)
  }

  // 현재 질문
  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="care-grade-test-container">
      {/* 헤더 */}
      <header className="care-grade-test-header">
        <button onClick={() => navigate("/")} className="back-button">
          <ChevronLeft className="back-icon" />
        </button>
        <h1 className="header-title">장기요양등급 모의테스트</h1>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="care-grade-test-content">
        {!showResult ? (
          <div className="question-card">
            {/* 진행 상태 표시 */}
            <div className="progress-container">
              <div className="progress-info">
                <span className="progress-label">진행 상태</span>
                <span className="progress-count">
                  {currentQuestionIndex + 1} / {questions.length}
                </span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            {/* 질문 카테고리 */}
            <div className="question-category">{currentQuestion.category}</div>

            {/* 질문 제목 */}
            <h2 className="question-title">{currentQuestion.title}</h2>

            {/* 질문 설명 */}
            <p className="question-description">{currentQuestion.description}</p>

            {/* 답변 옵션 */}
            <div className="options-container">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${answers[currentQuestionIndex] === option.value ? "selected" : ""}`}
                  onClick={() => handleSelectOption(option.value)}
                >
                  <div className={`option-check ${answers[currentQuestionIndex] === option.value ? "checked" : ""}`}>
                    {answers[currentQuestionIndex] === option.value && <Check className="check-icon" />}
                  </div>
                  <div className="option-text">
                    <div className="option-label">{option.label}</div>
                    <div className="option-description">{option.description}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* 네비게이션 버튼 */}
            <div className="navigation-buttons">
              <button
                className={`prev-button ${currentQuestionIndex === 0 ? "disabled" : ""}`}
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                이전
              </button>
              <button
                className={`next-button ${answers[currentQuestionIndex] === -1 ? "disabled" : ""}`}
                onClick={handleNextQuestion}
                disabled={answers[currentQuestionIndex] === -1}
              >
                {currentQuestionIndex === questions.length - 1 ? "결과 보기" : "다음"}
              </button>
            </div>
          </div>
        ) : (
          <div className="result-card">
            <h2 className="result-title">테스트 결과</h2>

            {/* 총점 */}
            <div className="score-container">
              <div className="score-label">장기요양인정 점수</div>
              <div className="score-value">{totalScore}점</div>
            </div>

            {/* 등급 결과 */}
            <div className="grade-container">
              <div className="grade-label">예상 등급</div>
              <div className="grade-value">{determineGrade(totalScore).grade}</div>
              <p className="grade-description">{determineGrade(totalScore).description}</p>
            </div>

            {/* 주의사항 */}
            <div className="notice-container">
              <AlertCircle className="notice-icon" />
              <div className="notice-content">
                <p className="notice-title">주의사항</p>
                <p className="notice-text">
                  이 테스트는 간단한 모의테스트로, 실제 장기요양등급 판정과는 차이가 있을 수 있습니다. 정확한 등급
                  판정을 위해서는 국민건강보험공단에 장기요양인정 신청을 하시기 바랍니다.
                </p>
              </div>
            </div>

            {/* 버튼 */}
            <div className="result-buttons">
              <button className="restart-button" onClick={handleRestartTest}>
                테스트 다시 하기
              </button>
              <button className="home-button" onClick={() => navigate("/")}>
                홈으로 돌아가기
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// 장기요양등급 판정 기준 문항
const questions = [
  {
    category: "신체기능",
    title: "옷 입기",
    description: "옷 입기, 양말·신발 신기, 단추 채우기, 지퍼 올리기 등",
    options: [
      { value: 0, label: "완전자립", description: "도움 없이 혼자서 가능" },
      { value: 1, label: "부분도움", description: "일부 도움이 필요함" },
      { value: 2, label: "완전도움", description: "전적으로 다른 사람의 도움이 필요함" },
    ],
  },
  {
    category: "신체기능",
    title: "세수하기",
    description: "세수, 양치질, 머리감기, 면도, 화장하기 등",
    options: [
      { value: 0, label: "완전자립", description: "도움 없이 혼자서 가능" },
      { value: 1, label: "부분도움", description: "일부 도움이 필요함" },
      { value: 2, label: "완전도움", description: "전적으로 다른 사람의 도움이 필요함" },
    ],
  },
  {
    category: "신체기능",
    title: "목욕하기",
    description: "목욕이나 샤워하기, 몸 씻기 등",
    options: [
      { value: 0, label: "완전자립", description: "도움 없이 혼자서 가능" },
      { value: 1, label: "부분도움", description: "일부 도움이 필요함" },
      { value: 3, label: "완전도움", description: "전적으로 다른 사람의 도움이 필요함" },
    ],
  },
  {
    category: "신체기능",
    title: "식사하기",
    description: "음식 섭취, 식사도구 사용, 음식 자르기 등",
    options: [
      { value: 0, label: "완전자립", description: "도움 없이 혼자서 가능" },
      { value: 2, label: "부분도움", description: "일부 도움이 필요함" },
      { value: 4, label: "완전도움", description: "전적으로 다른 사람의 도움이 필요함" },
    ],
  },
  {
    category: "신체기능",
    title: "체위변경하기",
    description: "누웠다가 앉기, 앉았다가 일어서기 등",
    options: [
      { value: 0, label: "완전자립", description: "도움 없이 혼자서 가능" },
      { value: 2, label: "부분도움", description: "일부 도움이 필요함" },
      { value: 4, label: "완전도움", description: "전적으로 다른 사람의 도움이 필요함" },
    ],
  },
  {
    category: "신체기능",
    title: "이동하기",
    description: "방 안에서 걷기, 이동하기 등",
    options: [
      { value: 0, label: "완전자립", description: "도움 없이 혼자서 가능" },
      { value: 2, label: "부분도움", description: "일부 도움이 필요함" },
      { value: 4, label: "완전도움", description: "전적으로 다른 사람의 도움이 필요함" },
    ],
  },
  {
    category: "신체기능",
    title: "화장실 이용하기",
    description: "화장실 가기, 대소변 후 닦고 옷 입기, 기저귀 교환하기 등",
    options: [
      { value: 0, label: "완전자립", description: "도움 없이 혼자서 가능" },
      { value: 2, label: "부분도움", description: "일부 도움이 필요함" },
      { value: 4, label: "완전도움", description: "전적으로 다른 사람의 도움이 필요함" },
    ],
  },
  {
    category: "인지기능",
    title: "방금 전에 들었던 이야기나 일을 잊는다",
    description: "단기 기억력 저하",
    options: [
      { value: 0, label: "그렇지 않다", description: "문제 없음" },
      { value: 1, label: "가끔 그렇다", description: "약간의 문제가 있음" },
      { value: 2, label: "자주 그렇다", description: "상당한 문제가 있음" },
    ],
  },
  {
    category: "인지기능",
    title: "오늘이 며칠인지, 무슨 요일인지 모른다",
    description: "시간 지남력 저하",
    options: [
      { value: 0, label: "그렇지 않다", description: "문제 없음" },
      { value: 1, label: "가끔 그렇다", description: "약간의 문제가 있음" },
      { value: 2, label: "자주 그렇다", description: "상당한 문제가 있음" },
    ],
  },
  {
    category: "인지기능",
    title: "자신이 있는 장소를 알지 못한다",
    description: "장소 지남력 저하",
    options: [
      { value: 0, label: "그렇지 않다", description: "문제 없음" },
      { value: 2, label: "가끔 그렇다", description: "약간의 문제가 있음" },
      { value: 4, label: "자주 그렇다", description: "상당한 문제가 있음" },
    ],
  },
  {
    category: "인지기능",
    title: "자신의 이름을 기억하지 못한다",
    description: "사람 지남력 저하",
    options: [
      { value: 0, label: "그렇지 않다", description: "문제 없음" },
      { value: 2, label: "가끔 그렇다", description: "약간의 문제가 있음" },
      { value: 4, label: "자주 그렇다", description: "상당한 문제가 있음" },
    ],
  },
  {
    category: "문제행동",
    title: "같은 질문을 반복하거나 같은 말을 반복한다",
    description: "반복적 행동",
    options: [
      { value: 0, label: "그렇지 않다", description: "문제 없음" },
      { value: 1, label: "가끔 그렇다", description: "약간의 문제가 있음" },
      { value: 2, label: "자주 그렇다", description: "상당한 문제가 있음" },
    ],
  },
  {
    category: "문제행동",
    title: "길을 잃거나 헤맨다",
    description: "배회",
    options: [
      { value: 0, label: "그렇지 않다", description: "문제 없음" },
      { value: 2, label: "가끔 그렇다", description: "약간의 문제가 있음" },
      { value: 4, label: "자주 그렇다", description: "상당한 문제가 있음" },
    ],
  },
  {
    category: "문제행동",
    title: "폭언이나 위협적인 행동을 한다",
    description: "공격적 행동",
    options: [
      { value: 0, label: "그렇지 않다", description: "문제 없음" },
      { value: 2, label: "가끔 그렇다", description: "약간의 문제가 있음" },
      { value: 4, label: "자주 그렇다", description: "상당한 문제가 있음" },
    ],
  },
  {
    category: "간호처치",
    title: "하루에 한 번 이상 체위변경이 필요하다",
    description: "체위변경",
    options: [
      { value: 0, label: "필요 없음", description: "해당 사항 없음" },
      { value: 1, label: "가끔 필요함", description: "간헐적으로 필요함" },
      { value: 2, label: "항상 필요함", description: "지속적으로 필요함" },
    ],
  },
]

// 등급 판정 기준
const gradeStandards = [
  {
    grade: "1등급",
    minScore: 95,
    description: "심신의 기능상태 장애로 일상생활에서 전적으로 다른 사람의 도움이 필요한 자",
  },
  {
    grade: "2등급",
    minScore: 75,
    description: "심신의 기능상태 장애로 일상생활에서 상당 부분 다른 사람의 도움이 필요한 자",
  },
  {
    grade: "3등급",
    minScore: 60,
    description: "심신의 기능상태 장애로 일상생활에서 부분적으로 다른 사람의 도움이 필요한 자",
  },
  {
    grade: "4등급",
    minScore: 51,
    description: "심신의 기능상태 장애로 일상생활에서 일정 부분 다른 사람의 도움이 필요한 자",
  },
  { grade: "5등급", minScore: 45, description: "치매환자로서 일상생활에서 다른 사람의 도움이 필요한 자" },
  { grade: "인지지원등급", minScore: 45, description: "치매환자로서 장기요양인정 점수가 45점 미만인 자" },
]

export default CareGradeTestPage
