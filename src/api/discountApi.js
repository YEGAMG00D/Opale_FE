/* ===================================================================
    🎟 Discount API
    - 인터파크 할인 조회
    - 타임티켓 할인 조회
=================================================================== */

import axiosInstance from "./axiosInstance";

const base = "/discounts";

/* ============================================================
    🧩 공통: null-safe 변환 함수
============================================================ */
const normalizeDiscountList = (data) => {
  if (!data) {
    return {
      totalCount: 0,
      items: [],
    };
  }

  return {
    totalCount: data.totalCount ?? 0,
    items: data.items ?? [],
  };
};

/* ============================================================
    1) 인터파크 할인 조회
    GET /api/discounts/interpark
============================================================ */
export const fetchInterparkDiscounts = async () => {
  try {
    const res = await axiosInstance.get(`${base}/interpark`);

    if (res.data.success) return normalizeDiscountList(res.data.data);
    throw new Error("인터파크 할인 조회 실패");
  } catch (err) {
    console.error("❌ fetchInterparkDiscounts 오류:", err);
    throw err;
  }
};

/* ============================================================
    2) 타임티켓 할인 조회
    GET /api/discounts/timeticket
============================================================ */
export const fetchTimeticketDiscounts = async () => {
  try {
    const res = await axiosInstance.get(`${base}/timeticket`);

    if (res.data.success) return normalizeDiscountList(res.data.data);
    throw new Error("타임티켓 할인 조회 실패");
  } catch (err) {
    console.error("❌ fetchTimeticketDiscounts 오류:", err);
    throw err;
  }
};

/* ============================================================
    Export
============================================================ */
const discountApi = {
  fetchInterparkDiscounts,
  fetchTimeticketDiscounts,
};

export default discountApi;
