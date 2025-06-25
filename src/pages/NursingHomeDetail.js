import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
// import nursingHomes from "../data/nursingHomes";
import { fetchNursinghomeDetail } from "../api/nursinghome";
//import "../styles/layouts/layout.css";
import styles from "../styles/pages/Detail.module.css";
import FloatingNavButtons from "../components/FloatingNavButtons";
import CartButton from "../components/CartButton";
import HeartButton from "../components/common/HeartButton";
import ChatButton from "../components/common/ChatButton";

function NursingHomeDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchNursinghomeDetail(id)
      .then(setData)
      .catch((err) => {
        console.error("디테일 API 오류:", err);
      });
  }, [id]);

  if (!data) return <div>Loading...</div>;

  return (
    <>
      <FloatingNavButtons />
      <div className={styles["layout-container"]}>
        <div className={styles["detail-container"]}>
          <div className={styles["detail-header"]}>
            <img
              src={data.photos[0] || "/images/default.png"}
              alt="메인"
              className={styles["main-photo"]}
            />
            <div className={styles["detail-info"]}>
              <h2>{data.facilityName}</h2>
              <p className={styles["price"]}>
                {data.facilityCharge.toLocaleString()}원/월
              </p>
              <p>
                주소:{" "}
                {`${data.facilityAddressLocation} ${data.facility_address_city} ${data.facility_detail_address}`}
              </p>
              <p>테마: {data.facilityTheme}</p>
              <p>
                홈페이지:{" "}
                <a href={data.facilityHomepage}>{data.facilityHomepage}</a>
              </p>
              <p>전화번호: {data.facilityPhone}</p>
              <div className={styles["detail-buttons"]}>
                <ChatButton facilityId={id} receiverId={data.memberId} />
                <HeartButton facilityId={id} />
                <CartButton data={data} productType="nursinghome" />
              </div>
            </div>
            <div className={styles["map-box"]}>[지도 API]</div>
          </div>

          <div className={styles["thumbnail-box"]}>
            {data.photos &&
            data.photos.length > 0 &&
            data.photos.some((url) => url) ? (
              data.photos
                .filter((url) => url)
                .map((url, idx) => (
                  <img key={idx} src={url} alt={`photo-${idx}`} />
                ))
            ) : (
              <img
                src="/images/default.png"
                alt="기본 이미지"
                className={styles["card-thumbnail"]}
              />
            )}
          </div>

          <div className={styles["tag-section"]}>
            <strong>태그: </strong>
            {data.tags.join(", ")}
          </div>

          <div className={styles["notice-section"]}>
            <h3>공지사항</h3>
            <ul>
              {data.notices.filter((n) => n.noticeIsFixed).length > 0 ? (
                data.notices
                  .filter((n) => n.noticeIsFixed)
                  .map((notice, i) => (
                    <li key={i} className={styles["fnotice-item"]}>
                      <Link
                        to={`/notice/${data.facilityId}/${notice.noticeId}`}
                        className={styles["fnotice-link"]}
                      >
                        <span className={styles["fnotice-title"]}>
                          [공지] {notice.noticeTitle}
                        </span>
                        <span className={styles["fnotice-date"]}>
                          {notice.noticeUpdatedAt?.slice(0, 10)}
                        </span>
                      </Link>
                    </li>
                  ))
              ) : data.notices.length > 0 ? (
                <li className={styles["fnotice-item"]}>
                  <Link
                    to={`/notice/${data.facilityId}/${data.notices[0].noticeId}`}
                    className={styles["fnotice-link"]}
                  >
                    <span className={styles["fnotice-title"]}>
                      {data.notices[0].noticeTitle}
                    </span>
                    <span className={styles["fnotice-date"]}>
                      {data.notices[0].noticeUpdatedAt?.slice(0, 10)}
                    </span>
                  </Link>
                </li>
              ) : (
                <li>등록된 공지사항이 없습니다.</li>
              )}
            </ul>
            <Link
              to={`/notice/${data.facilityId}`}
              className={styles["notice-full-link"]}
            >
              공지사항 전체 보기
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default NursingHomeDetail;
