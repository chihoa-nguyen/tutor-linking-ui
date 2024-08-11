import React, { useEffect, useState } from "react";
import "./TutorClasses.scss";
import request from "../../utils/request";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faCalendar,
  faCircleInfo,
  faClock,
  faEnvelope,
  faLocationDot,
  faMarsAndVenus,
  faMoneyBill,
  faPaperclip,
  faPenRuler,
  faPhone,
  faUser,
  faUserLarge,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
const TutorClasses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [classData, setClassData] = useState({});
  const fetchData = async () => {
    try {
      const res = await request.get("enrollment/tutor", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setEnrollments(res.data.data);
    } catch (error) {
      console.log("Lỗi khi gọi API: ", error);
    }
  };
  const fetchClassData = async (class_id, status) => {
    try {
      if (status === "Đã nhận lớp") {
        const res = await request.get(`class/detail/${class_id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setClassData(res.data);
      } else {
        const res = await request.get(`class/${class_id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setClassData(res.data);
      }
    } catch (error) {
      console.log("Lỗi API: ", error);
    }
  };
  const deleteEnrollment = async (id) => {
    try {
      const res = await request.delete(`enrollment/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      // location.reload();
      toast.success("Đã xoá đăng ký");
      await fetchData();
    } catch (error) {
      console.log("Lỗi khi gọi API: ", error);
    }
  };
  useEffect(() => {
    fetchData();
    console.log("data lớp", classData);
  }, []);
  return (
    <div className="tutor-classes">
      <div className="container-tutorclasses">
        <div className="classes-table">
          <h1>DANH SÁCH LỚP HIỆN TẠI</h1>
          <table>
            <tr className="header">
              <th className="center">MÃ LỚP</th>
              <th className="center">MÔN HỌC</th>
              <th className="center">THỜI GIAN</th>
              <th className="center">HỌC PHÍ/BUỔI</th>
              <th className="center">TRẠNG THÁI</th>
              <th className="center">THAO TÁC</th>
            </tr>
            {enrollments &&
              enrollments.map((item) => (
                <tr key={item.id}>
                  <th className="center">{item.classroom.id}</th>
                  <th className="field">
                    <span>{item.classroom.subjects}</span>
                    <span>{item.classroom.grade}</span>
                  </th>
                  <th>
                    {item.classroom.numberSession} buổi/tuần -
                    {item.classroom.time}
                  </th>
                  <th>{item.classroom.fee} đồng</th>
                  <th>{item.status}</th>
                  <th>
                    <button
                      onClick={() =>
                        fetchClassData(item.classroom.id, item.status)
                      }
                    >
                      Xem
                    </button>
                    {item.status === "Chờ duyệt" && (
                      <button
                        className="delete"
                        onClick={() => deleteEnrollment(item.id)}
                      >
                        Xoá
                      </button>
                    )}
                  </th>
                </tr>
              ))}
          </table>
        </div>
        {classData && (
          <div className="information">
            <div className="class-info">
              <h2>THÔNG TIN LỚP HỌC</h2>
              <div className="info">
                <FontAwesomeIcon icon={faCircleInfo} />
                <span>Mã lớp: </span>
                <span className="bold">{classData.id}</span>
              </div>
              <div className="info">
                <FontAwesomeIcon icon={faBook} className="icon" />
                <span>Môn học: </span>
                <span className="bold">{classData.subjects}</span>
              </div>
              <div className="info">
                <FontAwesomeIcon icon={faPenRuler} />
                <span>Khối học: </span>
                <span className="bold">{classData.grade}</span>
              </div>
              <div className="info">
                <FontAwesomeIcon icon={faLocationDot} className="icon" />
                <span>Địa chỉ: </span>
                <span className="bold">{classData.address}</span>
              </div>
              <div className="info">
                <FontAwesomeIcon icon={faClock} className="icon" />
                <span>Số buổi: </span>
                <span className="bold">
                  {classData.numberSession} buổi/tuần
                </span>
              </div>
              <div className="info">
                <FontAwesomeIcon icon={faCalendar} className="icon" />
                <span>Lịch học: </span>
                <span className="bold">{classData.time}</span>
              </div>
              <div className="info">
                <FontAwesomeIcon icon={faMoneyBill} className="icon" />
                <span>Học phí: </span>
                <span className="bold">{classData.fee} đồng/buổi</span>
              </div>
              <div className="info">
                <FontAwesomeIcon icon={faUser} className="icon" />
                <span>Yêu cầu gia sư: </span>
                <span className="bold">{classData.positionRequired}</span>
              </div>
              <div className="info">
                <FontAwesomeIcon icon={faMarsAndVenus} className="icon" />
                <span>Yêu cầu giới tính: </span>
                <span className="bold">{classData.genderRequired}</span>
              </div>
              <div className="info">
                <FontAwesomeIcon icon={faPaperclip} />
                <span>Thông tin khác: </span>
                <span className="bold">{classData.note}</span>
              </div>
            </div>
            {classData.parent && (
              <div className="parent-info">
                <h2>THÔNG TIN PHỤ HUYNH</h2>
                <div className="info">
                  <FontAwesomeIcon icon={faUserLarge} />
                  <span>Họ tên:</span>
                  <span className="bold">{classData.parent.name}</span>
                </div>
                <div className="info">
                  <FontAwesomeIcon icon={faPhone} />
                  <span>SĐT:</span>
                  <span className="bold">{classData.parent.phoneNumber}</span>
                </div>
                <div className="info">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span>Email:</span>
                  <span className="bold">{classData.parent.email}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorClasses;
