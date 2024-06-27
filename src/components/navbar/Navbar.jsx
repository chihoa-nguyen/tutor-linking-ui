import React, { useState } from "react";
import "./Navbar.scss";
const Navbar = () => {
  const [login, setLogin] = useState(true);
  const [open, setOpen] = useState(false);
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
        {!login ? (
          <div className="auth">
            <div className="login">
              <button onClick={() => setLogin(!login)}>Đăng nhập</button>
            </div>
            <div className="register">
              <button>Đăng kí</button>
            </div>
          </div>
        ) : (
          <div className="user" onClick={() => setOpen(!open)}>
            <img
              src="https://images.pexels.com/photos/1115697/pexels-photo-1115697.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <span>Chí Hòa</span>
            {open && (
              <div className="options">
                {/* {currentUser.isSeller && (
                <>
                  <span className="link" to="">
                    Gigs
                  </span>
                  <span className="link" to="">
                    Add New Gig
                  </span>
                </>
              )} */}
                <span className="link" to="">
                  Thông tin cá nhân
                </span>
                <span className="link" to="">
                  Lớp mới phù hợp
                </span>
                <span className="link" to="" onClick={() => setLogin(!login)}>
                  Đăng xuất
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      <br />
    </div>
  );
};
export default Navbar;
