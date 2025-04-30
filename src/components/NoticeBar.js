"use client";
import "./NoticeBar.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";

function NoticeBar() {
  const [notices, setNotices] = useState([]);
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);

  useEffect(() => {
    setNotices([
      { id: 1, title: "요양보호사 자격증 취득 지원 프로그램 안내", link: "/notices/1" },
      { id: 2, title: "2023년 노인장기요양보험 제도 변경 안내", link: "/notices/2" },
      { id: 3, title: "실버타운 모바일 앱 출시 안내", link: "/notices/3" },
    ]);
  }, []);

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
