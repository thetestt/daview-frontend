import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchSearchResults } from "../api/SearchResults";
import "../styles/components/MainList.css"; // ✅ 스타일 적용

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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🔍 '{query}' 검색 결과</h2>

      {/* 요양원 */}
      {results.nursinghomes.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-2">🏥 요양원</h3>
          <div className="facility-list">
            {results.nursinghomes.map((item) => (
              <div key={item.facilityId} className="facility-card-wrapper">
                <div
                  className="facility-card-link"
                  onClick={() => navigate(`/nursinghome/${item.facilityId}`)}
                >
                  <div className="facility-card">
                    <img
                      src={
                        item.photoUrl
                          ? `http://localhost:8080${item.photoUrl}`
                          : "/images/default.png"
                      }
                      alt={item.facilityName}
                      className="card-thumbnail"
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
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-2">🏡 실버타운</h3>
          <div className="facility-list">
            {results.silvertowns.map((item) => (
              <div key={item.facilityId} className="facility-card-wrapper">
                <div
                  className="facility-card-link"
                  onClick={() => navigate(`/silvertown/${item.facilityId}`)}
                >
                  <div className="facility-card">
                    <img
                      src={
                        item.photoUrl
                          ? `http://localhost:8080${item.photoUrl}`
                          : "/images/default.png"
                      }
                      alt={item.facilityName}
                      className="card-thumbnail"
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
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-2">👩‍⚕️ 요양사</h3>
          <div className="facility-list">
            {results.caregivers.map((item) => (
              <Link
                key={item.caregiverId}
                to={`/caregiver/${item.caregiverId}`}
                className="facility-card"
              >
                {/* 이름 + 성별 */}
                <h2 className="caregiver-name-box">
                  <span className="caregiver-name">
                    {item.username || "이름 미정"}
                  </span>
                  <span className={`caregiver-gender ${item.userGender}`}>
                    {item.userGender === "male"
                      ? "남"
                      : item.userGender === "female"
                      ? "여"
                      : "미정"}
                  </span>
                </h2>

                {/* 지역 */}
                <p>
                  {item.hopeWorkAreaLocation} {item.hopeWorkAreaCity}
                </p>

                {/* 근무형태 */}
                <p>근무형태: {item.hopeWorkType || "미입력"}</p>

                {/* 자격증 */}
                <p>
                  자격증:{" "}
                  {item.certificates && item.certificates.length > 0
                    ? item.certificates.join(", ")
                    : "없음"}
                </p>

                {/* 경력 */}
                <p>경력: {item.career?.length || 0}건</p>

                {/* 급여 */}
                <p>
                  {item.hopeWorkAmount
                    ? `${item.hopeWorkAmount.toLocaleString()}원/월`
                    : "희망 급여 미입력"}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default SearchResults;
