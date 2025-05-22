import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchSearchResults } from "../api/SearchResults"; // ✅ 이 파일 이름도 확인 필요!

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
          console.log("🔍 검색 결과 데이터:", res); // ✅ 여기에 콘솔 추가!
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.nursinghomes.map((item) => (
              <div
                key={item.facilityId}
                className="border rounded-xl p-2 cursor-pointer hover:shadow"
                onClick={() => navigate(`/nursinghome/${item.facilityId}`)}
              >
                <img
                  src={item.photoUrl}
                  alt={item.facilityName}
                  className="w-full h-40 object-cover rounded"
                />
                <h4 className="mt-2 text-center">{item.facilityName}</h4>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 실버타운 */}
      {results.silvertowns.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-2">🏡 실버타운</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.silvertowns.map((item) => (
              <div
                key={item.facilityId}
                className="border rounded-xl p-2 cursor-pointer hover:shadow"
                onClick={() => navigate(`/silvertown/${item.facilityId}`)}
              >
                <img
                  src={item.photoUrl}
                  alt={item.facilityName}
                  className="w-full h-40 object-cover rounded"
                />
                <h4 className="mt-2 text-center">{item.facilityName}</h4>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 요양사 */}
      {results.caregivers.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-2">👩‍⚕️ 요양사</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.caregivers.map((item) => (
              <div
                key={item.caregiverId}
                className="border rounded-xl p-2 cursor-pointer hover:shadow"
                onClick={() => navigate(`/caregiver/${item.caregiverId}`)}
              >
                {/* 이미지가 없다면 기본 이미지 사용 */}
                <img
                  src={item.profileImg || "/images/default.png"}
                  alt={item.username}
                  className="w-full h-40 object-cover rounded"
                />
                <h4 className="mt-2 text-center">{item.username}</h4>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default SearchResults;
