import React, { useState } from "react";
import "./ParentRegister.scss";
import { useNavigate } from "react-router-dom";
import request from "../../utils/request";
import handleError from "../../utils/handleError";
import { toast } from "react-toastify";
const ParentRegister = () => {
  const navigate = useNavigate();
  const [parentData, setParentData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setParentData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const sendVerificationEmail = async (id) => {
    try {
      await request.post(`auth/parent/${id}`);
    } catch (error) {
      alert("Đã có lỗi xảy ra khi gửi email xác thực. Vui lòng thử lại sau.");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Thông tin phụ huynh:", parentData);
    try {
      const res = await request.post("auth/parent/register", parentData);
      if (res.data.status == "success") {
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
    <div className="register_parent">
      <div className="container">
        <h1>PHỤ HUYNH ĐĂNG KÝ</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Họ và tên:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={parentData.name}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={parentData.email}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="phoneNumber">Số điện thoại:</label>
          <input
            type="tel"
            id="phone"
            name="phoneNumber"
            value={parentData.phoneNumber}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="address">Địa chỉ:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={parentData.address}
            onChange={handleInputChange}
          />
          <label htmlFor="password">Mật khẩu:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={parentData.password}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Đăng ký</button>
        </form>
      </div>
    </div>
  );
};

export default ParentRegister;
