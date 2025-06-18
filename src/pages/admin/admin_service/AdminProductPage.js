import React, { useState, useEffect } from 'react';
import {
  getProductsByType,
  addProduct,
  updateProduct,
  deleteProduct
} from '../../../api/productApi';
import '../../../styles/admin/AdminProductPage.css';

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [type, setType] = useState('facility');
  const [newProduct, setNewProduct] = useState({
    name: '',
    type: '',
    price: 0,
    description: ''
  });

  useEffect(() => {
    fetchProducts(type);
  }, [type]);

  const fetchProducts = async (type) => {
    try {
      const response = await getProductsByType(type);
      setProducts(response.data);
    } catch (err) {
      console.error('상품 목록 불러오기 실패:', err);
    }
  };

  const handleAdd = async () => {
    try {
      await addProduct(newProduct);
      fetchProducts(type);
      setNewProduct({ name: '', type: '', price: 0, description: '' }); // 입력값 초기화
    } catch (err) {
      console.error('상품 등록 실패:', err);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await updateProduct(id, newProduct);
      fetchProducts(type);
    } catch (err) {
      console.error('상품 수정 실패:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      fetchProducts(type);
    } catch (err) {
      console.error('상품 삭제 실패:', err);
    }
  };

  return (
    <div className="product-admin-container">
      <h2>상품 관리</h2>

      <div className="product-form">
        <label>상품 유형</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="facility">요양원</option>
          <option value="caregiver">요양사</option>
          <option value="silvertown">실버타운</option>
        </select>

        <label>상품 이름</label>
        <input
          type="text"
          placeholder="예: 프리미엄 요양 서비스"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />

        <label>상품 타입</label>
        <input
          type="text"
          placeholder="예: facility"
          value={newProduct.type}
          onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
        />

        <label>가격 (₩)</label>
        <input
          type="number"
          placeholder="예: 100000"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
        />

        <label>상품 설명</label>
        <textarea
          placeholder="간단한 소개나 조건 등을 작성"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />

        <button className="submit-btn" onClick={handleAdd}>상품 등록</button>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>타입</th>
            <th>가격</th>
            <th>설명</th>
            <th>수정</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.type}</td>
              <td>{p.price}</td>
              <td>{p.description}</td>
              <td>
                <button onClick={() => handleUpdate(p.id)}>수정</button>
              </td>
              <td>
                <button onClick={() => handleDelete(p.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductPage;
