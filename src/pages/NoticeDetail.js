import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchNoticesByNoticeId } from "../api/notice";
import styles from "../styles/pages/NoticeDetail.module.css";
import FloatingNavButtons from "../components/FloatingNavButtons";

function NoticeDetail() {
  const { facilityId, noticeId } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      <div className={styles["page-background"]}>
      <div className={styles["notice-detail-wrapper"]}>
        <h2 className={styles["notice-board-title"]}>
          {notice.facilityName || "시설"} 공지게시판
        </h2>

        <div className={styles["notice-header"]}>
          <div className={styles["notice-title"]}>{notice.noticeTitle}</div>
          <div className={styles["notice-date"]}>{notice.noticeCreatedAt.substring(0, 10)}</div>
        </div>

        <div className={styles["notice-box"]}>
          {notice.noticeContent.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>

        <div className={styles["button-wrapper"]}>
          <Link to={`/notice/${facilityId}`} className={styles["back-button"]}>
            목록으로가기
          </Link>
        </div>
      </div>
      </div>
    </>
  );
}

export default NoticeDetail;
