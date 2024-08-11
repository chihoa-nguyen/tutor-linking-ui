import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import request from "../../utils/request";
import { toast } from "react-toastify";
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await request.post("/auth/logout");
      localStorage.setItem("currentUser", null);
      localStorage.setItem("authToken", null);
      navigate("/");
      toast.success("Đã đăng xuất tài khoản");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <Link className="link" to="/">
            Tutorlinking
          </Link>
        </div>
        {currentUser &&
          (currentUser.role == "PARENT" ? (
            <div className="links">
              <Link className="link" to="/">
                Trang chủ
              </Link>
              <Link className="link" to="/parent/classes">
                Quản lý lớp học
              </Link>
              <Link className="link">Phụ huynh cần biết</Link>
              <Link className="link">Giới thiệu</Link>
            </div>
          ) : (
            <div className="links">
              <Link className="link" to="/">
                Trang chủ
              </Link>
              <Link className="link" to="/classes">
                Lớp mới
              </Link>
              <Link className="link" to="/tutor/classes">
                Quản lý lớp dạy
              </Link>
              <Link className="link">Gia sư cần biết</Link>
              <Link className="link">Giới thiệu</Link>
            </div>
          ))}
        {!currentUser ? (
          <div className="auth">
            <div className="login">
              <Link to="/login">
                <button>Đăng nhập</button>
              </Link>
            </div>
            <div className="register">
              <button onClick={() => setTypeOpen(!typeOpen)}>Đăng kí</button>
              {typeOpen && (
                <div className="type">
                  <Link className="link" to={"/parent/register"}>
                    Phụ huynh
                  </Link>
                  <Link className="link" to={"/tutor/register"}>
                    Gia sư
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="user" onClick={() => setOpen(!open)}>
            <img src="/img/avt.png" alt="" />
            <div className="cbBox">
              <span>
                <i>Xin chào,</i>
              </span>
              <span>{currentUser?.name}</span>
              {open && (
                <div className="options">
                  <span className="link" to="">
                    Thông tin cá nhân
                  </span>
                  <span className="link" to="">
                    Đổi mật khẩu
                  </span>
                  <span className="link" to="" onClick={handleLogout}>
                    Đăng xuất
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <br />
    </div>
  );
};
export default Navbar;
