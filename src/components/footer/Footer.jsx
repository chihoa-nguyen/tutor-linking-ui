import React from "react";
import "./Footer.scss";
const Footer = () => {
  return (
    <div className="footer">
      <div className="container">
        <div className="top">
          <div className="item">
            <h2>Dịch vụ</h2>
            <span>Gia sư tiểu học</span>
            <span>Gia sư THCS</span>
            <span>Gia sư THPT</span>
            <span>Gia sư đại học</span>
            <span>Gia sư ngoại ngữ</span>
            <span>Gia sư luyện thi</span>
          </div>
          <div className="item">
            <h2>Về Chúng Tôi</h2>
            <span>Giới thiệu</span>
            <span>Đội ngũ gia sư</span>
            <span>Cam kết chất lượng</span>
            <span>Đối tác</span>
            <span>Liên hệ</span>
          </div>
          <div className="item">
            <h2>Hỗ trợ</h2>
            <span>Trung tâm hỗ trợ</span>
            <span>Câu hỏi thường gặp</span>
            <span>Điều khoản dịch vụ</span>
            <span>Chính sách bảo mật</span>
          </div>
          <div className="item">
            <h2>Cộng đồng</h2>
            <span>Blog</span>
            <span>Diễn đàn</span>
            <span>Câu chuyện thành công</span>
            <span>Fanpage</span>
            <span>Youtube</span>
          </div>
          <div className="item">
            <h2>Thông tin liên hệ</h2>
            <span>Địa chỉ</span>
            <span>Số điện thoại</span>
            <span>Email</span>
            <span>Bản đồ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
