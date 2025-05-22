import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import { getCaregiverById } from "../api/caregiverApi";
import { fetchNursinghomeDetail } from "../api/nursinghome";
import { fetchSilvertownDetail } from "../api/silvertown";
import "../styles/pages/SearchResults.css";

function SearchResults() {
  const { searchQuery, searchTriggered, setSearchTriggered } = useSearch();
  const [caregivers, setCaregivers] = useState([]);
  const [nursingHomes, setNursingHomes] = useState([]);
  const [silvertowns, setSilvertowns] = useState([]);

  useEffect(() => {
    if (searchTriggered && searchQuery.trim() !== "") {
      Promise.all([
        getCaregiverById(),
        fetchNursinghomeDetail(),
        fetchSilvertownDetail(),
      ]).then(([cgRes, nhRes, stRes]) => {
        const keyword = searchQuery.toLowerCase();

        const filteredCG = cgRes.data.filter(
          (item) =>
            (item.username || "").toLowerCase().includes(keyword) ||
            (item.hopeWorkAreaCity || "").toLowerCase().includes(keyword) ||
            (item.hopeWorkAreaLocation || "").toLowerCase().includes(keyword)
        );

        const filteredNH = nhRes.data.filter(
          (item) =>
            (item.facilityName || "").toLowerCase().includes(keyword) ||
            (item.facilityAddressCity || "").toLowerCase().includes(keyword)
        );

        const filteredST = stRes.data.filter(
          (item) =>
            (item.facilityName || "").toLowerCase().includes(keyword) ||
            (item.facilityAddressCity || "").toLowerCase().includes(keyword)
        );

        setCaregivers(filteredCG);
        setNursingHomes(filteredNH);
        setSilvertowns(filteredST);
        setSearchTriggered(false);
      });
    }
  }, [searchTriggered, searchQuery, setSearchTriggered]);

  return (
    <div className="search-results-page">
      <h2>🔍 "{searchQuery}" 검색 결과</h2>

      <section>
        <h3>👩‍⚕️ 요양사</h3>
        {caregivers.length === 0 ? (
          <p>해당 요양사가 없습니다.</p>
        ) : (
          <ul>
            {caregivers.map((item) => (
              <li key={item.caregiverId}>
                <Link to={`/caregiver/${item.caregiverId}`}>
                  {item.username}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>🏥 요양원</h3>
        {nursingHomes.length === 0 ? (
          <p>해당 요양원이 없습니다.</p>
        ) : (
          <ul>
            {nursingHomes.map((item) => (
              <li key={item.facilityId}>
                <Link to={`/nursinghome/${item.facilityId}`}>
                  {item.facilityName}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>🏠 실버타운</h3>
        {silvertowns.length === 0 ? (
          <p>해당 실버타운이 없습니다.</p>
        ) : (
          <ul>
            {silvertowns.map((item) => (
              <li key={item.facilityId}>
                <Link to={`/silvertown/${item.facilityId}`}>
                  {item.facilityName}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default SearchResults;
