import axiosInstance from "./axiosInstance";

const base = "/chat";

/* ============================================================
    ✅ 1. 채팅방 목록 조회
============================================================ */
export const fetchChatRooms = async () => {
  try {
    const res = await axiosInstance.get(`${base}/rooms`);
    if (res.data.success) return res.data.data.rooms || [];
    throw new Error("채팅방 목록 불러오기 실패");
  } catch (err) {
    console.error("❌ fetchChatRooms 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ 2. 단일 채팅방 상세 조회 (로그인 여부 자동 분기)
============================================================ */
export const fetchChatRoom = async (roomId, roomType) => {
  try {
    const token = localStorage.getItem("accessToken");

    // 🟢 roomType이 PERFORMANCE_PUBLIC이고 로그인 안 되어 있으면 public endpoint 사용
    const isPublicView =
      roomType === "PERFORMANCE_PUBLIC" && (!token || token.trim() === "");

    const url = isPublicView
      ? `${base}/rooms/public/${roomId}`
      : `${base}/rooms/${roomId}`;

    console.log("📡 호출 URL:", url);

    const res = await axiosInstance.get(url);

    if (res.data.success) return res.data.data;
    throw new Error("채팅방 상세 불러오기 실패");
  } catch (err) {
    console.error("❌ fetchChatRoom 오류:", err);
    throw err;
  }
};

/* ============================================================
    ✅ 3. 메시지 목록 조회
============================================================ */
export const fetchMessages = async (roomId, page = 1, size = 50) => {
  try {
    const res = await axiosInstance.get(`${base}/messages/${roomId}`, {
      params: { page, size },
    });

    if (!res.data.success) throw new Error("메시지 목록 불러오기 실패");

    const list = res.data.data?.messages || [];

    // 오래된 → 최신순 정렬
    return list.sort(
      (a, b) =>
        new Date(a.sentAt ?? a.createdAt) - new Date(b.sentAt ?? b.createdAt)
    );
  } catch (err) {
    console.error("❌ fetchMessages 오류:", err);
    return [];
  }
};

/* ============================================================
    ✅ 4. 단일 메시지 전송 (REST 백업용)
============================================================ */
export const sendMessageRest = async (roomId, message) => {
  try {
    const res = await axiosInstance.post(`${base}/messages`, {
      roomId,
      message,
    });
    if (res.data.success) return res.data.data;
    throw new Error("메시지 전송 실패");
  } catch (err) {
    console.error("❌ sendMessageRest 오류:", err);
    throw err;
  }
};

export default {
  fetchChatRooms,
  fetchChatRoom,
  fetchMessages,
  sendMessageRest,
};
