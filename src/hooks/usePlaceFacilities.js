// src/hooks/usePlaceFacilities.js

import { useState, useEffect } from "react";
import { fetchPlaceFacilities } from "../api/placeApi";
import { normalizePlaceFacilities } from "../services/normalizePlaceFacilities";

/**
 * 공연장 편의시설 정보를 가져오는 커스텀 훅
 * @param {string} placeId - 공연장 ID
 * @returns {Object} { convenienceFacilities, parkingFacilities, loading, error }
 */
export const usePlaceFacilities = (placeId) => {
  const [convenienceFacilities, setConvenienceFacilities] = useState([]);
  const [parkingFacilities, setParkingFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!placeId) {
      setConvenienceFacilities([]);
      setParkingFacilities([]);
      return;
    }

    const loadFacilities = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPlaceFacilities(placeId);
        const normalized = normalizePlaceFacilities(data);
        setConvenienceFacilities(normalized.convenienceFacilities);
        setParkingFacilities(normalized.parkingFacilities);
      } catch (err) {
        console.error("❌ 공연장 편의시설 정보 조회 실패:", err);
        setError(err.message || "편의시설 정보를 불러오는 중 오류가 발생했습니다.");
        setConvenienceFacilities([]);
        setParkingFacilities([]);
      } finally {
        setLoading(false);
      }
    };

    loadFacilities();
  }, [placeId]);

  return { convenienceFacilities, parkingFacilities, loading, error };
};

