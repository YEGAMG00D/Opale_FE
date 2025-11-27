/* ============================================================
    🎯 Banner Admin & Main API (메인 배너 관리)
    - 관리자: 배너 목록 조회 / 등록 / 수정 / 삭제 (S3 업로드 포함)
    - 사용자: 메인 페이지 배너 조회
============================================================ */

import axiosInstance from "./axiosInstance";

const adminBase = "/admin/banners";
const publicBase = "/banners";

/* ============================================================
    ✅ 1) 관리자용 배너 전체 목록 조회
    GET /api/admin/banners
============================================================ */
export const fetchAllBanners = async () => {
  try {
    const res = await axiosInstance.get(`${adminBase}`);

    if (res.data.success) return res.data.data;
    throw new Error("배너 목록 조회 실패");
  } catch (err) {
    console.error("❌ fetchAllBanners 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ 2) 관리자용 배너 등록 (multipart + S3 업로드)
    POST /api/admin/banners
============================================================ */
export const createBanner = async (dto, file) => {
  try {
    const formData = new FormData();

    // DTO 필드들
    formData.append("performanceId", dto.performanceId ?? "");
    formData.append("titleText", dto.titleText ?? "");
    formData.append("subtitleText", dto.subtitleText ?? "");
    formData.append("descriptionText", dto.descriptionText ?? "");
    formData.append("dateText", dto.dateText ?? "");
    formData.append("placeText", dto.placeText ?? "");
    formData.append("displayOrder", dto.displayOrder);
    formData.append("isActive", dto.isActive);

    // 이미지 파일
    if (file) {
      formData.append("file", file);
    }

    const res = await axiosInstance.post(`${adminBase}`, formData, {
      headers: {
        // Content-Type 자동 설정 (절대 직접 넣지 말기)
      },
    });

    if (res.data.success) return res.data.data;
    throw new Error("배너 등록 실패");
  } catch (err) {
    console.error("❌ createBanner 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ 3) 관리자용 배너 수정 (multipart + S3 업로드)
    PUT /api/admin/banners/{bannerId}
============================================================ */
export const updateBanner = async (bannerId, dto, file) => {
  try {
    const formData = new FormData();

    formData.append("performanceId", dto.performanceId ?? "");
    formData.append("titleText", dto.titleText ?? "");
    formData.append("subtitleText", dto.subtitleText ?? "");
    formData.append("descriptionText", dto.descriptionText ?? "");
    formData.append("dateText", dto.dateText ?? "");
    formData.append("placeText", dto.placeText ?? "");
    formData.append("displayOrder", dto.displayOrder);
    formData.append("isActive", dto.isActive);

    if (file) {
      formData.append("file", file);
    }

    const res = await axiosInstance.put(
      `${adminBase}/${bannerId}`,
      formData,
      {
        headers: {},
      }
    );

    if (res.data.success) return res.data.data;
    throw new Error("배너 수정 실패");
  } catch (err) {
    console.error("❌ updateBanner 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ 4) 관리자용 배너 삭제
    DELETE /api/admin/banners/{bannerId}
============================================================ */
export const deleteBanner = async (bannerId) => {
  try {
    const res = await axiosInstance.delete(`${adminBase}/${bannerId}`);

    if (res.data.success) return true;
    throw new Error("배너 삭제 실패");
  } catch (err) {
    console.error("❌ deleteBanner 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ 5) 메인 페이지 배너 조회 (사용자)
    GET /api/banners/main
============================================================ */
export const fetchMainBanners = async () => {
  try {
    const res = await axiosInstance.get(`${publicBase}/main`);

    if (res.data.success) return res.data.data;
    throw new Error("메인 배너 조회 실패");
  } catch (err) {
    console.error("❌ fetchMainBanners 오류:", err);
    throw err;
  }
};





export default {
  fetchAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  fetchMainBanners,
};
