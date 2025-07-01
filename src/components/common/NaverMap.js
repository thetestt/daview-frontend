import React, { useEffect, useRef, useState } from "react";

const NaverMap = ({ address, className }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const clientId = process.env.REACT_APP_NAVER_MAP_CLIENT_ID;
  const [isMapReady, setIsMapReady] = useState(false);

  // ✅ 지도 스크립트 로드 및 초기 지도 생성
  useEffect(() => {
    if (!clientId) return;

    const loadMapScript = () => {
      if (document.getElementById("naver-map-script")) return;
      const existing = document.getElementById("naver-map-script");
      if (existing) existing.remove();

      const script = document.createElement("script");
      script.id = "naver-map-script";
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&submodules=geocoder`;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    };

    if (!window.naver || !window.naver.maps) {
      loadMapScript();
    } else {
      initMap();
    }

    function initMap() {
      if (!mapRef.current || !window.naver || !window.naver.maps) return;

      mapInstance.current = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(37.5665, 126.978), // 기본 중심
        zoom: 16,
      });

      setIsMapReady(true); // ✅ 지도 준비 완료 표시
    }
  }, [clientId]);

  // ✅ address & 지도 준비 완료 후 geocode 실행
  useEffect(() => {
    if (!address || !isMapReady || !mapInstance.current) return;

    const interval = setInterval(() => {
      if (window.naver?.maps?.Service) {
        clearInterval(interval);

        console.log("✅ Service 준비 완료, geocode 실행");

        window.naver.maps.Service.geocode(
          { query: address },
          (status, response) => {
            if (status !== window.naver.maps.Service.Status.OK) {
              alert("주소 변환 실패");
              return;
            }

            const result = response.v2?.addresses?.[0];
            if (!result) {
              alert("주소 결과 없음");
              return;
            }

            const latlng = new window.naver.maps.LatLng(result.y, result.x);

            mapInstance.current.setCenter(latlng);

            if (markerRef.current) {
              markerRef.current.setMap(null);
            }

            markerRef.current = new window.naver.maps.Marker({
              position: latlng,
              map: mapInstance.current,
              title: address,
            });
          }
        );
      } else {
        console.log("⏳ Service 아직 로딩 중...");
      }
    }, 100);

    return () => clearInterval(interval);
  }, [address, isMapReady]);

  return (
    <div className={className}>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "100%", borderRadius: "6px" }}
      />
    </div>
  );
};

export default NaverMap;
