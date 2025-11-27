import React, { useState, useEffect } from "react";
import { fetchAllBanners, createBanner, updateBanner, deleteBanner } from "../../api/bannerApi";
import { normalizeAdminBannerList } from "../../services/normalizeBanner";
import styles from "./HomeBannerAdminPage.module.css";

const HomeBannerAdminPage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // 폼 상태
  const [formData, setFormData] = useState({
    performanceId: "",
    titleText: "",
    subtitleText: "",
    descriptionText: "",
    dateText: "",
    placeText: "",
    displayOrder: 0,
    isActive: true,
    linkUrl: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // 배너 목록 조회
  const loadBanners = async () => {
    setLoading(true);
    try {
      const data = await fetchAllBanners();
      const normalized = normalizeAdminBannerList(data);
      // displayOrder로 정렬
      normalized.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      setBanners(normalized);
    } catch (err) {
      console.error("배너 목록 조회 실패:", err);
      alert("배너 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      performanceId: "",
      titleText: "",
      subtitleText: "",
      descriptionText: "",
      dateText: "",
      placeText: "",
      displayOrder: banners.length > 0 ? Math.max(...banners.map(b => b.displayOrder || 0)) + 1 : 1,
      isActive: true,
      linkUrl: "",
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingBanner(null);
    setIsFormOpen(false);
  };

  // 수정 모드로 전환
  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      performanceId: banner.performanceId || "",
      titleText: banner.titleText || "",
      subtitleText: banner.subtitleText || "",
      descriptionText: banner.descriptionText || "",
      dateText: banner.dateText || "",
      placeText: banner.placeText || "",
      displayOrder: banner.displayOrder || 0,
      isActive: banner.isActive ?? true,
      linkUrl: banner.linkUrl || "",
    });
    setImagePreview(banner.imageUrl || null);
    setImageFile(null);
    setIsFormOpen(true);
  };

  // 이미지 파일 선택
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 배너 등록/수정
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.titleText.trim()) {
      alert("메인 문구를 입력해주세요.");
      return;
    }

    if (!editingBanner && !imageFile) {
      alert("이미지 파일을 선택해주세요.");
      return;
    }

    try {
      if (editingBanner) {
        // 수정
        await updateBanner(editingBanner.bannerId, formData, imageFile);
        alert("배너가 수정되었습니다.");
      } else {
        // 등록
        await createBanner(formData, imageFile);
        alert("배너가 등록되었습니다.");
      }
      resetForm();
      loadBanners();
    } catch (err) {
      console.error("배너 저장 실패:", err);
      alert("배너 저장에 실패했습니다.");
    }
  };

  // 배너 삭제
  const handleDelete = async (bannerId) => {
    if (!window.confirm("정말 이 배너를 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deleteBanner(bannerId);
      alert("배너가 삭제되었습니다.");
      loadBanners();
    } catch (err) {
      console.error("배너 삭제 실패:", err);
      alert("배너 삭제에 실패했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>홈 배너 관리</h1>
        <p className={styles.subtitle}>홈페이지 배너를 관리할 수 있습니다.</p>
      </div>

      {/* 등록 버튼 */}
      <div className={styles.actions}>
        <button
          className={styles.addButton}
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
        >
          + 배너 등록
        </button>
      </div>

      {/* 등록/수정 폼 */}
      {isFormOpen && (
        <div className={styles.formModal}>
          <div className={styles.formContent}>
            <div className={styles.formHeader}>
              <h2>{editingBanner ? "배너 수정" : "배너 등록"}</h2>
              <button className={styles.closeButton} onClick={resetForm}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <label>이미지 *</label>
                <div className={styles.imageUpload}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.fileInput}
                  />
                  {imagePreview && (
                    <img src={imagePreview} alt="미리보기" className={styles.previewImage} />
                  )}
                </div>
              </div>

              <div className={styles.formRow}>
                <label>메인 문구 *</label>
                <input
                  type="text"
                  value={formData.titleText}
                  onChange={(e) => setFormData({ ...formData, titleText: e.target.value })}
                  placeholder="예: 12년을 기다린 오리지널 내한공연"
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label>부제</label>
                <input
                  type="text"
                  value={formData.subtitleText}
                  onChange={(e) => setFormData({ ...formData, subtitleText: e.target.value })}
                  placeholder="예: 뮤지컬 위키드"
                />
              </div>

              <div className={styles.formRow}>
                <label>설명 문구</label>
                <input
                  type="text"
                  value={formData.descriptionText}
                  onChange={(e) => setFormData({ ...formData, descriptionText: e.target.value })}
                  placeholder="예: The untold true story of the Witches of Oz"
                />
              </div>

              <div className={styles.formRow}>
                <label>날짜 텍스트</label>
                <input
                  type="text"
                  value={formData.dateText}
                  onChange={(e) => setFormData({ ...formData, dateText: e.target.value })}
                  placeholder="예: 2025.7.12 Flying Soon"
                />
              </div>

              <div className={styles.formRow}>
                <label>장소 텍스트</label>
                <input
                  type="text"
                  value={formData.placeText}
                  onChange={(e) => setFormData({ ...formData, placeText: e.target.value })}
                  placeholder="예: BLUESQUARE 신한카드홀"
                />
              </div>

              <div className={styles.formRow}>
                <label>공연 ID (선택)</label>
                <input
                  type="text"
                  value={formData.performanceId}
                  onChange={(e) => setFormData({ ...formData, performanceId: e.target.value })}
                  placeholder="예: PF271999"
                />
              </div>

              <div className={styles.formRow}>
                <label>링크 URL (선택)</label>
                <input
                  type="text"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                  placeholder="예: https://youtube.com/..."
                />
              </div>

              <div className={styles.formRow}>
                <label>노출 순서 *</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  min="0"
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  활성화
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={resetForm} className={styles.cancelButton}>
                  취소
                </button>
                <button type="submit" className={styles.submitButton}>
                  {editingBanner ? "수정" : "등록"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 배너 목록 */}
      <div className={styles.bannerList}>
        {loading && <div className={styles.loading}>로딩 중...</div>}
        {!loading && banners.length === 0 && (
          <div className={styles.emptyMessage}>등록된 배너가 없습니다.</div>
        )}
        {!loading && banners.map((banner) => (
          <div key={banner.bannerId} className={styles.bannerItem}>
            <div className={styles.bannerImage}>
              {banner.imageUrl ? (
                <img src={banner.imageUrl} alt={banner.titleText} />
              ) : (
                <div className={styles.noImage}>이미지 없음</div>
              )}
            </div>
            <div className={styles.bannerInfo}>
              <div className={styles.bannerHeader}>
                <h3>{banner.titleText || "제목 없음"}</h3>
                <div className={styles.bannerBadges}>
                  {banner.isActive && <span className={styles.activeBadge}>활성</span>}
                  <span className={styles.orderBadge}>순서: {banner.displayOrder}</span>
                </div>
              </div>
              <div className={styles.bannerDetails}>
                <p><strong>부제:</strong> {banner.subtitleText || "-"}</p>
                <p><strong>설명:</strong> {banner.descriptionText || "-"}</p>
                <p><strong>날짜:</strong> {banner.dateText || "-"}</p>
                <p><strong>장소:</strong> {banner.placeText || "-"}</p>
                {banner.performanceId && <p><strong>공연 ID:</strong> {banner.performanceId}</p>}
                {banner.linkUrl && <p><strong>링크:</strong> {banner.linkUrl}</p>}
              </div>
              <div className={styles.bannerActions}>
                <button
                  className={styles.editButton}
                  onClick={() => handleEdit(banner)}
                >
                  수정
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(banner.bannerId)}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeBannerAdminPage;
