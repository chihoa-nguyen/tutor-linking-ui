import { React } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ClassCard.scss";
import { Link } from "react-router-dom";
import {
  faArrowRightLong,
  faBook,
  faClock,
  faLocationDot,
  faMarsAndVenus,
  faMoneyBill,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
const ClassCard = ({ item }) => {
  return (
    <div className="card">
      <div className="card-header">
        <p>Mã lớp: {item.id}</p>
      </div>
      <div className="card-body">
        <div className="info">
          <FontAwesomeIcon icon={faBook} className="icon" />
          <p>
            {item.subjects} - {item.grade}
          </p>
        </div>
        {/* <div className="info">
            <FontAwesomeIcon icon={faGraduationCap} className="icon" />
            <p>Lớp 10</p>
          </div> */}
        <div className="info">
          <FontAwesomeIcon icon={faLocationDot} className="icon" />
          <p>{item.address}</p>
        </div>
        <div className="info">
          <FontAwesomeIcon icon={faMoneyBill} className="icon" />
          <p>{item.fee} đồng/buổi</p>
        </div>
        <div className="info">
          <FontAwesomeIcon icon={faClock} className="icon" />
          <p>{item.time}</p>
        </div>
        <div className="info">
          <FontAwesomeIcon icon={faUser} className="icon" />
          <p>Yêu cầu: {item.positionRequired}</p>
        </div>
        <div className="info">
          <FontAwesomeIcon icon={faMarsAndVenus} className="icon" />
          <p>Giới tính: {item.genderRequired}</p>
        </div>
      </div>
      <div className="card-footer">
        <Link className="link" to={`/classes/${item?.id}`}>
          <p>Xem chi tiết </p>
          <FontAwesomeIcon icon={faArrowRightLong} className="icon" />
        </Link>
      </div>
    </div>
  );
};
export default ClassCard;
