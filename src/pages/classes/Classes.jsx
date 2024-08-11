import React, { useState, useEffect } from "react";
import "./Classes.scss";
import axios from "axios";
import request from "../../utils/request";
import { genders, positions } from "../../utils/common_data.js";
import ClassCard from "../../components/classCard/ClassCard.jsx";
import handleError from "../../utils/handleError.js";
import { toast } from "react-toastify";
const Classes = () => {
  const [data, setData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState("");

  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);

  const [openDistrict, setOpenDistrict] = useState(false);
  const [openSubject, setOpenSubject] = useState(false);
  const [openGrade, setOpenGrade] = useState(false);
  const [openPosition, setOpenPosition] = useState(false);
  const [classroom, setClassroom] = useState({
    subjectIds: [],
    gradeIds: [],
    gender: null,
    positions: [],
    city: "",
    districts: [],
  });
  const getDistrictNameFromId = (districts, id) => {
    const district = districts.find((d) => d.id === id);
    return district ? district.full_name : null;
  };
  const getDistrictNames = (districts, selectedIds) => {
    return selectedIds.map((id) => getDistrictNameFromId(districts, id));
  };
  const fetchData = async () => {
    try {
      const subjectsResponse = await request.get("/subject");
      const gradesResponse = await request.get("/grade");
      await fetchClasses(classroom);
      setSubjects(subjectsResponse.data);
      setGrades(gradesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchClasses = async (input) => {
    try {
      const res = await request.post("classes", input, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setData(res.data);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };
  const fetchProvinces = async () => {
    try {
      const res = await axios.get("https://esgoo.net/api-tinhthanh/1/0.htm");
      setProvinces(res.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchSuitableClasses = async () => {
    try {
      const res = await request.get("class/tutor", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setData(res.data);
      toast.success("Đã lọc lớp phù hợp với hồ sơ gia sư");
    } catch (error) {
      handleError(error);
    }
  };
  useEffect(() => {
    fetchData();
    fetchProvinces();
  }, []);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setClassroom((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleProvinceChange = (event) => {
    const selectedProvinceCode = event.target.value;
    setSelectedProvinceCode(selectedProvinceCode);
    setSelectedDistricts([]);
    const selectedProvince = provinces.find(
      (province) => province.id === selectedProvinceCode
    );
    if (selectedProvince) {
      setClassroom((prevClass) => ({
        ...prevClass,
        city: selectedProvince.name,
      }));
    }
    axios
      .get(`https://esgoo.net/api-tinhthanh/2/${selectedProvinceCode}.htm`)
      .then((response) => {
        setDistricts(response.data.data);
      })
      .catch((error) => console.error("Lỗi khi gọi API:", error));
  };
  const handleSubmit = async () => {
    // e.preventDefault();
    try {
      const updatedFilter = {
        ...classroom,
        districts: getDistrictNames(districts, selectedDistricts),
        subjectIds: selectedSubjects,
        gradeIds: selectedGrades,
        positions: selectedPositions,
      };
      const res = await request.post("classes", updatedFilter, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setData(res.data);
    } catch (error) {
      handleError(error);
    }
  };
  const handleFieldChange = (field, value, checked) => {
    switch (field) {
      case "district":
        setSelectedDistricts((prevSelectedDistricts) => {
          if (checked) {
            return [...prevSelectedDistricts, value];
          } else {
            return prevSelectedDistricts.filter((item) => item !== value);
          }
        });
        break;
      case "subject":
        setSelectedSubjects((prevSelectedSubjects) => {
          if (checked) {
            return [...prevSelectedSubjects, parseInt(value)];
          } else {
            return prevSelectedSubjects.filter((id) => id !== parseInt(value));
          }
        });
        break;
      case "grade":
        setSelectedGrades((prevSelectedGrades) => {
          if (checked) {
            return [...prevSelectedGrades, parseInt(value)];
          } else {
            return prevSelectedGrades.filter(
              (item) => item !== parseInt(value)
            );
          }
        });
        break;
      case "position":
        setSelectedPositions((prevSelectedPositions) => {
          if (checked) {
            return [...prevSelectedPositions, parseInt(value)];
          } else {
            return prevSelectedPositions.filter(
              (item) => item !== parseInt(value)
            );
          }
        });
        break;
      default:
        break;
    }
  };
  return (
    <div className="classes">
      <div className="container">
        <div className="filter">
          <p>LỌC THEO CÁC TIÊU CHÍ:</p>
          <form onSubmit={handleSubmit}>
            <select
              id="city"
              name="city"
              value={selectedProvinceCode}
              onChange={handleProvinceChange}
              required
            >
              <option>Chọn tỉnh thành</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
            <div className="filter-option">
              <input
                type="text"
                id="districts-input"
                placeholder={
                  selectedDistricts.length == 0
                    ? "Chọn khu vực dạy"
                    : `Đã chọn ${selectedDistricts.length} khu vực`
                }
                readOnly
                onClick={() => setOpenDistrict(!openDistrict)}
              />
              {openDistrict && (
                <div className="options">
                  {districts.map((district) => (
                    <div key={district.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`district-${district.id}`}
                        value={district.id}
                        checked={selectedDistricts.includes(district.id)}
                        onChange={(event) =>
                          handleFieldChange(
                            "district",
                            event.target.value,
                            event.target.checked
                          )
                        }
                      />
                      <label
                        className="choose"
                        htmlFor={`district-${district.id}`}
                      >
                        {district.full_name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="filter-option">
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
                        onChange={(event) =>
                          handleFieldChange(
                            "subject",
                            event.target.value,
                            event.target.checked
                          )
                        }
                      />
                      <label
                        className="choose"
                        htmlFor={`subject-${subject.id}`}
                      >
                        {subject.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="filter-option">
              <input
                type="text"
                id="grades-input"
                placeholder={
                  selectedGrades.length === 0
                    ? "Chọn khối học"
                    : `Đã chọn ${selectedGrades.length} khối`
                }
                readOnly
                onClick={() => setOpenGrade(!openGrade)}
              />
              {openGrade && (
                <div className="options">
                  {grades.map((grade) => (
                    <div key={grade.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`grade-${grade.id}`}
                        value={grade.id}
                        checked={selectedGrades.includes(grade.id)}
                        onChange={(event) =>
                          handleFieldChange(
                            "grade",
                            event.target.value,
                            event.target.checked
                          )
                        }
                      />
                      <label className="choose" htmlFor={`grade-${grade.id}`}>
                        {grade.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="filter-option">
              <input
                type="text"
                id="position-input"
                placeholder={
                  selectedPositions.length == 0
                    ? "Chọn trình độ"
                    : `Đã chọn ${selectedPositions.length} trình độ`
                }
                readOnly
                onClick={() => setOpenPosition(!openPosition)}
              />
              {openPosition && (
                <div className="options">
                  {positions.map((position) => (
                    <div key={position.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`position-${position.value}`}
                        value={position.value}
                        checked={selectedPositions.includes(position.value)}
                        onChange={(event) =>
                          handleFieldChange(
                            "position",
                            event.target.value,
                            event.target.checked
                          )
                        }
                      />
                      <label
                        className="choose"
                        htmlFor={`position-${position.value}`}
                      >
                        {position.label}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <select
              name="gender"
              value={classroom.gender}
              onChange={handleInputChange}
            >
              <option>Chọn giới tính</option>
              {genders.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </form>
          <div className="btns">
            <button onClick={() => handleSubmit()}>Lọc lớp</button>
            <button className="suitable" onClick={() => fetchSuitableClasses()}>
              Lớp phù hợp
            </button>
          </div>
        </div>
        <div className="result-filter">
          <p className="count">
            {data && data.length > 0
              ? `Có ${data.length} kết quả phù hợp`
              : "Không có kết quả phù hợp"}
          </p>
          <div className="cards">
            {data &&
              data.map((item) => <ClassCard key={item.id} item={item} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classes;
