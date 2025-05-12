// src/pages/PaymentResultPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const pg_token = searchParams.get("pg_token");
    const orderId  = searchParams.get("orderId");
    const tid      = localStorage.getItem("kakaoTid");    // ← ready 단계에서 저장해야 함
    const token    = localStorage.getItem("accessToken");

    // 내부에서 async 함수로 처리
    async function confirmPayment() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/payment/kakao/approve`
            + `?orderId=${orderId}`
            + `&pg_token=${pg_token}`
            + `&tid=${tid}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await res.json();  // 필요하다면 approveInfo 확인 가능
        setStatus("success");
        setTimeout(() => navigate("/"), 3000);
      } catch (err) {
        console.error("결제 승인 중 에러:", err);
        setStatus("error");
      }
    }

    // tid, pg_token, orderId 모두 있으면 호출
    if (tid && pg_token && orderId) {
      confirmPayment();
    } else {
      setStatus("error");
    }
  }, [searchParams, navigate]);

  if (status === "processing") return <p>결제 처리 중…</p>;
  if (status === "error")
    return (
      <div>
        <h2>결제에 실패했습니다.</h2>
        <button onClick={() => navigate("/")}>홈으로</button>
      </div>
    );

  return (
    <div>
      <h2>🎉 결제가 완료되었습니다!</h2>
      <p>잠시 후 홈으로 이동합니다…</p>
    </div>
  );
}
