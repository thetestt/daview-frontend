import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getReviewById,
  getCommentsByReview,
  addComment,
  deleteComment,
  getUserName,
} from "../api/reviewApi";
import styles from "../styles/components/ReviewDetail.module.css";

function ReviewDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromEdit = location.state?.fromEdit;
  const editedReview = location.state?.editedReview;
  const { revId } = useParams();
  const memberId = Number(localStorage.getItem("memberId"));
  const [review, setReview] = useState(editedReview || null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newReplyMap, setNewReplyMap] = useState({});
  const [author, setAuthor] = useState("");

  useEffect(() => {
    if (!revId || fromEdit) return;

    const fetchReview = async () => {
      try {
        const data = await getReviewById(revId);
        setReview(data);

        const name = await getUserName(data.memberId);
        setAuthor(name);
      } catch (error) {
        console.error("리뷰 조회 실패: ", error);
      }
    };
    const fetchComments = async () => {
      try {
        const data = await getCommentsByReview(revId);
        setComments(data);
      } catch (error) {
        console.error("댓글 불러오기 실패: ", error);
      }
    };
    fetchReview();
    fetchComments();
  }, [revId, fromEdit]);

  const handleUpdateClick = () => {
    if (!memberId) {
      alert("로그인 후 이용해주세요.");
      navigate(`/login`);
    } else {
      navigate(`/review/${revId}/update`);
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleReplyChange = (e, parentCommentId) => {
    setNewReplyMap({
      ...newReplyMap,
      [parentCommentId]: e.target.value,
    });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment) return;
    if (!memberId) {
      alert("로그인 후 댓글을 작성할 수 있습니다.");
      navigate("/login");
      return;
    }

    try {
      await addComment(revId, newComment, null, memberId);
      setNewComment("");
      setComments([
        ...comments,
        { commentText: newComment, parentCommentId: null, memberId },
      ]);
    } catch (error) {
      console.error("댓글 작성 실패: ", error);
    }
  };

  const handleReplySubmit = async (parentCommentId) => {
    const replyText = newReplyMap[parentCommentId];
    if (!memberId) {
      alert("로그인 후 댓글을 작성할 수 있습니다.");
      navigate("/login");
      return;
    }
    if (!replyText) return;

    try {
      await addComment(revId, replyText, parentCommentId, memberId);
      setNewReplyMap({ ...newReplyMap, [parentCommentId]: "" });
      setComments([
        ...comments,
        {
          commentText: replyText,
          parentCommentId,
          memberId,
          commentId: Date.now(),
        },
      ]);
    } catch (error) {
      console.error("대댓글 작성 실패: ", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(
        comments.filter((comment) => comment.commentId !== commentId)
      );
    } catch (error) {
      console.error("댓글 삭제 실패: ", error);
    }
  };

  if (!review) return <p>리뷰를 불러오는 중...</p>;

  return (
    <div className={styles["rev-detail-container"]}>
      <h2>후기 상세</h2>
      <div>
        <p>
          작성자: {author}({review?.memberId})
        </p>
        <p>상품명: {review?.prodNm}</p>
        <p>제목: {review?.revTtl}</p>
        <p>별점: {review?.revStars}</p>
        <p>
          작성일:{" "}
          {review ? new Date(review.revRegDate).toLocaleDateString() : "-"}
        </p>
        <p>조회수: {review?.revViews}</p>
        <hr />
        <p>후기 내용: {review?.revCont}</p>
      </div>
      <div>
        <textarea
          value={newComment}
          onChange={handleCommentChange}
          placeholder="댓글을 작성하세요"
        />
        <button onClick={handleCommentSubmit}>댓글 작성</button>
      </div>
      <div>
        {comments.map((comment) => (
          <div key={comment.commentId} className={styles.comment}>
            <p>
              <strong>
                {author}({comment.memberId})
              </strong>
              : {comment.commentText}
            </p>
            <button onClick={() => handleDeleteComment(comment.commentId)}>
              삭제
            </button>
            {comment.parentCommentId === null && (
              <div>
                <textarea
                  value={newReplyMap[comment.commentId] || ""}
                  onChange={(e) => handleReplyChange(e, comment.commentId)}
                  placeholder="대댓글을 작성하세요."
                />
                <button onClick={() => handleReplySubmit(comment.commentId)}>
                  대댓글 작성
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        <button onClick={() => navigate("/review-board")}>목록으로</button>
        <button type="submit" onClick={handleUpdateClick}>
          후기 수정
        </button>
      </div>
    </div>
  );
}

export default ReviewDetail;
