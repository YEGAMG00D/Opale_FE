import React from "react";
import { buildYoutubeThumbnailUrl } from "../../utils/youtube";
import styles from "./AdminVideoCard.module.css";

const AdminVideoCard = ({ video, onDelete, deleting }) => {
  // embedUrl이 있으면 사용, 없으면 youtubeVideoId로 생성
  const embedUrl = video.embedUrl || (video.youtubeVideoId ? `https://www.youtube.com/embed/${video.youtubeVideoId}` : "");
  const thumbnailUrl = video.thumbnailUrl || buildYoutubeThumbnailUrl(video.youtubeVideoId);
  const watchUrl = video.youtubeUrl || `https://www.youtube.com/watch?v=${video.youtubeVideoId}`;

  return (
    <div className={styles.videoCard}>
      {/* 영상 영역 (왼쪽, 작게) */}
      <div className={styles.videoContainer}>
        {embedUrl ? (
          <div className={styles.videoIframeWrapper}>
            <iframe
              src={embedUrl}
              className={styles.videoIframe}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={video.title}
            />
          </div>
        ) : (
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.videoThumbnailLink}
          >
            <img
              src={thumbnailUrl}
              alt={video.title}
              className={styles.videoThumbnail}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/320x180?text=No+Thumbnail";
              }}
            />
            <div className={styles.playButton}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </a>
        )}
        <button
          className={styles.deleteButton}
          onClick={() => onDelete(video.performanceVideoId)}
          disabled={deleting}
          title="영상 삭제"
        >
          ✕
        </button>
      </div>

      {/* 정보 영역 (오른쪽, 크게) */}
      <div className={styles.videoInfo}>
        <div className={styles.videoTitle}>{video.title}</div>

        {video.sourceUrl && (
          <div className={styles.sourceUrl}>
            <span className={styles.label}>출처:</span>
            <a
              href={video.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.sourceLink}
              title={video.sourceUrl}
            >
              {video.sourceUrl.length > 50 
                ? `${video.sourceUrl.substring(0, 50)}...` 
                : video.sourceUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVideoCard;

