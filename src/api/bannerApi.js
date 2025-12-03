/* ============================================================
    🎯 Banner API (Admin & Main)
    - 메인 배너           : 기존 연동 완료
    - 메인 공연 배너      : NEW ✅
    - 메인 콘텐츠 배너    : NEW ✅ (파일 있음 / 없음 분리)
============================================================ */

import axiosInstance from "./axiosInstance";

/* ============================================================
    ✅ Base URL 정의
============================================================ */

// 기존 메인 배너
const adminBannerBase = "/admin/banners";
const publicBannerBase = "/banners";

// 메인 공연 배너
const adminMainPerformanceBase = "/admin/main-performance-banners";
const publicMainPerformanceBase = "/main-performance-banners";

// 메인 콘텐츠 배너
const adminMainContentBase = "/admin/main-content-banners";
const publicMainContentBase = "/main-content-banners";

/* ============================================================
    ✅ [기존] 1) 관리자용 메인 배너 전체 조회
    GET /api/admin/banners
============================================================ */
export const fetchAllBanners = async () => {
  try {
    const res = await axiosInstance.get(`${adminBannerBase}`);
    if (res.data.success) return res.data.data;
    throw new Error("배너 목록 조회 실패");
  } catch (err) {
    console.error("❌ fetchAllBanners 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ ✅ ✅ 2-1) 관리자용 메인 배너 등록 (파일 없음)
    POST /api/admin/banners (JSON)
============================================================ */
export const createBannerWithoutFile = async (dto) => {
  try {
    const res = await axiosInstance.post(
      `${adminBannerBase}`,
      {
        performanceId: dto.performanceId ?? "",
        titleText: dto.titleText ?? "",
        subtitleText: dto.subtitleText ?? "",
        descriptionText: dto.descriptionText ?? "",
        dateText: dto.dateText ?? "",
        placeText: dto.placeText ?? "",
        displayOrder: dto.displayOrder,
        isActive: dto.isActive,
        linkUrl: dto.linkUrl ?? "",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.data.success) return res.data.data;
    throw new Error("배너 등록 실패 (파일 없음)");
  } catch (err) {
    console.error("❌ createBannerWithoutFile 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ ✅ ✅ 2-2) 관리자용 메인 배너 등록 (파일 포함)
    POST /api/admin/banners (multipart)
============================================================ */
export const createBannerWithFile = async (dto, file) => {
  try {
    const formData = new FormData();

    const dataBlob = new Blob(
      [JSON.stringify({
        performanceId: dto.performanceId ?? "",
        titleText: dto.titleText ?? "",
        subtitleText: dto.subtitleText ?? "",
        descriptionText: dto.descriptionText ?? "",
        dateText: dto.dateText ?? "",
        placeText: dto.placeText ?? "",
        displayOrder: dto.displayOrder,
        isActive: dto.isActive,
        linkUrl: dto.linkUrl ?? "",
      })],
      { type: "application/json" }
    );

    formData.append("data", dataBlob);
    if (file) formData.append("file", file);

    const res = await axiosInstance.post(`${adminBannerBase}`, formData);
    if (res.data.success) return res.data.data;
    throw new Error("배너 등록 실패 (파일 포함)");
  } catch (err) {
    console.error("❌ createBannerWithFile 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ [기존] 2) 관리자용 메인 배너 등록 (multipart) - 하위 호환성 유지
    POST /api/admin/banners
============================================================ */
export const createBanner = async (dto, file) => {
  // 파일이 있으면 multipart, 없으면 JSON
  if (file) {
    return createBannerWithFile(dto, file);
  } else {
    return createBannerWithoutFile(dto);
  }
};

/* ============================================================
    ✅ [기존] 3) 관리자용 메인 배너 수정 (multipart)
    PUT /api/admin/banners/{bannerId}
============================================================ */
export const updateBanner = async (bannerId, dto, file) => {
  try {
    const formData = new FormData();

    const dataBlob = new Blob(
      [JSON.stringify({
        performanceId: dto.performanceId ?? "",
        titleText: dto.titleText ?? "",
        subtitleText: dto.subtitleText ?? "",
        descriptionText: dto.descriptionText ?? "",
        dateText: dto.dateText ?? "",
        placeText: dto.placeText ?? "",
        displayOrder: dto.displayOrder,
        isActive: dto.isActive,
        linkUrl: dto.linkUrl ?? "",
      })],
      { type: "application/json" }
    );

    formData.append("data", dataBlob);
    if (file) formData.append("file", file);

    const res = await axiosInstance.put(
      `${adminBannerBase}/${bannerId}`,
      formData
    );

    if (res.data.success) return res.data.data;
    throw new Error("배너 수정 실패");
  } catch (err) {
    console.error("❌ updateBanner 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ [기존] 4) 관리자용 메인 배너 삭제
    DELETE /api/admin/banners/{bannerId}
============================================================ */
export const deleteBanner = async (bannerId) => {
  try {
    const res = await axiosInstance.delete(`${adminBannerBase}/${bannerId}`);
    if (res.data.success) return true;
    throw new Error("배너 삭제 실패");
  } catch (err) {
    console.error("❌ deleteBanner 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ [기존] 5) 메인 페이지 배너 조회
    GET /api/banners/main
============================================================ */
export const fetchMainBanners = async () => {
  try {
    const res = await axiosInstance.get(`${publicBannerBase}/main`);
    if (res.data.success) return res.data.data;
    throw new Error("메인 배너 조회 실패");
  } catch (err) {
    console.error("❌ fetchMainBanners 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ ✅ ✅ 6) 관리자용 메인 공연 배너 등록
    POST /api/admin/main-performance-banners
============================================================ */
export const createMainPerformanceBanner = async (dto) => {
  try {
    const res = await axiosInstance.post(
      `${adminMainPerformanceBase}`,
      {
        performanceId: dto.performanceId,
        displayOrder: dto.displayOrder,
        isActive: dto.isActive,
      }
    );

    if (res.data.success) return res.data.data;
    throw new Error("메인 공연 배너 등록 실패");
  } catch (err) {
    console.error("❌ createMainPerformanceBanner 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ ✅ ✅ 7) 관리자용 메인 공연 배너 수정
    PUT /api/admin/main-performance-banners/{bannerId}
============================================================ */
export const updateMainPerformanceBanner = async (bannerId, dto) => {
  try {
    const res = await axiosInstance.put(
      `${adminMainPerformanceBase}/${bannerId}`,
      {
        performanceId: dto.performanceId,
        displayOrder: dto.displayOrder,
        isActive: dto.isActive,
      }
    );

    if (res.data.success) return res.data.data;
    throw new Error("메인 공연 배너 수정 실패");
  } catch (err) {
    console.error("❌ updateMainPerformanceBanner 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ ✅ ✅ 8) 관리자용 메인 공연 배너 삭제
    DELETE /api/admin/main-performance-banners/{bannerId}
============================================================ */
export const deleteMainPerformanceBanner = async (bannerId) => {
  try {
    const res = await axiosInstance.delete(
      `${adminMainPerformanceBase}/${bannerId}`
    );

    if (res.data.success) return true;
    throw new Error("메인 공연 배너 삭제 실패");
  } catch (err) {
    console.error("❌ deleteMainPerformanceBanner 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ ✅ ✅ 9) 관리자용 메인 공연 배너 목록 조회
    GET /api/admin/main-performance-banners
============================================================ */
export const fetchAllMainPerformanceBanners = async () => {
  try {
    const res = await axiosInstance.get(`${adminMainPerformanceBase}`);
    if (res.data.success) return res.data.data;
    throw new Error("메인 공연 배너 목록 조회 실패");
  } catch (err) {
    console.error("❌ fetchAllMainPerformanceBanners 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ ✅ ✅ 10) 메인 페이지 공연 배너 조회 (사용자)
    GET /api/main-performance-banners
============================================================ */
export const fetchMainPerformanceBanners = async () => {
  try {
    const res = await axiosInstance.get(`${publicMainPerformanceBase}`);
    if (res.data.success) return res.data.data;
    throw new Error("메인 공연 배너 조회 실패");
  } catch (err) {
    console.error("❌ fetchMainPerformanceBanners 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ ✅ ✅ 11) 관리자용 메인 콘텐츠 배너 등록 (파일 없음)
    POST /api/admin/main-content-banners (JSON)
============================================================ */
export const createMainContentBannerWithoutFile = async (dto) => {
  try {
    const res = await axiosInstance.post(
      `${adminMainContentBase}`,
      {
        title: dto.title,
        content: dto.content,
        linkUrl: dto.linkUrl,
        performanceId: dto.performanceId,
        displayOrder: dto.displayOrder,
        isActive: dto.isActive,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.data.success) return res.data.data;
    throw new Error("메인 콘텐츠 배너 등록 실패 (파일 없음)");
  } catch (err) {
    console.error("❌ createMainContentBannerWithoutFile 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ ✅ ✅ 12) 관리자용 메인 콘텐츠 배너 등록 (파일 포함)
    POST /api/admin/main-content-banners (multipart)
============================================================ */
export const createMainContentBannerWithFile = async (dto, file) => {
  try {
    const formData = new FormData();

    const dataBlob = new Blob(
      [JSON.stringify({
        title: dto.title,
        content: dto.content,
        linkUrl: dto.linkUrl,
        performanceId: dto.performanceId,
        displayOrder: dto.displayOrder,
        isActive: dto.isActive,
      })],
      { type: "application/json" }
    );

    formData.append("data", dataBlob);
    if (file) formData.append("file", file);

    const res = await axiosInstance.post(
      `${adminMainContentBase}`,
      formData
    );

    if (res.data.success) return res.data.data;
    throw new Error("메인 콘텐츠 배너 등록 실패 (파일 포함)");
  } catch (err) {
    console.error("❌ createMainContentBannerWithFile 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ ✅ ✅ 13) 관리자용 메인 콘텐츠 배너 수정 (multipart)
    PUT /api/admin/main-content-banners/{id}
============================================================ */
export const updateMainContentBanner = async (contentBannerId, dto, file) => {
  try {
    const formData = new FormData();

    const dataBlob = new Blob(
      [JSON.stringify({
        title: dto.title,
        content: dto.content,
        linkUrl: dto.linkUrl,
        performanceId: dto.performanceId,
        displayOrder: dto.displayOrder,
        isActive: dto.isActive,
      })],
      { type: "application/json" }
    );

    formData.append("data", dataBlob);
    if (file) formData.append("file", file);

    const res = await axiosInstance.put(
      `${adminMainContentBase}/${contentBannerId}`,
      formData
    );

    if (res.data.success) return res.data.data;
    throw new Error("메인 콘텐츠 배너 수정 실패");
  } catch (err) {
    console.error("❌ updateMainContentBanner 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ ✅ ✅ 14) 관리자용 메인 콘텐츠 배너 삭제
    DELETE /api/admin/main-content-banners/{id}
============================================================ */
export const deleteMainContentBanner = async (contentBannerId) => {
  try {
    const res = await axiosInstance.delete(
      `${adminMainContentBase}/${contentBannerId}`
    );

    if (res.data.success) return true;
    throw new Error("메인 콘텐츠 배너 삭제 실패");
  } catch (err) {
    console.error("❌ deleteMainContentBanner 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ ✅ ✅ 15) 관리자용 메인 콘텐츠 배너 목록 조회
    GET /api/admin/main-content-banners
============================================================ */
export const fetchAllMainContentBanners = async () => {
  try {
    const res = await axiosInstance.get(`${adminMainContentBase}`);
    if (res.data.success) return res.data.data;
    throw new Error("메인 콘텐츠 배너 목록 조회 실패");
  } catch (err) {
    console.error("❌ fetchAllMainContentBanners 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ ✅ ✅ 16) 메인 페이지 콘텐츠 배너 조회 (사용자)
    GET /api/main-content-banners
============================================================ */
export const fetchMainContentBanners = async () => {
  try {
    const res = await axiosInstance.get(`${publicMainContentBase}`);
    if (res.data.success) return res.data.data;
    throw new Error("메인 콘텐츠 배너 조회 실패");
  } catch (err) {
    console.error("❌ fetchMainContentBanners 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ ✅ ✅ Export 한번에
============================================================ */
export default {
  // 기존 메인 배너
  fetchAllBanners,
  createBanner,
  createBannerWithoutFile,
  createBannerWithFile,
  updateBanner,
  deleteBanner,
  fetchMainBanners,

  // 메인 공연 배너
  createMainPerformanceBanner,
  updateMainPerformanceBanner,
  deleteMainPerformanceBanner,
  fetchAllMainPerformanceBanners,
  fetchMainPerformanceBanners,

  // 메인 콘텐츠 배너
  createMainContentBannerWithoutFile,
  createMainContentBannerWithFile,
  updateMainContentBanner,
  deleteMainContentBanner,
  fetchAllMainContentBanners,
  fetchMainContentBanners,
};
