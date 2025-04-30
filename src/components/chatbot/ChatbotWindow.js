"use client"

import { useState, useRef, useEffect } from "react"
import { X, Minimize2, ArrowUp, Loader2 } from "lucide-react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Bot } from "lucide-react";
import "./ChatbotWindow.css"

/**
 * 챗봇 창 컴포넌트
 *
 * @param {Object} props
 * @param {Function} props.onClose - 창 닫기 버튼 클릭 시 실행할 함수
 * @param {Function} props.onMinimize - 창 최소화 버튼 클릭 시 실행할 함수
 */
const ChatbotWindow = ({ onClose, onMinimize }) => {
  // 메시지 목록 상태
  const [messages, setMessages] = useState([
    {
      id: "1",
      content: "안녕하세요! 요양시설 정보 서비스 챗봇입니다. 어떤 도움이 필요하신가요?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])

  // 입력값 상태
  const [inputValue, setInputValue] = useState("")

  // 챗봇 응답 중 상태
  const [isTyping, setIsTyping] = useState(false)

  // 메시지 영역 스크롤 참조
  const messagesEndRef = useRef(null)

  // 메시지 목록이 업데이트될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  /**
   * 메시지 전송 처리
   */
  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // 사용자 메시지 추가
    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // TODO: 백엔드 API 연동 - 챗봇 응답 요청
    // 현재는 간단한 응답 시뮬레이션
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue)
      const botMessage = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1000)
  }

  /**
   * 간단한 챗봇 응답 생성 함수 (백엔드 연동 전 임시 사용)
   *
   * @param {string} userInput - 사용자 입력 메시지
   * @returns {string} 챗봇 응답 메시지
   */
  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase()

    if (input.includes("안녕") || input.includes("hello") || input.includes("hi")) {
      return "안녕하세요! 요양시설에 관해 어떤 도움이 필요하신가요?"
    } else if (
      input.includes("요양원") ||
      input.includes("요양병원") ||
      input.includes("실버타운") ||
      input.includes("양로원")
    ) {
      return "요양시설에 관심이 있으시군요! 지역을 알려주시면 주변 시설을 찾아드릴 수 있어요. 또는 상단 메뉴의 '시설 찾기'를 이용해보세요."
    } else if (input.includes("비용") || input.includes("가격") || input.includes("요금")) {
      return "요양시설 비용은 시설 유형, 등급, 지역에 따라 다양합니다. 장기요양보험 적용 시 본인부담금은 일반적으로 20% 정도입니다. 더 자세한 정보가 필요하시면 특정 시설을 알려주세요."
    } else if (input.includes("등급") || input.includes("판정")) {
      return "장기요양등급은 1~5등급과 인지지원등급으로 나뉩니다. '장기요양등급 모의테스트' 메뉴에서 간단한 테스트를 해보실 수 있어요."
    } else if (input.includes("상담") || input.includes("문의")) {
      return "전문 상담사와 상담을 원하시면 1:1 상담 신청을 해주세요. 또는 02-123-4567로 전화주시면 친절히 안내해드리겠습니다."
    } else {
      return "죄송합니다. 질문을 이해하지 못했어요. 요양시설 찾기, 비용 안내, 등급 판정 등에 대해 물어보실 수 있어요."
    }
  }

  /**
   * 엔터 키 처리
   *
   * @param {React.KeyboardEvent} e - 키보드 이벤트
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  /**
   * 시간 포맷팅 함수
   *
   * @param {Date} date - 날짜 객체
   * @returns {string} 포맷팅된 시간 문자열 (HH:MM)
   */
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="chatbot-window">
      {/* 챗봇 헤더 */}
      <div className="chatbot-header">
        <div className="chatbot-header-title">
          <div className="chatbot-logo">
          <Bot className="chatbot-logo-icon" />
          </div>
          <div>
            <h3 className="chatbot-title">요양정보 도우미</h3>
            <p className="chatbot-subtitle">무엇이든 물어보세요</p>
          </div>
        </div>
        <div className="chatbot-header-actions">
          <Button variant="ghost" size="icon" className="chatbot-header-button" onClick={onMinimize}>
            <Minimize2 className="chatbot-header-icon" />
          </Button>
          <Button variant="ghost" size="icon" className="chatbot-header-button" onClick={onClose}>
            <X className="chatbot-header-icon" />
          </Button>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="chatbot-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chatbot-message-container ${
              message.sender === "user" ? "chatbot-message-user" : "chatbot-message-bot"
            }`}
          >
            <div
              className={`chatbot-message ${
                message.sender === "user" ? "chatbot-message-bubble-user" : "chatbot-message-bubble-bot"
              }`}
            >
              <p className="chatbot-message-text">{message.content}</p>
              <p
                className={`chatbot-message-time ${
                  message.sender === "user" ? "chatbot-message-time-user" : "chatbot-message-time-bot"
                }`}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="chatbot-message-container chatbot-message-bot">
            <div className="chatbot-message chatbot-message-bubble-bot">
              <div className="chatbot-typing-indicator">
                <div className="chatbot-typing-dot"></div>
                <div className="chatbot-typing-dot"></div>
                <div className="chatbot-typing-dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="chatbot-input-area">
        <div className="chatbot-input-container">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className="chatbot-input"
          />
          <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping} className="chatbot-send-button">
            {isTyping ? (
              <Loader2 className="chatbot-send-icon chatbot-loading" />
            ) : (
              <ArrowUp className="chatbot-send-icon" />
            )}
          </Button>
        </div>
        <div className="chatbot-disclaimer">
          * 이 챗봇은 기본적인 정보만 제공합니다. 자세한 상담은 전문 상담사를 연결해드립니다.
        </div>
      </div>
    </div>
  )
}

export default ChatbotWindow
