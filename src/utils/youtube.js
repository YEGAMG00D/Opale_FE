/**
 * 유튜브 URL에서 videoId 자동 추출
 * 지원 형태:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 */
export const extractYoutubeVideoId = (url) => {
    if (!url || typeof url !== "string") return null;
  
    const regex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  
    const match = url.match(regex);
    return match ? match[1] : null;
  };
  
  /**
   * videoId로 embed URL 생성
   */
  export const buildYoutubeEmbedUrl = (videoId) => {
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
  };
  
  /**
   * videoId로 썸네일 URL 생성 (고화질)
   */
  export const buildYoutubeThumbnailUrl = (videoId) => {
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };
  