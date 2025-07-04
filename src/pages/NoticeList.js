import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchNoticesByFacilityId } from "../api/notice";
import FloatingNavButtons from "../components/FloatingNavButtons";
import styles from "../styles/pages/NoticeList.module.css";

function NoticeList() {
  const { facilityId } = useParams();
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetchNoticesByFacilityId(facilityId)
      .then((data) => {
        console.log("📦 받아온 공지:", data); // ← 여기에 출력
        setNotices(data);
      })
      .catch((err) => console.error("❌ 공지 API 오류:", err));
  }, [facilityId]);

  if (notices.length === 0) {
    return <div>공지사항이 없습니다.</div>;
  }

  const facilityName = notices[0]?.facilityName || "시설";

  return (
    <>
      <FloatingNavButtons />
      <div className={styles["notice-list-container"]}>
        <h2>{facilityName} 공지게시판</h2>

        <div className={styles["notice-fixed"]}>
          <h4>고정 공지</h4>
          {notices
            .filter((n) => n.noticeIsFixed)
            .map((n) => (
              <div
                key={n.noticeId}
                className={`${styles["notice-item"]} ${styles["fixed"]}`}
              >
                <Link to={`/notice/${facilityId}/${n.noticeId}`}>
                  {n.noticeTitle}
                </Link>
              </div>
            ))}
        </div>

        <div className={styles["notice-recent"]}>
          <h4>최근 공지</h4>
          {notices
            .filter((n) => !n.noticeIsFixed)
            .map((n) => (
              <div key={n.noticeId} className={styles["notice-item"]}>
                <Link to={`/notice/${facilityId}/${n.noticeId}`}>
                  {n.noticeTitle}
                </Link>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default NoticeList;
