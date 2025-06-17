// 📁 src/pages/admin/AdminProductList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  // 상품 목록 조회 요청
  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/admin/products', {
        params: {
          page,
          size,
          search: search.trim()
        }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('상품 목록 조회 실패:', error);
    }
  };

  // 초기 및 조건 변경 시 자동 호출
  useEffect(() => {
    fetchProducts();
  }, [page, size, search]);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📦 상품 목록</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="상품명 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={fetchProducts}>🔍 검색</button>
      </div>

      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>상품 ID</th>
            <th>상품명</th>
            <th>유형</th>
            <th>가격</th>
            <th>상세 설명</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.prodId}>
              <td>{p.prodId}</td>
              <td>{p.prodName}</td>
              <td>{p.prodTypeName}</td>
              <td>{p.prodPrice.toLocaleString()}원</td>
              <td>{p.prodDetail}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 0))}>◀ 이전</button>
        <span style={{ margin: '0 1rem' }}>페이지: {page + 1}</span>
        <button onClick={() => setPage((prev) => prev + 1)}>다음 ▶</button>
      </div>
    </div>
  );
};

export default AdminProductList;
