"use client";
import "./NoticeBar.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_URL;

function NoticeBar() {
  const [notices, setNotices] = useState([]);
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);

  // ✅ 공지사항 API 호출
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/notices?page=0&size=5&sort=createdAt,desc`);
        if (!response.ok) throw new Error("공지사항 불러오기 실패");

        const data = await response.json();
        // 공지사항 링크 추가
        const mapped = data.content.map((notice) => ({
          id: notice.id,
          title: notice.title,
          link: `/notices/${notice.id}`,
        }));

        setNotices(mapped);
      } catch (error) {
        console.error("공지사항 불러오기 오류:", error);
      }
    };

    fetchNotices();
  }, []);

  // ✅ 5초마다 다음 공지로
  useEffect(() => {
    if (notices.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentNoticeIndex((i) => (i + 1) % notices.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [notices]);

  if (!notices.length) return null;

  const currentNotice = notices[currentNoticeIndex];

  return (
    <div className="notice-bar">
      <div className="notice-content">
        <div className="notice-message">
          <Info className="notice-icon" />
          <span className="notice-tag">[공지]</span>{" "}
          <Link to={currentNotice.link} className="notice-link hover:underline">
            {currentNotice.title}
          </Link>
        </div>
        <Link to="/notices" className="notice-more">
          더보기 &gt;
        </Link>
      </div>
    </div>
  );
}

export default NoticeBar;
