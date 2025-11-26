import React, { useState, useEffect } from "react";
import { usePerformanceList } from "../../hooks/usePerformanceList";
import { fetchPerformanceImages, uploadPerformanceImageFile, deletePerformanceImage } from "../../api/performanceImageApi";
import { normalizePerformanceImageList } from "../../services/normalizePerformanceImageList";
import styles from "./PerformanceAdminPage.module.css";

const PerformanceAdminPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPerformance, setSelectedPerformance] = useState(null);
  const [imageListData, setImageListData] = useState(null);
  const [loadingImages, setLoadingImages] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageType, setImageType] = useState("DISCOUNT");

  // 공연 목록 조회 (검색어 포함)
  const { performances, sentinelRef, loading: loadingPerformances } = usePerformanceList({
    keyword: searchQuery.trim() || null,
    sortType: "인기",
  });

  // 공연 선택 시 이미지 목록 조회
  useEffect(() => {
    if (!selectedPerformance) {
      setImageListData(null);
      return;
    }

    const loadImages = async () => {
      setLoadingImages(true);
      try {
        const response = await fetchPerformanceImages(selectedPerformance.id);
        const normalized = normalizePerformanceImageList(response);
        setImageListData(normalized);
      } catch (err) {
        console.error("이미지 목록 조회 실패:", err);
        setImageListData(null);
      } finally {
        setLoadingImages(false);
      }
    };

    loadImages();
  }, [selectedPerformance]);

  // 파일 업로드 핸들러
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedPerformance) {
      return;
    }

    setUploading(true);
    try {
      await uploadPerformanceImageFile(
        selectedPerformance.id,
        file,
        imageType,
        null // sourceUrl은 선택사항
      );
      
      // 업로드 성공 후 이미지 목록 새로고침
      const response = await fetchPerformanceImages(selectedPerformance.id);
      const normalized = normalizePerformanceImageList(response);
      setImageListData(normalized);
      
      // 파일 input 초기화
      e.target.value = "";
      alert("이미지 업로드가 완료되었습니다.");
    } catch (err) {
      console.error("이미지 업로드 실패:", err);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  // 이미지 삭제 핸들러
  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("정말 이 이미지를 삭제하시겠습니까?")) {
      return;
    }

    setDeleting(true);
    try {
      await deletePerformanceImage(imageId);
      
      // 삭제 성공 후 이미지 목록 새로고침
      const response = await fetchPerformanceImages(selectedPerformance.id);
      const normalized = normalizePerformanceImageList(response);
      setImageListData(normalized);
      
      alert("이미지가 삭제되었습니다.");
    } catch (err) {
      console.error("이미지 삭제 실패:", err);
      alert("이미지 삭제에 실패했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  // 파일 선택 버튼 클릭 핸들러
  const handleUploadButtonClick = () => {
    document.getElementById("file-input").click();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>공연 정보 관리</h1>
        <p className={styles.subtitle}>공연 수집 이미지를 관리할 수 있습니다.</p>
      </div>

      {/* 공연 검색 및 선택 영역 */}
      <div className={styles.searchSection}>
        <div className={styles.searchHeader}>
          <h2 className={styles.sectionTitle}>공연 선택</h2>
        </div>
        
        <div className={styles.searchInputWrapper}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="공연명으로 검색하세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* 공연 목록 */}
        <div className={styles.performanceList}>
          {loadingPerformances && <div className={styles.loading}>로딩 중...</div>}
          {!loadingPerformances && performances.length === 0 && (
            <div className={styles.emptyMessage}>검색 결과가 없습니다.</div>
          )}
          {performances.map((performance) => (
            <div
              key={performance.id}
              className={`${styles.performanceItem} ${
                selectedPerformance?.id === performance.id ? styles.selected : ""
              }`}
              onClick={() => setSelectedPerformance(performance)}
            >
              <div className={styles.performanceInfo}>
                <div className={styles.performanceTitle}>{performance.title}</div>
                <div className={styles.performanceVenue}>{performance.venue}</div>
                <div className={styles.performanceDate}>
                  {performance.startDate} ~ {performance.endDate}
                </div>
              </div>
            </div>
          ))}
          <div ref={sentinelRef} style={{ height: 20 }} />
        </div>
      </div>

      {/* 선택된 공연의 이미지 관리 영역 */}
      {selectedPerformance && (
        <div className={styles.imageSection}>
          <div className={styles.imageSectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                {imageListData?.title || selectedPerformance.title} - 수집 이미지
              </h2>
              {imageListData && (
                <div className={styles.imageStats}>
                  <span>전체: {imageListData.totalCount}</span>
                  <span>할인: {imageListData.discountCount}</span>
                  <span>캐스팅: {imageListData.castingCount}</span>
                  <span>좌석: {imageListData.seatCount}</span>
                  <span>공지: {imageListData.noticeCount}</span>
                  <span>기타: {imageListData.otherCount}</span>
                </div>
              )}
            </div>
            <div className={styles.uploadControls}>
              <select
                className={styles.imageTypeSelect}
                value={imageType}
                onChange={(e) => setImageType(e.target.value)}
              >
                <option value="DISCOUNT">할인</option>
                <option value="CASTING">캐스팅</option>
                <option value="SEAT">좌석</option>
                <option value="NOTICE">공지</option>
                <option value="OTHER">기타</option>
              </select>
              <button
                className={styles.uploadButton}
                onClick={handleUploadButtonClick}
                disabled={uploading || deleting}
              >
                {uploading ? "업로드 중..." : "파일 업로드"}
              </button>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
            </div>
          </div>

          {/* 이미지 목록 */}
          <div className={styles.imageList}>
            {loadingImages && <div className={styles.loading}>이미지 로딩 중...</div>}
            {!loadingImages && imageListData && imageListData.images.length === 0 && (
              <div className={styles.emptyMessage}>등록된 이미지가 없습니다.</div>
            )}
            {!loadingImages && imageListData && imageListData.images.map((image) => {
              const imageTypeLabels = {
                DISCOUNT: "할인",
                CASTING: "캐스팅",
                SEAT: "좌석",
                NOTICE: "공지",
                OTHER: "기타",
              };
              
              // 디버깅: 이미지 데이터 확인
              console.log('이미지 렌더링:', {
                performanceImageId: image.performanceImageId,
                imageUrl: image.imageUrl,
                imageType: image.imageType,
                hasImageUrl: !!image.imageUrl
              });
              
              return (
                <div key={image.performanceImageId} className={styles.imageItem}>
                  <div className={styles.imageWrapper}>
                    {image.imageUrl ? (
                      <img
                        src={decodeURIComponent(image.imageUrl)}
                        alt={`${imageTypeLabels[image.imageType] || image.imageType} 이미지`}
                        className={styles.image}
                        crossOrigin="anonymous"
                        onLoad={() => {
                          console.log('이미지 로드 성공:', image.imageUrl);
                        }}
                        onError={(e) => {
                          console.error('이미지 로드 실패:', {
                            originalUrl: image.imageUrl,
                            decodedUrl: decodeURIComponent(image.imageUrl),
                            error: e,
                            target: e.target
                          });
                          // 이미지 로드 실패 시 플레이스홀더 표시
                          e.target.style.display = 'none';
                          const wrapper = e.target.parentElement;
                          const placeholder = wrapper.querySelector(`.${styles.imagePlaceholder}`);
                          if (placeholder) {
                            placeholder.style.display = 'flex';
                          }
                        }}
                      />
                    ) : (
                      <div className={styles.imagePlaceholder}>
                        <span>이미지 URL 없음</span>
                      </div>
                    )}
                    {/* 이미지 로드 실패 시 표시할 플레이스홀더 */}
                    {image.imageUrl && (
                      <div className={styles.imagePlaceholder} style={{ display: 'none' }}>
                        <span>이미지 로드 실패</span>
                      </div>
                    )}
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteImage(image.performanceImageId)}
                      disabled={deleting}
                      title="이미지 삭제"
                    >
                      ✕
                    </button>
                  </div>
                  <div className={styles.imageInfo}>
                    <div className={styles.imageType}>
                      {imageTypeLabels[image.imageType] || image.imageType}
                    </div>
                    {image.sourceUrl && (
                      <div className={styles.sourceUrl} title={image.sourceUrl}>
                        출처: {image.sourceUrl.length > 30 
                          ? `${image.sourceUrl.substring(0, 30)}...` 
                          : image.sourceUrl}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!selectedPerformance && (
        <div className={styles.placeholder}>
          <p>공연을 선택하면 이미지 관리가 가능합니다.</p>
        </div>
      )}
    </div>
  );
};

export default PerformanceAdminPage;

