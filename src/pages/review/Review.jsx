import React, { useState } from "react";
import "./Review.scss";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Review.scss";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import request from "../../utils/request";
import handleError from "../../utils/handleError";
import { toast } from "react-toastify";
const Review = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState({
    rating: 0,
    comment: "",
  });
  const handleRatingChange = (newRating) => {
    setReview((prevReview) => ({
      ...prevReview,
      rating: newRating,
    }));
  };

  const handleCommentChange = (e) => {
    setReview((prevReview) => ({
      ...prevReview,
      comment: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const res = request.post(`review/${id}`, review, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      navigate("/parent/classes");
      toast.success("Đã thêm nhận xét gia sư");
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <div className="review">
      <div className="review-container">
        <h2>NHẬN XÉT GIA SƯ</h2>
        <form onSubmit={handleSubmit}>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesomeIcon
                key={star}
                icon={faStar}
                className={`icon ${star <= review.rating ? "active" : ""}`}
                onClick={() => handleRatingChange(star)}
              />
            ))}
          </div>
          <textarea
            value={review.comment}
            onChange={handleCommentChange}
            placeholder="Viết đánh giá của bạn..."
          ></textarea>
          <button type="submit">Đánh giá</button>
        </form>
      </div>
    </div>
  );
};
export default Review;
