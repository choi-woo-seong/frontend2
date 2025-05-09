import { useEffect, useRef } from "react";

const KakaoAddressSearch = ({ onComplete }) => {
  const hasOpened = useRef(false); // 모달 중복 방지용

  useEffect(() => {
    if (!hasOpened.current) {
      hasOpened.current = true; // 한 번만 실행되게 막음

      new window.daum.Postcode({
        oncomplete: function (data) {
          onComplete(data.address);
        },
        width: "100%",
        height: "100%",
      }).open({
        popupName: "postcodePopup",
      });
    }
  }, [onComplete]);

  return null;
};

export default KakaoAddressSearch;
