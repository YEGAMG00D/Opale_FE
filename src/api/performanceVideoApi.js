/* ============================================================
    🎬 Performance Video Admin API (공연 유튜브 영상 관리)
    - 영상 목록 조회
    - 유튜브 영상 등록
    - 영상 삭제
============================================================ */

import axiosInstance from "./axiosInstance";

const base = "/admin/performances";

/* ============================================================
    1) 공연 유튜브 영상 목록 조회
    GET /api/admin/performances/{performanceId}/videos
============================================================ */
export const fetchPerformanceVideos = async (performanceId) => {
  try {
    const res = await axiosInstance.get(`${base}/${performanceId}/videos`);

    if (res.data.success) return res.data.data;
    throw new Error("공연 유튜브 영상 조회 실패");
  } catch (err) {
    console.error("❌ fetchPerformanceVideos 오류:", err);
    throw err;
  }
};

/* ============================================================
    2) 공연 유튜브 영상 등록
    POST /api/admin/performances/{performanceId}/videos
============================================================ */
export const uploadPerformanceYoutubeVideo = async (
  performanceId,
  youtubeVideoId,
  title,
  thumbnailUrl = null,
  sourceUrl = null
) => {
  try {
    const params = new URLSearchParams();
    params.append("youtubeVideoId", youtubeVideoId);
    params.append("title", title);

    if (thumbnailUrl !== null && thumbnailUrl !== undefined) {
      params.append("thumbnailUrl", thumbnailUrl);
    }

    if (sourceUrl !== null && sourceUrl !== undefined) {
      params.append("sourceUrl", sourceUrl);
    }

    const res = await axiosInstance.post(
      `${base}/${performanceId}/videos`,
      params
    );

    if (res.data.success) return res.data.data;
    throw new Error("공연 유튜브 영상 등록 실패");
  } catch (err) {
    console.error("❌ uploadPerformanceYoutubeVideo 오류:", err);
    throw err;
  }
};

/* ============================================================
    3) 공연 유튜브 영상 삭제
    DELETE /api/admin/performances/videos/{videoId}
============================================================ */
export const deletePerformanceVideo = async (videoId) => {
  try {
    const res = await axiosInstance.delete(`${base}/videos/${videoId}`);

    if (res.data.success) return true;
    throw new Error("공연 유튜브 영상 삭제 실패");
  } catch (err) {
    console.error("❌ deletePerformanceVideo 오류:", err);
    throw err;
  }
};



export default {
  fetchPerformanceVideos,
  uploadPerformanceYoutubeVideo,
  deletePerformanceVideo,
};
