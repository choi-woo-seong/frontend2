"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "../ui/Button";
import "./ChatbotButton.css";

/**
 * 챗봇 버튼 컴포넌트
 */
function ChatbotButton({ onClick, unreadCount = 0 }) {
  return (
    <div className="chatbot-button-fixed">
      {/* ✅ 여기 Button에만 정확히 onClick 연결 */}
      <Button onClick={onClick} className="chatbot-button-inner">
        <MessageCircle className="chatbot-button-icon" />
        {unreadCount > 0 && (
          <span className="chatbot-unread-badge">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>
    </div>
  );
}

export default ChatbotButton;
