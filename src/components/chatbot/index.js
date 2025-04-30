"use client";

import { useState, useEffect } from "react";
import ChatbotButton from "./ChatbotButton";
import ChatbotWindow from "./ChatbotWindow";

/**
 * 챗봇 메인 컴포넌트
 */
function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setUnreadCount(1), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleOpenChat = () => {
    console.log("handleOpenChat 실행");
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimizeChat = () => {
    setIsMinimized(true);
  };

  return (
    <>
      {/* 챗봇 버튼은 창이 안열려있거나 최소화됐을 때만 */}
      {(!isOpen || isMinimized) && (
        <ChatbotButton onClick={handleOpenChat} unreadCount={unreadCount} />
      )}
      {/* 챗봇 창은 열려있고 최소화 아니면 보여줌 */}
      {isOpen && !isMinimized && (
        <ChatbotWindow onClose={handleCloseChat} onMinimize={handleMinimizeChat} />
      )}
    </>
  );
}

export default Chatbot;
