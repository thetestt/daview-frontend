import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchNoticesByNoticeId } from "../api/notice";
import "../styles/pages/NoticeDetail.css";
import FloatingNavButtons from "../components/FloatingNavButtons";

function NoticeDetail() {
  const { facilityId, noticeId } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // noticeId는 int로 변환해서 넘겨주는 게 안전
    fetchNoticesByNoticeId(facilityId, parseInt(noticeId, 10))
      .then((data) => {
        setNotice(data);
      })
      .catch((err) => {
        console.error("공지사항을 불러오는 데 실패했습니다:", err);
      })
      .finally(() => setLoading(false));
  }, [facilityId, noticeId]);

  if (loading) return <div>Loading...</div>;
  if (!notice) return <div>공지사항을 찾을 수 없습니다.</div>;

  return (
    <>
      <FloatingNavButtons />
      <div className="notice-detail-container">
        <h2>{notice.facilityName || "시설"} 공지게시판</h2>
        <h2>{notice.noticeTitle}</h2>
        <div className="notice-date">{notice.noticeCreatedAt}</div>
        <div className="notice-content">
          {notice.noticeContent.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
        <Link to={`/notice/${facilityId}`} className="back-button">
          목록으로가기
        </Link>
      </div>
    </>
  );
}

export default NoticeDetail;
