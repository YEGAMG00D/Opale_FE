import React, { useState, useEffect } from "react";
import { fetchPerformanceImages, uploadPerformanceImageFile, deletePerformanceImage } from "../../api/performanceImageApi";
import { normalizePerformanceImageList } from "../../services/normalizePerformanceImageList";
import styles from "./PerformanceImageSection.module.css";

const PerformanceImageSection = ({ selectedPerformance }) => {
  const [imageListData, setImageListData] = useState(null);
  const [loadingImages, setLoadingImages] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageType, setImageType] = useState("DISCOUNT");

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
    document.getElementById("image-file-input").click();
  };

  if (!selectedPerformance) {
    return null;
  }

  const imageTypeLabels = {
    DISCOUNT: "할인",
    CASTING: "캐스팅",
    SEAT: "좌석",
    NOTICE: "공지",
    OTHER: "기타",
  };

  return (
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
            id="image-file-input"
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
  );
};

export default PerformanceImageSection;

