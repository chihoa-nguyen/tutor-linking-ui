import React from "react";
import "./Navbar.scss";
const Navbar = () => {
  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <span className="text">tutorLinking</span>
        </div>
        <div className="links">
          <span>Giới thiệu</span>
          <span>Đăng ký gia sư</span>
          <span>Lớp mới</span>
          <span>Phụ huynh</span>
        </div>
        <div className="auth">
          <div className="login">
            <button>Đăng nhập</button>
          </div>
          <div className="register">
            <button>Đăng kí</button>
          </div>
        </div>
      </div>
      <br />
    </div>
  );
};
export default Navbar;
