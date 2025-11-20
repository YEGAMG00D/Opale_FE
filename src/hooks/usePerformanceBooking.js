// src/hooks/usePerformanceBooking.js

import { useState, useEffect } from "react";
import { fetchPerformanceBooking } from "../api/performanceApi";
import { normalizePerformanceBooking } from "../services/normalizePerformanceBooking";

/**
 * 공연 예매 정보를 가져오는 커스텀 훅
 * @param {string} performanceId - 공연 ID
 * @returns {Object} { bookingInfo, loading, error }
 */
export const usePerformanceBooking = (performanceId) => {
  const [bookingInfo, setBookingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!performanceId) {
      setBookingInfo(null);
      return;
    }

    const loadBookingInfo = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPerformanceBooking(performanceId);
        const normalized = normalizePerformanceBooking(data);
        setBookingInfo(normalized);
      } catch (err) {
        console.error("❌ 공연 예매 정보 조회 실패:", err);
        setError(err.message || "예매 정보를 불러오는 중 오류가 발생했습니다.");
        setBookingInfo(null);
      } finally {
        setLoading(false);
      }
    };

    loadBookingInfo();
  }, [performanceId]);

  return { bookingInfo, loading, error };
};

