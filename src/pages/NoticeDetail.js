import React from "react";
import { useParams, Link } from "react-router-dom";
import notices from "../data/notices";
import "../styles/pages/NoticeDetail.css";
import FloatingNavButtons from "../components/FloatingNavButtons";

function NoticeDetail() {
  const { facilityId, noticeId } = useParams();

  const filtered = notices.filter((n) => n.facility_id === facilityId);
  const facilityName = filtered[0]?.facility_name || "시설";

  const notice = notices.find(
    (n) =>
      n.facility_id === facilityId && n.notice_id === parseInt(noticeId, 10)
  );

  if (!notice) return <div>공지사항을 찾을 수 없습니다.</div>;

  return (
    <>
      <FloatingNavButtons backTo={`/notice/${facilityId}`} />

      <div className="notice-detail-container">
        <h2> {facilityName} 공지게시판</h2>
        <h2>{notice.notice_title}</h2>
        <div className="notice-date">{notice.notice_created_at}</div>
        <div className="notice-content">
          {notice.notice_content.split("\n").map((line, idx) => (
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
