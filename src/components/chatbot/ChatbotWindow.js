"use client";

import { useState, useRef, useEffect } from "react";
import { X, Minimize2, ArrowUp, Loader2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Bot } from "lucide-react";
import "./ChatbotWindow.css";

/**
 * 챗봇 창 컴포넌트
 *
 * @param {Object} props
 * @param {Function} props.onClose - 창 닫기 버튼 클릭 시 실행할 함수
 * @param {Function} props.onMinimize - 창 최소화 버튼 클릭 시 실행할 함수
 */
const ChatbotWindow = ({ onClose, onMinimize }) => {
  const PYTHON_APP_API_URL = process.env.REACT_APP_PYTHON_API_URL;

  // 메시지 목록 상태
  const [messages, setMessages] = useState([
    {
      id: "1",
      content:
        "안녕하세요! 요양시설 정보 서비스 챗봇입니다. 어떤 도움이 필요하신가요?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  // 입력값 상태
  const [inputValue, setInputValue] = useState("");

  // 챗봇 응답 중 상태
  const [isTyping, setIsTyping] = useState(false);

  // 메시지 영역 스크롤 참조
  const messagesEndRef = useRef(null);

  // 메시지 목록이 업데이트될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * 메시지 전송 처리
   */
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // ✅ 백엔드 연동
    const answer = await getBotResponse(inputValue);

    const botMessage = {
      id: (Date.now() + 1).toString(),
      content: answer,
      sender: "bot",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);
  };

  /**
   * 간단한 챗봇 응답 생성 함수 (백엔드 연동 전 임시 사용)
   *
   * @param {string} userInput - 사용자 입력 메시지
   * @returns {string} 챗봇 응답 메시지
   */
  const getBotResponse = async (userInput) => {
    try {
      const response = await fetch(`${PYTHON_APP_API_URL}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userInput }),
      });

      const data = await response.json();
      return data.answer || "응답이 없습니다.";
    } catch (error) {
      console.error("❌ GPT API 호출 실패:", error);
      return "서버와 연결할 수 없습니다. 다시 시도해주세요.";
    }
  };

  /**
   * 엔터 키 처리
   *
   * @param {React.KeyboardEvent} e - 키보드 이벤트
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * 시간 포맷팅 함수
   *
   * @param {Date} date - 날짜 객체
   * @returns {string} 포맷팅된 시간 문자열 (HH:MM)
   */
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

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
          <Button
            variant="ghost"
            size="icon"
            className="chatbot-header-button"
            onClick={onMinimize}
          >
            <Minimize2 className="chatbot-header-icon" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="chatbot-header-button"
            onClick={onClose}
          >
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
              message.sender === "user"
                ? "chatbot-message-user"
                : "chatbot-message-bot"
            }`}
          >
            <div
              className={`chatbot-message ${
                message.sender === "user"
                  ? "chatbot-message-bubble-user"
                  : "chatbot-message-bubble-bot"
              }`}
            >
              <p className="chatbot-message-text">
                {message.content.split("\n").reduce((acc, line, i, arr) => {
                  // 링크 줄
                  if (line.startsWith("🔗")) {
                    const url = line.replace("🔗", "").trim();

                    // 마지막 줄이거나 다음 줄이 번호로 시작하면 줄바꿈 div로 wrap
                    acc.push(
                      <div key={i} style={{ marginBottom: "12px" }}>
                        <span role="img" aria-label="link">
                        </span>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#007bff",
                            textDecoration: "underline",
                          }}
                        >
                          {url}
                        </a>
                      </div>
                    );
                  }
                  // 일반 텍스트
                  else {
                    acc.push(
                      <div
                        key={i}
                        style={{ lineHeight: "1.6", marginBottom: "2px" }}
                      >
                        {line}
                      </div>
                    );
                  }
                  return acc;
                }, [])}
              </p>

              <p
                className={`chatbot-message-time ${
                  message.sender === "user"
                    ? "chatbot-message-time-user"
                    : "chatbot-message-time-bot"
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
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="chatbot-send-button"
          >
            {isTyping ? (
              <Loader2 className="chatbot-send-icon chatbot-loading" />
            ) : (
              <ArrowUp className="chatbot-send-icon" />
            )}
          </Button>
        </div>
        <div className="chatbot-disclaimer">
          * 이 챗봇은 기본적인 정보만 제공합니다. 자세한 상담은 전문 상담사를
          연결해드립니다.
        </div>
      </div>
    </div>
  );
};

export default ChatbotWindow;
