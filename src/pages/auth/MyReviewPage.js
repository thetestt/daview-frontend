import React, { useEffect, useState } from "react";
import axiosInstance from "../../pages/auth/axiosInstance";
import styles from "../../styles/auth/MyReviewPage.module.css";

function MyReviewPage() {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axiosInstance.get("/review/my");
                setReviews(response.data);
            } catch (err) {
                console.error("후기 불러오기 실패:", err);
            }
        };

        fetchReviews();
    }, []);

    return (
        <div className={styles["my-reviews-container"]}>
            <h1>내가 쓴 후기</h1>
            {reviews.length === 0 ? (
                <p>작성한 후기가 없습니다.</p>
            ) : (
                reviews.map((review) => (
                    <div key={review.revId} className={styles["review-box"]}>
                      <h3 className={styles["myreview-title"]}>{review.revTtl}</h3>
                      <p className={styles["myreview-content"]}>{review.revCont}</p>
                      <p className={styles["myreview-date"]}>{review.revRegDate}</p>
                    </div>
                  ))
                  
            )}
        </div>
    );
}

export default MyReviewPage;
