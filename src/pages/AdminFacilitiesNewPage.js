"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, X } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Select } from "../components/ui/Select";
import "../styles/AdminFacilitiesNewPage.css";
import KakaoAddressSearch from "../components/admin/KakaoAddressSearch";

const AdminFacilitiesNewPage = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL
  const navigate = useNavigate();

  const [facilityType, setFacilityType] = useState("");

  // 다음 api 주소찾기
  const [showAddressSearch, setShowAddressSearch] = useState(false);

  // 모달 중복 실행 방지
  const openAddressSearch = () => {
    if (!showAddressSearch) {
      setShowAddressSearch(true);
    }
  };

  const [formData, setFormData] = useState({
    type: "",
    name: "",
    establishedYear: "",
    address: "",
    phone: "",
    homepage: "",
    grade: "",
    facilitySize: "",
    description: "",
    weekdayHours: "",
    weekendHours: "",
    holidayHours: "",
    visitingHours: "",
    images: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "description") {
      setIsMarkdownSynced(false);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  // 시설 유형 넣기
  const handleFacilityTypeChange = (e) => {
    const facilityTypeMap = {
      요양병원: "nursing_hospital",
      요양원: "nursing_home",
      실버타운: "silver_town",
    };

    const selected = e.target.value;
    setFacilityType(selected);
    setFormData((prev) => ({
      ...prev,
      type: facilityTypeMap[selected],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();

    // dto 객체 구성
    const dto = {
      type: formData.type,
      name: formData.name,
      establishedYear: Number(formData.establishedYear),
      address: formData.address,
      phone: formData.phone,
      homepage: formData.homepage,
      grade: formData.grade,
      facilitySize: formData.facilitySize,
      description: formData.description,
      weekdayHours: formData.weekdayHours,
      weekendHours: formData.weekendHours,
      holidayHours: formData.holidayHours,
      visitingHours: formData.visitingHours,
    };

    form.append(
      "dto",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
    );

    // 이미지 추가
    formData.images.forEach((imgObj) => {
      form.append("images", imgObj.file); // file 속성에서 원본 파일을 꺼냄
    });

    try {
      const response = await fetch(
        `${API_BASE_URL}/facility/create`,
        {
          method: "POST",
          body: form,
        }
      );

      if (response.ok) {
        alert("시설 등록 완료");
        navigate("/admin/facilities");
      } else {
        const err = await response.json();
        alert("등록 실패: " + err.message);
      }
    } catch (err) {
      console.error("등록 중 오류 발생:", err);
      alert("서버 오류 발생");
    }
  };


  // 시설설명 마크다운으로 변환
  const [loadingMarkDown, setLoadingMarkDown] = useState(false);
  const [isMarkdownSynced, setIsMarkdownSynced] = useState(false);
  const handleMarkdownConvert = async () => {
    setLoadingMarkDown(true);
    try {
      const response = await fetch("http://localhost:8000/markdown", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          raw_text: formData.description, // 현재 입력된 시설 설명
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          description: data.markdown.replace(/\\n/g, "\n"), // 변환된 마크다운으로 대체
        }));
        setIsMarkdownSynced(true);
      } else {
        alert("마크다운 변환 실패: " + data.detail);
      }
    } catch (err) {
      console.error("에러 발생:", err);
      alert("서버 요청 실패!");
    } finally {
      setLoadingMarkDown(false);
      setIsMarkdownSynced(false);
    }
  };

  return (
    <div className="admin-facilities-new-page">
      <div className="page-header-full">
        <div className="header-inner">
          <Link to="/admin/facilities" className="flex items-center gap-1">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
            <span className="page-title">새 시설 등록</span>
          </Link>
        </div>
      </div>

      <div className="facility-type-wrapper">
        <label className="facility-type-label">시설 유형 *</label>
        <div className="facility-type-select">
          <Select value={facilityType} onChange={handleFacilityTypeChange}>
            <option value="">종류</option>
            <option value="요양병원">요양병원</option>
            <option value="요양원">요양원</option>
            <option value="실버타운">실버타운</option>
          </Select>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="facility-form">
        <div className="form-section">
          <div className="form-group">
            <label>시설명 *</label>
            <Input
              name="name"
              placeholder="시설 이름을 입력하세요"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>설립년도 *</label>
            <Input
              name="establishedYear"
              placeholder="설립년도로 입력하세요"
              value={formData.establishedYear}
              onChange={handleChange}
            />
          </div>

          <div className="form-group address-row">
            <label>주소 *</label>
            <div className="address-input-group">
              <Input
                name="address"
                placeholder="시설 주소를 입력하세요"
                value={formData.address}
                onChange={handleChange}
              />
              <Button
                type="button"
                onClick={() => setShowAddressSearch(true)}
                className="address-search-button"
              >
                주소 찾기
              </Button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>연락처</label>
              <Input
                name="phone"
                placeholder="연락처를 입력하세요"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>홈페이지</label>
              <Input
                name="homepage"
                placeholder="홈페이지 URL을 입력하세요"
                value={formData.homepage}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>평가등급</label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">등급을 선택하세요</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="등급제외">등급제외</option>
              </select>
            </div>
            <div className="form-group">
              <label>병원 규모</label>
              <select
                name="facilitySize"
                value={formData.facilitySize}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">규모를 선택하세요</option>
                <option value="LARGE">대형</option>
                <option value="MEDIUM">중형</option>
                <option value="SMALL">소형</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>시설 설명</label>
            <Textarea
              name="description"
              placeholder="시설에 대한 설명을 입력하세요"
              value={formData.description}
              onChange={handleChange}
              rows="15"
            />
            <Button
              type="button"
              className="markdown-preview-button"
              onClick={handleMarkdownConvert}
              disabled={loadingMarkDown || isMarkdownSynced}
            >
              {loadingMarkDown
                ? "변환 중..."
                : isMarkdownSynced
                ? "변환 완료"
                : "시설 설명 마크다운으로 변환"}
            </Button>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>평일 운영시간</label>
              <Input
                name="weekdayHours"
                placeholder="예: 09:00 - 18:00"
                value={formData.weekdayHours}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>주말 운영시간</label>
              <Input
                name="weekendHours"
                placeholder="예: 10:00 - 15:00"
                value={formData.weekendHours}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>공휴일 운영시간</label>
              <Input
                name="holidayHours"
                placeholder="예: 10:00 - 15:00"
                value={formData.holidayHours}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>면회시간</label>
              <Input
                name="visitingHours"
                placeholder="예: 13:30 - 17:00"
                value={formData.visitingHours}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section1">
          <h2>시설 이미지</h2>
          <div
            className="image-upload-area"
            onClick={() =>
              document.getElementById("image-upload-input").click()
            }
          >
            <img
              src="/icons/upload-photo.png"
              alt="사진 업로드"
              className="image-upload-icon-img"
            />
            <div className="image-upload-text">
              이미지를 업로드하세요 (최대 5MB)
            </div>
            <input
              id="image-upload-input"
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={(e) => {
                const files = Array.from(e.target.files);
                const newImages = files.map((file) => ({
                  file,
                  preview: URL.createObjectURL(file),
                }));
                setFormData({
                  ...formData,
                  images: [...formData.images, ...newImages],
                });
              }}
            />
          </div>
          {formData.images.length > 0 && (
            <div
              className="image-preview-list"
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                marginTop: "1rem",
              }}
            >
              {formData.images.map((image, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img
                    src={image.preview}
                    alt="업로드 이미지"
                    className="uploaded-image"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    <X className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className="form-actions"
          style={{ display: "flex", gap: "0.5rem", marginTop: "2rem" }}
        >
          <Button
            type="button"
            onClick={() => navigate("/admin/facilities")}
            className="facility-action-button facility-cancel-button"
          >
            취소
          </Button>
          <Button
            type="submit"
            className="facility-action-button facility-submit-button"
          >
            시설 등록
          </Button>
        </div>
      </form>
      {showAddressSearch && (
        <KakaoAddressSearch
          onComplete={(address) => {
            setFormData((prev) => ({ ...prev, address }));
            setShowAddressSearch(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminFacilitiesNewPage;
