import React, { useState } from "react";
import "./Login.scss";
import request from "../../utils/request";
import handleError from "../../utils/handleError";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [userType, setUserType] = useState("tutor");
  const [userCredentials, setUserCredentials] = useState({
    email: null,
    password: null,
  });
  const navigate = useNavigate();
  const handleChangeType = (event) => {
    setUserType(event.target.value);
  };
  const handleChangeCredentials = (event) => {
    const { name, value } = event.target;
    setUserCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const res = await request.post(`auth/${userType}/login`, userCredentials);
      const token = res.data.data.token;
      localStorage.setItem("authToken", token);
      const user = await request.get(`${userType}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.setItem("currentUser", JSON.stringify(user.data.data));
      toast.success("Đăng nhập thành công");
      navigate("/");
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <div className="login">
      <div className="container">
        <h1>ĐĂNG NHẬP</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="">Email:</label>
          <input
            name="email"
            type="text"
            placeholder="example@gmail.com"
            value={userCredentials.email}
            onChange={handleChangeCredentials}
          />
          <label htmlFor="">Mật khẩu:</label>
          <input
            name="password"
            type="password"
            value={userCredentials.password}
            onChange={handleChangeCredentials}
          />
          <label htmlFor="">Bạn là:</label>
          <select name="user_type" value={userType} onChange={handleChangeType}>
            <option value="tutor">Gia sư</option>
            <option value="parent">Phụ huynh</option>
          </select>
          <p className="forgot-password">
            <a href="#">Quên mật khẩu</a>
          </p>
          <button type="submit">Xác nhận</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
