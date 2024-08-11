import React, { useEffect, useState } from "react";
import "./TutorRegister.scss";
import axios from "axios";
import request from "../../utils/request";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import handleError from "../../utils/handleError";
const TutorRegister = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState("79");
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const getDistrictNameFromId = (districts, id) => {
    const district = districts.find((d) => d.id === id);
    return district ? district.full_name : null;
  };
  const getDistrictNames = (districts, selectedIds) => {
    return selectedIds.map((id) => getDistrictNameFromId(districts, id));
  };
  const fetchProvinces = async () => {
    try {
      const res = await axios.get("https://esgoo.net/api-tinhthanh/1/0.htm");
      setProvinces(res.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchDistricts = async () => {
    try {
      const res = await axios.get("https://esgoo.net/api-tinhthanh/2/79.htm");
      setDistricts(res.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchData = async () => {
    try {
      const subjectsResponse = await axios.get(
        "http://localhost:8080/api/v1/subject"
      );
      const gradesResponse = await axios.get(
        "http://localhost:8080/api/v1/grade"
      );
      setSubjects(subjectsResponse.data);
      setGrades(gradesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
    fetchProvinces();
    fetchDistricts();
  }, []);
  const [tutor, setTutor] = useState({
    name: "",
    birthday: "",
    gender: 0,
    address: "",
    email: "",
    phoneNumber: "",
    password: "",
    universityName: "",
    major: "",
    position: 0,
    description: "",
    subjects: [],
    grades: [],
    province: "Hồ Chí Minh",
    teachingArea: [],
  });

  const [avt, setAvatar] = useState(null);
  const [degree, setDegree] = useState(null);
  const handleProvinceChange = (event) => {
    const selectedProvinceCode = event.target.value;
    setSelectedProvinceCode(selectedProvinceCode);
    setSelectedDistricts([]);
    const selectedProvince = provinces.find(
      (province) => province.id === selectedProvinceCode
    );
    if (selectedProvince) {
      setTutor((prevTutor) => ({
        ...prevTutor,
        province: selectedProvince.name,
      }));
    }
    axios
      .get(`https://esgoo.net/api-tinhthanh/2/${selectedProvinceCode}.htm`)
      .then((response) => {
        setDistricts(response.data.data);
      })
      .catch((error) => console.error("Lỗi khi gọi API:", error));
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTutor((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleDegreeChange = (e) => {
    setDegree(e.target.files[0]);
  };
  const handleSubjectChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setTutor((prevData) => ({
        ...prevData,
        subjects: [...prevData.subjects, value],
      }));
    } else {
      setTutor((prevData) => ({
        ...prevData,
        subjects: prevData.subjects.filter((subject) => subject !== value),
      }));
    }
  };
  const handleGradeChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setTutor((prevData) => ({
        ...prevData,
        grades: [...prevData.grades, value],
      }));
    } else {
      setTutor((prevData) => ({
        ...prevData,
        grades: prevData.grades.filter((grade) => grade !== value),
      }));
    }
  };
  const handleDistrictChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedDistricts((prevSelectedDistricts) => [
        ...prevSelectedDistricts,
        value,
      ]);
    } else {
      setSelectedDistricts((prevSelectedDistricts) =>
        prevSelectedDistricts.filter((district) => district !== value)
      );
    }
  };
  useEffect(() => {
    if (tutor) {
      console.log("Thông tin gia sư:", tutor);
    }
  }, [tutor]);
  const sendVerificationEmail = async (id) => {
    try {
      await request.post(`auth/tutor/${id}`);
    } catch (error) {
      alert("Đã có lỗi xảy ra khi gửi email xác thực. Vui lòng thử lại sau.");
    }
  };
  const uploadTutorImg = async (tutorId) => {
    const formData = new FormData();
    formData.append("avt", avt);
    formData.append("degree", degree);
    try {
      const res = await request.post(`/tutor/image/${tutorId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      handleError(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedTutor = {
        ...tutor,
        teachingArea: getDistrictNames(districts, selectedDistricts),
      };
      const res = await request.post("auth/tutor/register", updatedTutor);
      if (res.data.status == "success") {
        await uploadTutorImg(res.data.data.id);
        navigate("/login");
        toast.success(
          "Cảm ơn bạn đã đăng ký. Vui lòng xác thực email để hoàn tất quá trình."
        );
        await sendVerificationEmail(res.data.data.id);
      } else {
        toast.error(
          "Đã có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại."
        );
      }
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <div className="register-tutor">
      <h1>GIA SƯ ĐĂNG KÝ</h1>
      <form onSubmit={handleSubmit}>
        <div className="left">
          <div className="input">
            <label htmlFor="name">Họ và tên:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={tutor.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input">
            <label htmlFor="birthday">Ngày sinh:</label>
            <input
              type="text"
              id="birthday"
              name="birthday"
              placeholder="dd/MM/yyyy"
              required
              value={tutor.birthday}
              onChange={handleInputChange}
            />
          </div>
          <div className="input">
            <label htmlFor="gender">Giới tính:</label>
            <select
              id="gender"
              name="gender"
              value={tutor.gender}
              onChange={handleInputChange}
              required
            >
              <option value="0">Nam</option>
              <option value="1">Nữ</option>
            </select>
          </div>
          <div className="input">
            <label htmlFor="address">Địa chỉ hiện tại:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={tutor.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="input">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={tutor.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input">
            <label htmlFor="phoneNumber">Số điện thoại:</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={tutor.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input">
            <label htmlFor="password">Mật khẩu:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={tutor.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input">
            <label htmlFor="avt">Ảnh thẻ:</label>
            <input
              type="file"
              id="avt"
              name="avt"
              onChange={handleAvatarChange}
              required
            />
          </div>
          <div className="input">
            <label htmlFor="degree">Ảnh bằng cấp:</label>
            <input
              type="file"
              id="degree"
              name="degree"
              onChange={handleDegreeChange}
              required
            ></input>
          </div>
          <div className="input">
            <label htmlFor="universityName">Trường đào tạo:</label>
            <input
              type="text"
              id="universityName"
              name="universityName"
              value={tutor.universityName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input">
            <label htmlFor="major">Chuyên ngành:</label>
            <input
              type="text"
              id="major"
              name="major"
              value={tutor.major}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input">
            <label htmlFor="position">Hiện là:</label>
            <select
              id="position"
              name="position"
              value={tutor.position}
              onChange={handleInputChange}
              required
            >
              <option value="0">Sinh viên</option>
              <option value="1">Giáo viên</option>
              <option value="2">Sinh viên tốt nghiệp</option>
            </select>
          </div>
          <button type="submit">Đăng ký</button>
        </div>
        <div className="right">
          <div className="input">
            <label htmlFor="subjects">Môn dạy:</label>
            <div className="checkbox-group">
              {subjects.map((subject) => (
                <div key={subject.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`subject-${subject.id}`}
                    value={subject.id}
                    onChange={handleSubjectChange}
                  />
                  <label className="choose" htmlFor={`subject-${subject.id}`}>
                    {subject.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="input">
            <label>Khối dạy:</label>
            <div className="checkbox-group">
              {grades.map((grade) => (
                <div key={grade.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`grade-${grade.id}`}
                    value={grade.id}
                    onChange={handleGradeChange}
                  />
                  <label className="choose" htmlFor={`grade-${grade.id}`}>
                    {grade.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="input">
            <label htmlFor="">Tỉnh thành:</label>
            <select
              id="province"
              name="province"
              value={selectedProvinceCode}
              onChange={handleProvinceChange}
              required
            >
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>
          <div className="input">
            <label>Khu vực dạy:</label>
            <div className="checkbox-group">
              {districts.map((district) => (
                <div key={district.id} className="checkbox-item long">
                  <input
                    type="checkbox"
                    id={`district-${district.id}`}
                    value={district.id}
                    checked={selectedDistricts.includes(district.id)}
                    onChange={handleDistrictChange}
                  />
                  <label className="choose" htmlFor={`district-${district.id}`}>
                    {district.full_name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="input">
            <label htmlFor="description">Ưu điểm:</label>
            <textarea
              id="description"
              name="description"
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
        </div>
      </form>
    </div>
  );
};
export default TutorRegister;
