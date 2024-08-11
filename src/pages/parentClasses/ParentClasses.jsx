import React, { useState, useEffect } from "react";
import "./ParentClasses.scss";
import request from "../../utils/request";
import handleError from "../../utils/handleError";
import { genders, positions } from "../../utils/common_data.js";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
const ParentClasses = () => {
  const [classes, setClasses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [openSubject, setOpenSubject] = useState(false);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const navigate = useNavigate();
  const [classroom, setClassroom] = useState({
    subjects: [],
    numberSession: 1,
    time: "",
    gradeId: null,
    fee: 0,
    address: {
      streetNumber: "",
      ward: "",
      district: "",
      city: "",
    },
    positionRequired: 0,
    genderRequired: 0,
    note: "",
  });
  const fetchProvinces = async () => {
    try {
      const res = await axios.get("https://esgoo.net/api-tinhthanh/1/0.htm");
      setProvinces(res.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchData = async () => {
    try {
      const subjectsResponse = await request.get("/subject");
      const gradesResponse = await request.get("/grade");
      setSubjects(subjectsResponse.data);
      setGrades(gradesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchClasses = async () => {
    try {
      const res = await request.get("/class/parent", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setClasses(res.data);
    } catch (error) {
      handleError(error);
    }
  };
  const fetchEnrollments = async (id) => {
    try {
      const res = await request.get(`/enrollment/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setEnrollments(res.data.data);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };
  const handleApprove = async (id, classId) => {
    try {
      const res = await request.put(`/enrollment/${id}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (res.data.status == "success") {
        window.alert("Đã duyệt gia sư");
        await fetchEnrollments(classId);
        await sendMailTutor(id);
      } else console.log("Không gửi được mail");
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };
  useEffect(() => {
    fetchData();
    fetchProvinces();
    fetchClasses();
  }, []);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setClassroom((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSubjectChange = (event) => {
    const subjectId = parseInt(event.target.value);
    if (event.target.checked) {
      setSelectedSubjects([...selectedSubjects, subjectId]);
    } else {
      setSelectedSubjects(selectedSubjects.filter((id) => id !== subjectId));
    }
  };
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setClassroom((prevState) => ({
      ...prevState,
      address: {
        ...prevState.address,
        [name]: value,
      },
    }));
  };
  const handleProvinceChange = (event) => {
    const selectedProvinceCode = event.target.value;
    setSelectedProvinceCode(selectedProvinceCode);
    const selectedProvince = provinces.find(
      (province) => province.id === selectedProvinceCode
    );
    if (selectedProvince) {
      setClassroom((prevClass) => ({
        ...prevClass,
        address: {
          ...prevClass.address,
          city: selectedProvince.name,
        },
      }));
    }
    axios
      .get(`https://esgoo.net/api-tinhthanh/2/${selectedProvinceCode}.htm`)
      .then((response) => {
        setDistricts(response.data.data);
      })
      .catch((error) => console.error("Lỗi khi gọi API:", error));
  };
  const handleDistrictChange = (event) => {
    const selectedDistrictCode = event.target.value;
    setSelectedDistrictCode(selectedDistrictCode);
    const selectedDistrict = districts.find(
      (district) => district.id === selectedDistrictCode
    );
    if (selectedDistrict) {
      setClassroom((prevClass) => ({
        ...prevClass,
        address: {
          ...prevClass.address,
          district: selectedDistrict.full_name,
        },
      }));
    }
    axios
      .get(`https://esgoo.net/api-tinhthanh/3/${selectedDistrictCode}.htm`)
      .then((response) => {
        setWards(response.data.data);
      })
      .catch((error) => console.error("Lỗi khi gọi API:", error));
  };
  const handleWardChange = (event) => {
    const selectedWard = wards.find((ward) => ward.id === event.target.value);
    if (selectedWard) {
      setClassroom((prevClass) => ({
        ...prevClass,
        address: {
          ...prevClass.address,
          ward: selectedWard.full_name,
        },
      }));
    }
  };
  const sendMailForTutors = async (id) => {
    try {
      const res = request.post(`/class/send-mail/${id}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
    } catch (error) {
      handleError(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedClass = {
      ...classroom,
      subjects: selectedSubjects,
    };
    try {
      const res = await request.post("class", updatedClass, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      await sendMailForTutors(res.data.id);
      // navigate("/parent/classes");
      toast.success("Tạo lớp thành công");
      await fetchClasses();
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <div className="parent-classes">
      <div className="add-class">
        <p>THÔNG TIN LỚP HỌC</p>
        <form>
          <div className="input">
            <label htmlFor="subjects">Môn học:</label>
            <input
              type="text"
              id="subjects-input"
              placeholder={
                selectedSubjects.length == 0
                  ? "Chọn môn học"
                  : `Đã chọn ${selectedSubjects.length} môn`
              }
              readOnly
              onClick={() => setOpenSubject(!openSubject)}
            />
            {openSubject && (
              <div className="options">
                {subjects.map((subject) => (
                  <div key={subject.id} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`subject-${subject.id}`}
                      value={subject.id}
                      checked={selectedSubjects.includes(subject.id)}
                      onChange={handleSubjectChange}
                    />
                    <label className="choose" htmlFor={`subject-${subject.id}`}>
                      {subject.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="input">
            <label htmlFor="gradeId">Khối dạy: </label>
            <select
              name="gradeId"
              value={classroom.grade}
              onChange={handleInputChange}
            >
              {grades.map((grade) => (
                <option key={`grade-${grade.id}`} value={grade.id}>
                  {grade.name}
                </option>
              ))}
            </select>
          </div>
          <div className="input">
            <label htmlFor="genderRequired">Y/C giới tính: </label>
            <select
              name="genderRequired"
              value={classroom.genderRequired}
              onChange={handleInputChange}
            >
              {genders.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="input">
            <label htmlFor="positionRequired">Y/C chức vụ: </label>
            <select
              name="positionRequired"
              value={classroom.positionRequired}
              onChange={handleInputChange}
              required
            >
              {positions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="input">
            <label htmlFor="numberSession">Số buổi:</label>
            <select
              name="numberSession"
              value={classroom.numberSession}
              onChange={handleInputChange}
            >
              {[1, 2, 3, 4, 5, 6, 7].map((session) => (
                <option key={session} value={session}>
                  {session} buổi
                </option>
              ))}
            </select>
            <label>/tuần</label>
          </div>
          <div className="input">
            <label htmlFor="time">Lịch dạy:</label>
            <input
              className="long-text"
              name="time"
              type="text"
              placeholder="ví dụ: Thứ 3,5 lúc 19h"
              value={classroom.time}
              onChange={handleInputChange}
            />
          </div>
          <div className="input">
            <label htmlFor="city">Địa chỉ:</label>
            <div className="address">
              <div className="top">
                <select
                  id="city"
                  name="city"
                  value={selectedProvinceCode}
                  onChange={handleProvinceChange}
                  required
                >
                  <option>Chọn tỉnh/thành phố</option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
                <select
                  id="district"
                  name="district"
                  value={selectedDistrictCode}
                  onChange={handleDistrictChange}
                  required
                >
                  <option>Chọn quận/huyện</option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.full_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="bottom">
                <select
                  id="ward"
                  name="ward"
                  onChange={handleWardChange}
                  required
                >
                  <option>Chọn phường/xã</option>
                  {wards.map((ward) => (
                    <option key={ward.id} value={ward.id}>
                      {ward.full_name}
                    </option>
                  ))}
                </select>
                <input
                  className="long-text"
                  name="streetNumber"
                  type="text"
                  placeholder="Tên đường, tòa nhà, số nhà"
                  value={classroom.address.streetNumber}
                  onChange={handleAddressChange}
                />
              </div>
            </div>
          </div>
          <div className="input">
            <label htmlFor="fee">Học phí:</label>
            <input
              name="fee"
              type="number"
              value={classroom.fee}
              onChange={handleInputChange}
            />
            <label> đồng/buổi</label>
          </div>
          <div className="input">
            <label htmlFor="note">Ghi chú:</label>
            <textarea
              id="note"
              name="note"
              placeholder="ví dụ: giới tính, học lực của học sinh; yêu cầu khác đối với gia sư..."
              value={classroom.note}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
        </form>
        <button onClick={handleSubmit}>Tạo lớp</button>
      </div>
      <div className="class-enrollment">
        <div className="classes-table">
          <div className="title">
            <p>DANH SÁCH LỚP ĐANG CÓ</p>
          </div>
          <table>
            <tr className="header">
              <th className="center">MÃ LỚP</th>
              <th className="center">MÔN HỌC</th>
              <th className="center">THỜI GIAN</th>
              <th className="center">HỌC PHÍ/BUỔI</th>
              <th className="center">ĐĂNG KÝ</th>
            </tr>
            {classes?.map((item) => (
              <tr key={item.id}>
                <th className="center">{item.id}</th>
                <th className="fields">
                  <span>{item.subjects}</span>
                  <span>{item.grade}</span>
                </th>
                <th>
                  <span>
                    Số buổi/tuần: {item.numberSession} <br />
                    {item.time}
                  </span>
                </th>
                <th>{item.fee} đồng</th>
                <th>
                  <button
                    className="center"
                    onClick={() => fetchEnrollments(item.id)}
                  >
                    Xem
                  </button>
                </th>
              </tr>
            ))}
          </table>
        </div>
        <div className="enrollment-table">
          <div className="title">
            <p>DANH SÁCH ĐĂNG KÝ NHẬN LỚP</p>
          </div>
          <table>
            <tr className="header">
              <th className="center">MÃ GIA SƯ</th>
              <th className="center">ẢNH</th>
              <th className="center">HỌ TÊN</th>
              <th className="center">TRẠNG THÁI</th>
              <th className="center">THAO TÁC</th>
            </tr>
            {enrollments &&
              enrollments.map((item) => (
                <tr key={item.id}>
                  <th
                    className="center id"
                    onClick={() => navigate(`/tutor/${item.tutor.id}`)}
                  >
                    {item.tutor.id}
                  </th>
                  <th className="center">
                    <img src={item.avt} alt="Ảnh thẻ gia sư" />
                  </th>
                  <th className="fields">
                    <span>{item.tutor.name}</span>
                    <span>
                      Hiện là: {item.tutor.gender} {item.tutor.position}
                    </span>
                  </th>
                  <th>{item.status}</th>
                  <th className="center">
                    {(() => {
                      if (item.status === "Chờ duyệt") {
                        return (
                          <button
                            onClick={() =>
                              handleApprove(item.id, item.classroom.id)
                            }
                          >
                            Duyệt
                          </button>
                        );
                      } else if (item.status === "Đã nhận lớp") {
                        return (
                          <Link className="link" to={`/review/${item.id}`}>
                            <button className="review">Đánh giá</button>
                          </Link>
                        );
                      } else {
                        return null;
                      }
                    })()}
                  </th>
                </tr>
              ))}
          </table>
        </div>
      </div>
    </div>
  );
};
export default ParentClasses;
