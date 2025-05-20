import React from "react";
import { useParams, Link } from "react-router-dom";
import notices from "../data/notices";
import "../styles/pages/NoticeList.css";
import FloatingNavButtons from "../components/FloatingNavButtons";

function NoticeList() {
  const { facilityId } = useParams();

  const filtered = notices.filter((n) => n.facility_id === facilityId);

  const facilityType = filtered[0]?.facility_type || "실버타운"; // 기본값
  const facilityName = filtered[0]?.facility_name || "시설";

  const backToPath =
    facilityType === "요양원"
      ? `/nursinghome/${facilityId}`
      : `/silvertown/${facilityId}`;

  return (
    <>
      <FloatingNavButtons backTo={backToPath} />
      <div className="notice-list-container">
        <h2> {facilityName} 공지게시판</h2>

        <div className="notice-fixed">
          <h4>고정 공지</h4>
          {filtered
            .filter((n) => n.notice_is_fixed)
            .map((n) => (
              <div key={n.notice_id} className="notice-item fixed">
                <Link to={`/notice/${facilityId}/${n.notice_id}`}>
                  {n.notice_title}
                </Link>
              </div>
            ))}
        </div>

        <div className="notice-recent">
          <h4>최근 공지</h4>
          {filtered
            .filter((n) => !n.notice_is_fixed)
            .map((n) => (
              <div key={n.notice_id} className="notice-item">
                <Link to={`/notice/${facilityId}/${n.notice_id}`}>
                  {n.notice_title}
                </Link>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default NoticeList;
