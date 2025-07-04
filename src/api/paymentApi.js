import axios from "axios";

const PAYMENT_API = "/api/payment";

export const createPayment = async (paymentData) => {
  const response = await axios.post(`${PAYMENT_API}`, paymentData);
  return response.data;
};

export const mapReservationsToPayment = async (mappingList) => {
  const response = await axios.post(`${PAYMENT_API}/map`, mappingList);
  return response.data;
};

export const getPaymentById = async (pymId) => {
  const response = await axios.get(`${PAYMENT_API}/${pymId}`);
  return response.data;
};

export const getPaymentsByMemberId = async (memberId) => {
  const response = await axios.get(
    `${PAYMENT_API}/payments/member/${memberId}`
  );
  return response.data;
};

export const getProdNmList = async (memberId) => {
  const response = await axios.get(`${PAYMENT_API}/prod/${memberId}`);
  return response.data;
};

export const cancelPaymentByImpUid = async ({ impUid, refundReason }) => {
  const response = await axios.post(`${PAYMENT_API}/cancel`, {
    impUid,
    refundReason,
  });
  return response.data;
};

export const getRefundedPaymentsByMemberId = async (memberId) => {
  const response = await axios.get(`${PAYMENT_API}/refunds/${memberId}`);
  return response.data;
};

export const getMyCoupons = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`/api/coupon/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const applyCoupon = async (couponId) => {
  const token = localStorage.getItem("token");
  const response = await axios.post("/api/coupon/use", null, {
    params: { couponId },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
