import React, { useEffect, useState } from "react";
import "./Tutor.scss";
import { useParams } from "react-router-dom";
import request from "../../utils/request";
const Tutor = () => {
  const [open, setOpen] = useState(false);
  const [tutor, setTutor] = useState({});
  const [classes, setClasses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const { id } = useParams();
  const fetchData = async (tutor_id) => {
    try {
      const info = await request.get(`/tutor/${tutor_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const reviews = await request.get(`review/tutor/${tutor_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const classes = await request.get(`enrollment/tutor/${tutor_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setTutor(info.data.data);
      console.log(reviews.data);
      setReviews(reviews.data.data);
      console.log(classes.data);
      setClasses(classes.data.data);
    } catch (error) {
      console.log("Lỗi khi gọi API:", error);
    }
  };
  useEffect(() => {
    fetchData(id);
  }, []);
  return (
    <div className="tutor">
      <div className="container_tutor">
        <div className="profile">
          <h1>THÔNG TIN GIA SƯ</h1>
          {tutor && (
            <div className="card-tutor">
              <img src={tutor.avt} alt="" />
              <div className="info-reviews">
                <div className="info">
                  <div className="data">
                    <span className="field_name">Mã gia sư:</span>
                    <span>{tutor.id}</span>
                  </div>
                  <div className="data">
                    <span className="field_name">Họ tên:</span>
                    <span>{tutor.name}</span>
                  </div>
                  <div className="data">
                    <span className="field_name">Ngày sinh:</span>
                    <span>{tutor.birthday}</span>
                  </div>
                  <div className="data">
                    <span className="field_name">Giới tính:</span>
                    <span>{tutor.gender}</span>
                  </div>
                  <div className="data">
                    <span className="field_name">Hiện là:</span>
                    <span>{tutor.position}</span>
                  </div>
                  <div className="data">
                    <span className="field_name">Trường:</span>
                    <span>{tutor.universityName}</span>
                  </div>
                  <div className="data">
                    <span className="field_name">Chuyên ngành:</span>
                    <span>{tutor.major}</span>
                  </div>
                  <div className="data">
                    <span className="field_name">Điểm đánh giá:</span>
                    {tutor.avgRating !== undefined
                      ? tutor.avgRating.toFixed(1)
                      : "N/A"}
                    <img src="/img/star.png" alt="" />
                  </div>
                  <div className="data">
                    <span className="field_name">Môn dạy:</span>
                    <span>{tutor.subjects}</span>
                  </div>
                  <div className="data">
                    <span className="field_name">Khối dạy:</span>
                    <span>{tutor.grades}</span>
                  </div>
                  <div className="data">
                    <span className="field_name">Tỉnh thành:</span>
                    <span>{tutor.province}</span>
                  </div>
                  <div className="data">
                    <span className="field_name">Khu vực dạy:</span>
                    <span>{tutor.teachingArea}</span>
                  </div>
                  <div className="data">
                    <span className="field_name">Ưu điểm:</span>
                    <span>{tutor.description}</span>
                  </div>
                </div>
                <div className="reviews">
                  <span className="count" onClick={() => setOpen(!open)}>
                    Nhận xét ({reviews.length > 0 ? reviews.length : 0})
                  </span>
                  {open &&
                    reviews &&
                    reviews.map((item) => (
                      <div className="items" key={item.id}>
                        <div className="review-item">
                          <div className="creater">
                            <span>{item.parentName}</span>
                            {/* <span className="time">{item.createdAt}</span> */}
                            <span className="time">
                              {new Date(item.createdAt)
                                .getDate()
                                .toString()
                                .padStart(2, "0")}
                              /
                              {(new Date(item.createdAt).getMonth() + 1)
                                .toString()
                                .padStart(2, "0")}
                              /{new Date(item.createdAt).getFullYear()}
                            </span>
                          </div>
                          <div className="stars">
                            {[...Array(Math.floor(item.rating))].map(
                              (_, index) => (
                                <img
                                  key={index}
                                  src="/img/star.png"
                                  alt="Star"
                                />
                              )
                            )}
                            <span>{item.rating}</span>
                          </div>
                           <p>{item.comment}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="teaching">
          <h1>DANH SÁCH LỚP DẠY</h1>
          <table>
            <tr className="header">
              <th className="center">MÃ LỚP</th>
              <th className="center">MÔN HỌC</th>
              <th className="center">KHỐI HỌC</th>
              <th className="center">ĐỊA ĐIỂM</th>
              <th className="center">BẮT ĐẦU</th>
            </tr>
            {classes &&
              classes.map((item) => (
                <tr className="" key={item.id}>
                  <th className="center">{item.id}</th>
                  <th>{item.classroom.subjects}</th>
                  <th className="center">{item.classroom.grade}</th>
                  <th>
                    {item.classroom.address.split(",").slice(2).join(", ")}
                  </th>
                  <th>
                    {String(new Date(item.createdAt).getMonth() + 1).padStart(
                      2,
                      "0"
                    )}
                    -{new Date(item.createdAt).getFullYear()}
                  </th>
                </tr>
              ))}
          </table>
        </div>
      </div>
    </div>
  );
};
export default Tutor;
