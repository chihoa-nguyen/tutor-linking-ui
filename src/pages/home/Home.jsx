import React from "react";
import "./Home.scss";
const Home = () => {
  return (
    <div className="home">
      <div className="features">
        <div className="container">
          <div className="item">
            <h1>Kết nối với gia sư chất lượng, phù hợp với nhu cầu của bạn</h1>
            <div className="title">
              <img src="./img/check.png" alt="" />
              Lựa chọn gia sư dựa trên chuyên môn và kinh nghiệm
            </div>
            <p>
              Tìm được gia sư có chuyên môn sâu trong môn học bạn cần, với kinh
              nghiệm giảng dạy được chứng minh. Chúng tôi sẽ kết nối bạn với
              những gia sư phù hợp nhất để đạt được kết quả tối ưu.
            </p>
            <div className="title">
              <img src="./img/check.png" alt="" />
              Giá cả minh bạch, phù hợp với ngân sách
            </div>
            <p>
              Với bảng giá rõ ràng, bạn có thể chọn được gia sư phù hợp với khả
              năng tài chính của mình. Không có bất kỳ chi phí phát sinh nào
              trong quá trình giảng dạy.
            </p>
            <div className="title">
              <img src="./img/check.png" alt="" />
              Tìm gia sư dễ dàng
            </div>
            <p>
              Chúng tôi có đội ngũ gia sư chuyên nghiệp, luôn sẵn sàng hỗ trợ
              bạn học tập mọi lúc mọi nơi.
            </p>
          </div>
          <div className="item">
            <img src="./img/banner.jpg"></img>
          </div>
        </div>
      </div>
      <div className="features dark">
        <div className="container">
          <div className="item">
            <img src="./img/tutoring.jpg" alt="" />
          </div>
          <div className="item">
            <h1>
              Giải pháp <i>Gia sư chuyên nghiệp</i> dành cho phụ huynh
            </h1>
            <p>
              Nâng cấp lên một trải nghiệm được chọn lọc, đầy công cụ và quyền
              lợi, dành riêng cho phụ huynh.
            </p>
            <button>Khám phá</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
