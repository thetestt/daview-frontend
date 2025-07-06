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
        setNotices(data);
      })
      .catch((err) => console.error("공지 API 오류:", err));
  }, [facilityId]);

  if (notices.length === 0) {
    return <div>공지사항이 없습니다.</div>;
  }

  const facilityName = notices[0]?.facilityName || "시설";
  const fixedNotice = notices.find((n) => n.noticeIsFixed);
  const recentNotices = notices.filter((n) => !n.noticeIsFixed);

  return (
    <>
      <FloatingNavButtons />
      <div className={styles["page-background"]}>
      <div className={styles["notice-list-container"]}>
        <h2 className={styles["notice-title"]}>{facilityName} 공지사항</h2>

        {/* 고정 공지 */}
{fixedNotice && (
  <div className={styles["notice-fixed"]}>
    <h4>고정된 공지</h4>
    <Link
      to={`/notice/${facilityId}/${fixedNotice.noticeId}`}
      className={styles["fixed-box"]}
    >
      <h5>{fixedNotice.noticeTitle}</h5>
      <p>{fixedNotice.noticeContent}</p>
    </Link>
  </div>
)}

        {/* 최근 공지 */}
        <div className={styles["notice-recent"]}>
          <h4>최근 공지</h4>
          <table className={styles["notice-table"]}>
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성일자</th>
              </tr>
            </thead>
            <tbody>
              {recentNotices.map((notice, idx) => (
                <tr key={notice.noticeId}>
                  <td>{idx + 1}.</td>
                  <td>
                    <Link to={`/notice/${facilityId}/${notice.noticeId}`}>
                      {notice.noticeTitle}
                    </Link>
                  </td>
                  <td>{notice.noticeCreatedAt?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </>
  );
}

export default NoticeList;
