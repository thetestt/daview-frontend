import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchSearchResults } from "../api/SearchResults";
import styles from "../styles/components/MainList.module.css";
import backgroundShape from "../assets/mwhite.png";
import maleImg from "../assets/male.png";
import femaleImg from "../assets/female.png";
import userImg from "../assets/user.png";

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("query");

  const [results, setResults] = useState({
    nursinghomes: [],
    silvertowns: [],
    caregivers: [],
  });

  useEffect(() => {
    if (query) {
      fetchSearchResults(query)
        .then((res) => {
          console.log("🔍 검색 결과 데이터:", res);
          setResults(res);
        })
        .catch((err) => console.error("❌ 검색 오류:", err));
    }
  }, [query]);

  return (
    <div className={styles["p-4"]}>
      <h2 className={styles["text-xl font-bold mb-4"]}>
        🔍 '{query}' 검색 결과
      </h2>

      {/* 요양원 수정*/}
      {results.nursinghomes.length > 0 && (
        <section className={styles["mb-8"]}>
          <h3 className={styles["text-lg font-semibold mb-2"]}>🏥 요양원</h3>
          <div className={styles["facility-list"]}>
            {results.nursinghomes.map((item) => (
              <div
                key={item.facilityId}
                className={styles["facility-card-wrapper"]}
              >
                <div
                  className={styles["facility-card-link"]}
                  onClick={() => navigate(`/nursinghome/${item.facilityId}`)}
                >
                  <div className={styles["facility-card"]}>
                    <img
                      src={
                        item.photoUrl
                          ? `http://localhost:8080${item.photoUrl}`
                          : "/images/default.png"
                      }
                      alt={item.facilityName}
                      className={styles["card-thumbnail"]}
                    />
                    <h3>{item.facilityName}</h3>
                    <p>
                      {item.facilityAddressLocation} {item.facilityAddressCity}
                    </p>
                    <p>
                      {item.facilityCharge
                        ? `${item.facilityCharge.toLocaleString()}원/월`
                        : "가격 정보 없음"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 실버타운 */}
      {results.silvertowns.length > 0 && (
        <section className={styles["mb-8"]}>
          <h3 className={styles["text-lg font-semibold mb-2"]}>🏡 실버타운</h3>
          <div className={styles["facility-list"]}>
            {results.silvertowns.map((item) => (
              <div
                key={item.facilityId}
                className={styles["facility-card-wrapper"]}
              >
                <div
                  className={styles["facility-card-link"]}
                  onClick={() => navigate(`/silvertown/${item.facilityId}`)}
                >
                  <div className={styles["facility-card"]}>
                    <img
                      src={
                        item.photoUrl
                          ? `http://localhost:8080${item.photoUrl}`
                          : "/images/default.png"
                      }
                      alt={item.facilityName}
                      className={styles["card-thumbnail"]}
                    />
                    <h3>{item.facilityName}</h3>
                    <p>
                      {item.facilityAddressLocation} {item.facilityAddressCity}
                    </p>
                    <p>
                      {item.facilityCharge
                        ? `${item.facilityCharge.toLocaleString()}원/월`
                        : "가격 정보 없음"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 요양사 */}
      {results.caregivers.length > 0 && (
        <section className={styles["mb-8"]}>
          <h3 className={styles["text-lg font-semibold mb-2"]}>👩‍⚕️ 요양사</h3>
          <div className={styles["whole-list"]}>
            <div className={styles["facility-list"]}>
              <img
                src={backgroundShape}
                alt="quote"
                className={styles["list-quote-background"]}
              />
              <div className={styles["whole-card"]}>
                {results.caregivers.map((item) => (
                  <div
                    key={item.caregiverId}
                    className={styles["facility-card-wrapper"]}
                  >
                    <Link
                      to={`/caregiver/${item.caregiverId}`}
                      className={styles["facility-card-link"]}
                    >
                      <div className={styles["facility-card"]}>
                        {/* 성별 이미지 */}
                        <img
                          src={
                            item.userGender === "male"
                              ? maleImg
                              : item.userGender === "female"
                              ? femaleImg
                              : userImg
                          }
                          alt="프로필 이미지"
                          className={styles["card-thumbnail"]}
                        />
                        {/* 이름 마스킹 */}
                        <h2 className={styles["caregiver-name-box"]}>
                          <span className={styles["caregiver-name"]}>
                            {item.name
                              ? item.name.length === 2
                                ? item.name[0] + "*"
                                : item.name[0] + "*" + item.name.slice(-1)
                              : "이름 미정"}
                          </span>
                        </h2>
                        <p>
                          {item.hopeWorkAreaLocation} {item.hopeWorkAreaCity}
                        </p>
                        <div className={styles["card-info-box"]}>
                          <p>희망근무형태: {item.hopeWorkType || "미입력"}</p>
                          <p>
                            자격증:{" "}
                            {item.certificates?.length > 0
                              ? item.certificates.join(", ")
                              : "없음"}
                          </p>
                          <p>경력: {item.career?.length || 0}건</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default SearchResults;
