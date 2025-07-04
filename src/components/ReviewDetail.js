import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getReviewById,
  getCommentsByReview,
  addComment,
  deleteComment,
} from "../api/reviewApi";
import styles from "../styles/components/ReviewDetail.module.css";

function getInitial(name) {
  if (!name) return "U";
  return name[0].toUpperCase();
}

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
  const [showComments, setShowComments] = useState(true);
  const [openReplies, setOpenReplies] = useState({});

  useEffect(() => {
    if (!revId || fromEdit) return;

    const fetchReview = async () => {
      try {
        const data = await getReviewById(revId);
        setReview(data);
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
        {
          commentText: newComment,
          parentCommentId: null,
          memberId,
          commentId: Date.now(),
        },
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

  const topLevelComments = comments.filter((c) => c.parentCommentId === null);
  const replies = comments.filter((c) => c.parentCommentId !== null);

  return (
    <div className={styles["review-detail-container"]}>
      <div className={styles["review-detail-card"]}>
        <div className={styles["review-detail-header"]}>
          <div className={styles["review-detail-avatar"]}>
            {getInitial(review.memberName)}
          </div>
          <div className={styles["review-detail-meta"]}>
            <div className={styles["review-detail-author"]}>
              {review.memberName}
            </div>
            <div className={styles["review-detail-date"]}>
              {review ? new Date(review.revRegDate).toLocaleDateString() : "-"}
            </div>
          </div>
          <div className={styles["review-detail-stars"]}>
            {"★".repeat(review.revStars)}
            {"☆".repeat(5 - review.revStars)}
          </div>
        </div>
        <div className={styles["review-detail-prod"]}>{review?.prodNm}</div>
        <div className={styles["review-detail-title"]}>{review?.revTtl}</div>
        <div className={styles["review-detail-content"]}>{review?.revCont}</div>
        <div className={styles["review-detail-footer"]}>
          <span
            style={{ color: "#888", fontSize: "14px" }}
            className={styles["review-detail-views"]}
          >
            조회수 {review?.revViews}
          </span>
          <button
            className={styles["review-detail-btn"]}
            onClick={() => navigate("/review-board")}
          >
            목록으로
          </button>
          <button
            className={styles["review-detail-btn-update"]}
            type="button"
            onClick={handleUpdateClick}
          >
            후기 수정
          </button>
        </div>
      </div>
      <div className={styles["review-detail-comment-section"]}>
        <form
          className={styles["review-detail-comment-form"]}
          onSubmit={handleCommentSubmit}
        >
          <textarea
            className={styles["review-detail-comment-textarea"]}
            value={newComment}
            onChange={handleCommentChange}
            placeholder="댓글을 작성하세요"
          />
          <button className={styles["review-detail-comment-btn"]} type="submit">
            댓글 작성
          </button>
        </form>
        <div className={styles["review-detail-comment-list"]}>
          {topLevelComments.length > 0 && (
            <button
              className={
                styles["review-detail-btn"] +
                " " +
                styles["review-detail-toggle-btn"]
              }
              onClick={() => setShowComments((prev) => !prev)}
              style={{ marginBottom: "12px" }}
              type="button"
            >
              {showComments
                ? "댓글 숨기기"
                : `댓글 ${topLevelComments.length}개 보기`}
            </button>
          )}
          {showComments &&
            topLevelComments.map((comment) => {
              const replyCount = replies.filter(
                (r) => r.parentCommentId === comment.commentId
              ).length;
              return (
                <div
                  key={comment.commentId}
                  className={styles["review-detail-comment"]}
                >
                  <div className={styles["review-detail-comment-avatar"]}>
                    {getInitial(comment.memberName)}
                  </div>
                  <div className={styles["review-detail-comment-bubble"]}>
                    <div className={styles["review-detail-comment-meta"]}>
                      {comment.memberName}({comment.memberId})
                    </div>
                    <div className={styles["review-detail-comment-text"]}>
                      {comment.commentText}
                    </div>
                    <div className={styles["review-detail-comment-actions"]}>
                      <button
                        className={styles["review-detail-reply-btn-delete"]}
                        onClick={() => handleDeleteComment(comment.commentId)}
                      >
                        삭제
                      </button>
                    </div>
                    <div className={styles["review-detail-reply-box"]}>
                      <textarea
                        className={styles["review-detail-reply-textarea"]}
                        value={newReplyMap[comment.commentId] || ""}
                        onChange={(e) =>
                          handleReplyChange(e, comment.commentId)
                        }
                        placeholder="대댓글을 작성하세요."
                      />
                      <div className={styles["review-detail-reply-actions"]}>
                        <button
                          className={styles["review-detail-reply-btn"]}
                          onClick={() => handleReplySubmit(comment.commentId)}
                          type="button"
                        >
                          대댓글 작성
                        </button>
                      </div>
                    </div>
                    {replyCount > 0 && (
                      <button
                        className={
                          styles["review-detail-reply-btn"] +
                          " " +
                          styles["review-detail-reply-toggle-btn"]
                        }
                        onClick={() =>
                          setOpenReplies((prev) => ({
                            ...prev,
                            [comment.commentId]: !prev[comment.commentId],
                          }))
                        }
                        type="button"
                        style={{ margin: "8px 0" }}
                      >
                        {openReplies[comment.commentId]
                          ? "대댓글 숨기기"
                          : `대댓글 ${replyCount}개 보기`}
                      </button>
                    )}
                    {openReplies[comment.commentId] &&
                      replies
                        .filter((r) => r.parentCommentId === comment.commentId)
                        .map((reply) => (
                          <div
                            key={reply.commentId}
                            className={styles["review-detail-reply-bubble"]}
                          >
                            <div
                              className={styles["review-detail-comment-meta"]}
                            >
                              {reply.memberName}({reply.memberId})
                            </div>
                            <div
                              className={styles["review-detail-comment-text"]}
                            >
                              {reply.commentText}
                            </div>
                            <div
                              className={styles["review-detail-reply-actions"]}
                            >
                              <button
                                className={
                                  styles["review-detail-reply-btn-delete"]
                                }
                                onClick={() =>
                                  handleDeleteComment(reply.commentId)
                                }
                                type="button"
                              >
                                삭제
                              </button>
                            </div>
                          </div>
                        ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default ReviewDetail;
