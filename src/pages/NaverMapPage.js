import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/NaverMapPage.css";

function NaverMapPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const facilities = location.state?.facilities || [];

  useEffect(() => {
    // 이미 스크립트가 로딩되어 있다면 중복 추가 방지
    const existingScript = document.getElementById("naver-map-script");
    if (existingScript) {
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.id = "naver-map-script";
    script.src = "https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=YOUR_CLIENT_ID"; // ← 실제 Client ID로 교체
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);

    function initMap() {
      if (!window.naver?.maps) {
        console.error("네이버 지도 객체 로딩 실패");
        return;
      }

      const map = new window.naver.maps.Map("map", {
        center: new window.naver.maps.LatLng(37.5665, 126.9780),
        zoom: 10,
      });

      const geocoder = new window.naver.maps.Geocoder();

      // 순차적으로 주소를 처리 (DFS/BFS 스타일)
      const queue = [...facilities];

      const placeNext = () => {
        if (queue.length === 0) return;
        const current = queue.shift();

        geocoder.geocode({ query: current.address }, (status, response) => {
          if (status !== window.naver.maps.Service.Status.OK || !response.v2.addresses.length) {
            console.warn("주소 변환 실패:", current.address);
            placeNext();
            return;
          }

          const item = response.v2.addresses[0];
          const position = new window.naver.maps.LatLng(item.y, item.x);

          new window.naver.maps.Marker({
            map,
            position,
            title: current.name,
          });

          placeNext();
        });
      };

      placeNext();
    }
  }, [facilities]);

  return (
    <div className="map-wrapper">
      <div id="map" className="naver-map" />
      <button className="map-back-button" onClick={() => navigate(-1)}>
        ← 뒤로
      </button>
    </div>
  );
}

export default NaverMapPage;
