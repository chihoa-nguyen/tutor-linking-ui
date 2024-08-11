import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import "./Class.scss";
import {
  faBook,
  faCalendar,
  faCircleInfo,
  faClock,
  faLocationDot,
  faMarsAndVenus,
  faMoneyBill,
  faPaperclip,
  faPenRuler,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import request from "../../utils/request";
import { toast } from "react-toastify";
import handleError from "../../utils/handleError";
const Class = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const { id } = useParams();
  const fetchData = async () => {
    try {
      const res = await request.get(`/class/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleEnroll = async () => {
    try {
      const res = await request.post(`/enrollment/${id}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      toast.success("Đã đăng ký nhận lớp");
      navigate("/classes");
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <div className="class-info">
      <div className="container-class">
        <div className="data">
          {data && (
            <div className="data-class">
              <p>THÔNG TIN CHI TIẾT LỚP:</p>
              <div className="info">
                <FontAwesomeIcon icon={faCircleInfo} />
                <span>Mã lớp: </span>
                <span className="bold">{data.id}</span>
              </div>
              <div className="info">
                <FontAwesomeIcon icon={faBook} className="icon" />
                <span>Môn học: </span>
                <span className="bold">{data.subjects}</span>
              </div>
              <div className="info">
                <FontAwesomeIcon icon={faPenRuler} />
                <span>Khối học: </span>
                <span className="bold">{data.grade}</span>
              </div>
              <div className="info">
                <FontAwesomeIcon icon={faLocationDot} className="icon" />
                <span>Địa chỉ: </span>
                <span className="bold">{data.address}</span>
              </div>
              <div className="info">
                <FontAwesomeIcon icon={faClock} className="icon" />
                <span>Số buổi: </span>
                <span className="bold">{data.numberSession} buổi/tuần</span>
              </div>
              <div className="info">
                <FontAwesomeIcon icon={faCalendar} className="icon" />
                <span>Lịch học: </span>
                <span className="bold">{data.time}</span>
              </div>
              <div className="info">
                <FontAwesomeIcon icon={faMoneyBill} className="icon" />
                <span>Học phí: </span>
                <span className="bold">{data.fee} đồng/buổi</span>
              </div>
              <div className="info">
                <FontAwesomeIcon icon={faUser} className="icon" />
                <span>Yêu cầu gia sư: </span>
                <span className="bold">{data.positionRequired}</span>
              </div>
              <div className="info">
                <FontAwesomeIcon icon={faMarsAndVenus} className="icon" />
                <span>Yêu cầu giới tính: </span>
                <span className="bold">{data.genderRequired}</span>
              </div>
              <div className="info">
                <FontAwesomeIcon icon={faPaperclip} />
                <span>Thông tin khác: </span>
                <span className="bold">{data.note}</span>
              </div>
              <button onClick={handleEnroll}>Đăng ký nhận lớp</button>
            </div>
          )}
        </div>
        <img src="/img/map.png" alt="" />
      </div>
    </div>
  );
};

export default Class;
