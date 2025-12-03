import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  fetchAllMainContentBanners, 
  createMainContentBannerWithFile,
  createMainContentBannerWithoutFile,
  updateMainContentBanner, 
  deleteMainContentBanner 
} from "../../api/bannerApi";
import { normalizeAdminMainContentBannerList } from "../../services/normalizeBanner";
import PerformanceSelector from "../../components/admin/PerformanceSelector";
import styles from "./ContentBannerAdminPage.module.css";

const ContentBannerAdminPage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  
  // 공연 검색 관련 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedPerformance, setSelectedPerformance] = useState(null);
  const debounceTimerRef = useRef(null);
  
  // 등록 방식 선택 (이미지 업로드 or 공연 선택)
  const [registrationMode, setRegistrationMode] = useState("image"); // "image" or "performance"
  
  // 폼 상태
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    linkUrl: "",
    performanceId: "",
    displayOrder: 0,
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // 배너 목록 조회
  const loadBanners = async () => {
    setLoading(true);
    try {
      const data = await fetchAllMainContentBanners();
      const normalized = normalizeAdminMainContentBannerList(data);
      // displayOrder로 정렬
      normalized.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      setBanners(normalized);
    } catch (err) {
      console.error("컨텐츠 배너 목록 조회 실패:", err);
      alert("컨텐츠 배너 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  // 검색어 debounce 처리
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms 지연

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  // 공연 선택 시 performanceId 자동 입력
  useEffect(() => {
    if (selectedPerformance && selectedPerformance.id) {
      setFormData(prev => ({
        ...prev,
        performanceId: selectedPerformance.id,
      }));
    }
  }, [selectedPerformance]);

  // 폼 초기화
  const resetForm = () => {
    // 새 배너 등록 시: 현재 배너 개수 + 1로 자동 설정
    const newDisplayOrder = banners.length + 1;
    setFormData({
      title: "",
      content: "",
      linkUrl: "",
      performanceId: "",
      displayOrder: newDisplayOrder,
      isActive: true,
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingBanner(null);
    setRegistrationMode("image");
    setIsFormOpen(false);
    // 검색 관련 상태도 초기화
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setSelectedPerformance(null);
  };

  // 수정 모드로 전환
  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || "",
      content: banner.content || "",
      linkUrl: banner.linkUrl || "",
      performanceId: banner.performanceId || "",
      displayOrder: banner.displayOrder || 0,
      isActive: banner.isActive ?? true,
    });
    setImagePreview(banner.imageUrl || null);
    setImageFile(null);
    // 수정 시에는 기존 데이터에 따라 모드 설정
    setRegistrationMode(banner.performanceId ? "performance" : "image");
    // 검색 관련 상태 초기화
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setSelectedPerformance(null);
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
    
    if (!formData.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!formData.content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    // 등록 방식에 따른 검증
    if (registrationMode === "image") {
      // 이미지 업로드 모드: 새 등록 시 이미지 필수
      if (!editingBanner && !imageFile) {
        alert("이미지 파일을 선택해주세요.");
        return;
      }
    } else {
      // 공연 선택 모드: performanceId 필수
      if (!formData.performanceId.trim()) {
        alert("공연을 선택해주세요.");
        return;
      }
    }

    try {
      if (editingBanner) {
        // 수정: 항상 multipart로 전송 (파일이 없어도)
        await updateMainContentBanner(editingBanner.contentBannerId, formData, imageFile);
        alert("컨텐츠 배너가 수정되었습니다.");
      } else {
        // 등록
        if (registrationMode === "image") {
          // 이미지 파일이 있는 경우
          await createMainContentBannerWithFile(formData, imageFile);
        } else {
          // 공연 선택 모드: 파일 없이 등록
          await createMainContentBannerWithoutFile(formData);
        }
        alert("컨텐츠 배너가 등록되었습니다.");
      }
      resetForm();
      loadBanners();
    } catch (err) {
      console.error("컨텐츠 배너 저장 실패:", err);
      alert("컨텐츠 배너 저장에 실패했습니다.");
    }
  };

  // 배너 삭제
  const handleDelete = async (contentBannerId) => {
    if (!window.confirm("정말 이 컨텐츠 배너를 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deleteMainContentBanner(contentBannerId);
      alert("컨텐츠 배너가 삭제되었습니다.");
      loadBanners();
    } catch (err) {
      console.error("컨텐츠 배너 삭제 실패:", err);
      alert("컨텐츠 배너 삭제에 실패했습니다.");
    }
  };

  // 드래그 시작
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
    e.target.style.opacity = '0.5';
  };

  // 드래그 오버
  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  // 드래그 리브
  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  // 드롭
  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // 새로운 순서로 배열 재정렬
    const newBanners = [...banners];
    const draggedBanner = newBanners[draggedIndex];
    newBanners.splice(draggedIndex, 1);
    newBanners.splice(dropIndex, 0, draggedBanner);

    // displayOrder 재계산 (1부터 시작)
    const updatedBanners = newBanners.map((banner, index) => ({
      ...banner,
      displayOrder: index + 1,
    }));

    // UI 즉시 업데이트
    setBanners(updatedBanners);
    setDraggedIndex(null);
    setDragOverIndex(null);

    // 변경된 배너들 모두 업데이트
    try {
      const updatePromises = updatedBanners.map((banner) => {
        const updateData = {
          title: banner.title || "",
          content: banner.content || "",
          linkUrl: banner.linkUrl || "",
          performanceId: banner.performanceId || "",
          displayOrder: banner.displayOrder,
          isActive: banner.isActive ?? true,
        };
        return updateMainContentBanner(banner.contentBannerId, updateData, null);
      });

      await Promise.all(updatePromises);
      alert("컨텐츠 배너 순서가 변경되었습니다.");
    } catch (err) {
      console.error("컨텐츠 배너 순서 변경 실패:", err);
      alert("컨텐츠 배너 순서 변경에 실패했습니다. 페이지를 새로고침합니다.");
      loadBanners(); // 실패 시 원래 상태로 복구
    }
  };

  // 드래그 종료
  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link to="/admin" className={styles.breadcrumbLink}>운영자 관리 홈</Link>
        <span className={styles.breadcrumbSeparator}> / </span>
        <span className={styles.breadcrumbItem}>배너 관리</span>
        <span className={styles.breadcrumbSeparator}> / </span>
        <span className={styles.breadcrumbCurrent}>홈 컨텐츠 배너 관리</span>
      </div>
      <div className={styles.header}>
        <h1 className={styles.title}>홈 컨텐츠 배너 관리</h1>
        <p className={styles.subtitle}>메인 페이지의 함께 보는 공연 숏텐츠 배너를 관리할 수 있습니다.</p>
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
              <h2>{editingBanner ? "컨텐츠 배너 수정" : "컨텐츠 배너 등록"}</h2>
              <button className={styles.closeButton} onClick={resetForm}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* 등록 방식 선택 (새 등록 시에만) */}
              {!editingBanner && (
                <div className={styles.formRow}>
                  <label>등록 방식 *</label>
                  <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="registrationMode"
                        value="image"
                        checked={registrationMode === "image"}
                        onChange={(e) => {
                          setRegistrationMode(e.target.value);
                          setImageFile(null);
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, performanceId: "" }));
                          setSelectedPerformance(null);
                        }}
                      />
                      <span>이미지 업로드</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="registrationMode"
                        value="performance"
                        checked={registrationMode === "performance"}
                        onChange={(e) => {
                          setRegistrationMode(e.target.value);
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                      />
                      <span>공연 선택</span>
                    </label>
                  </div>
                </div>
              )}

              {/* 이미지 업로드 섹션 */}
              {registrationMode === "image" && (
                <div className={styles.formRow}>
                  <label>이미지 {!editingBanner && "*"}</label>
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
              )}

              {/* 공연 선택 섹션 */}
              {registrationMode === "performance" && (
                <div className={styles.performanceSelectorWrapper}>
                  <PerformanceSelector
                    searchQuery={searchQuery}
                    debouncedSearchQuery={debouncedSearchQuery}
                    onSearchChange={setSearchQuery}
                    selectedPerformance={selectedPerformance}
                    onSelectPerformance={setSelectedPerformance}
                  />
                </div>
              )}

              <div className={styles.formRow}>
                <label>제목 *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="예: 차은우·김재환, 군복 깜찍 투샷"
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label>내용 *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="예: 차은우와 김재환이 군복을 입고 찍은 깜찍한 투샷이 공개되었습니다."
                  rows="3"
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label>링크 URL (선택)</label>
                <input
                  type="text"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                  placeholder="예: https://news.site/article/123"
                />
                <small style={{ color: '#999', fontSize: '12px', marginTop: '4px' }}>
                  링크 URL과 공연 ID 중 하나는 반드시 입력해야 합니다.
                </small>
              </div>

              {editingBanner && (
                <div className={styles.formRow}>
                  <label>노출 순서 *</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    min="1"
                    required
                  />
                  <small style={{ color: '#999', fontSize: '12px', marginTop: '4px' }}>
                    순서는 드래그 앤 드롭으로도 변경할 수 있습니다.
                  </small>
                </div>
              )}

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
          <div className={styles.emptyMessage}>등록된 컨텐츠 배너가 없습니다.</div>
        )}
        {!loading && banners.map((banner, index) => (
          <div 
            key={banner.contentBannerId} 
            className={`${styles.bannerItem} ${draggedIndex === index ? styles.dragging : ''} ${dragOverIndex === index ? styles.dragOver : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            <div className={styles.dragHandle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="5" r="1"></circle>
                <circle cx="9" cy="12" r="1"></circle>
                <circle cx="9" cy="19" r="1"></circle>
                <circle cx="15" cy="5" r="1"></circle>
                <circle cx="15" cy="12" r="1"></circle>
                <circle cx="15" cy="19" r="1"></circle>
              </svg>
            </div>
            <div className={styles.bannerImage}>
              {banner.imageUrl ? (
                <img src={banner.imageUrl} alt={banner.title} />
              ) : (
                <div className={styles.noImage}>이미지 없음</div>
              )}
            </div>
            <div className={styles.bannerInfo}>
              <div className={styles.bannerHeader}>
                <h3>{banner.title || "제목 없음"}</h3>
                <div className={styles.bannerBadges}>
                  {banner.isActive && <span className={styles.activeBadge}>활성</span>}
                  <span className={styles.orderBadge}>순서: {banner.displayOrder}</span>
                </div>
              </div>
              <div className={styles.bannerDetails}>
                <p><strong>내용:</strong> {banner.content || "-"}</p>
                {banner.linkUrl && <p className={styles.linkText}><strong>링크:</strong> {banner.linkUrl}</p>}
                {banner.performanceId && <p><strong>공연 ID:</strong> {banner.performanceId}</p>}
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
                  onClick={() => handleDelete(banner.contentBannerId)}
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

export default ContentBannerAdminPage;

