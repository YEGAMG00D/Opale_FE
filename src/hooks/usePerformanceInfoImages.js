// src/hooks/usePerformanceInfoImages.js

import { useState, useEffect } from "react";
import { fetchPerformanceInfoImages } from "../api/performanceApi";
import { normalizePerformanceInfoImages } from "../services/normalizePerformanceInfoImages";

/**
 * 공연 소개 이미지 목록을 가져오는 커스텀 훅
 * @param {string} performanceId - 공연 ID
 * @returns {Object} { images, loading, error }
 */
export const usePerformanceInfoImages = (performanceId) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!performanceId) {
      setImages([]);
      return;
    }

    const loadImages = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPerformanceInfoImages(performanceId);
        const normalized = normalizePerformanceInfoImages(data);
        setImages(normalized);
      } catch (err) {
        console.error("❌ 공연 소개 이미지 조회 실패:", err);
        setError(err.message || "소개 이미지를 불러오는 중 오류가 발생했습니다.");
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [performanceId]);

  return { images, loading, error };
};

