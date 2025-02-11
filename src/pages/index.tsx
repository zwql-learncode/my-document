import React, { useState } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import "../css/Profile.css"; // Đảm bảo tên file CSS này trùng với file bạn tạo

export default function Home() {
  // Sử dụng state để lưu trữ theme: "light" hoặc "dark"
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Layout>
      <div className={`full-screen-profile ${theme}`}>
        {/* Nút chuyển dark/light theme */}
        <button className="theme-toggle" onClick={toggleTheme}>
          Switch to {theme === "light" ? "Dark" : "Light"} Theme
        </button>

        {/* Grid container chứa các ô */}
        <div className="grid-container">
          {/* Ô 1: Profile */}
          <div className="grid-item">
            <h2>Profile</h2>
            <img
              src="/my-docs/img/avatar.jpg" // Đảm bảo file ảnh được đặt trong thư mục static/img/avatar.jpg
              alt="Avatar"
              className="grid-avatar"
            />
            <h3>Nguyễn Quang Hưng</h3>
            <p>HiImLawtSimp1e · he/him</p>
          </div>

          {/* Ô 2: About */}
          <div className="grid-item">
            <h2>About Me</h2>
            <p>
              I am a computer science student working toward becoming a software
              engineer. I love learning and feel excited as I gain knowledge in
              software system design.
            </p>
          </div>

          {/* Ô 3: Contact */}
          <div className="grid-item">
            <h2>Contact</h2>
            <p>
              <strong>Email:</strong> nqh1703k2@gmail.com
            </p>
            <p>
              <strong>Location:</strong> Ha Noi
            </p>
            <p>
              <strong>Github:</strong>{" "}
              <a
                href="https://github.com/HiImLawtSimp1e"
                target="_blank"
                rel="noopener noreferrer"
              >
                HiImLawtSimp1e
              </a>
            </p>
            <p>
              <strong>LinkedIn:</strong>{" "}
              <a
                href="https://www.linkedin.com/in/quang-hung-nguyen-347959284"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </p>
          </div>

          {/* Ô 4: Education & Hobbies */}
          <div className="grid-item">
            <h2>Education & Hobbies</h2>
            <p>
              <strong>School:</strong> FPT Polytechnic College of Hanoi
            </p>
            <p>
              <strong>Major:</strong> Computer Science
            </p>
            <p>
              <strong>Hobbies:</strong> Playing Game, Running, Riding Bike,
              Reading Book & Manga, Watching Anime
            </p>
          </div>
        </div>

        {/* (Nếu muốn, bạn có thể thêm các liên kết đến Document, Blog, v.v.) */}
        <div className="doc-link">
          <p>
            <Link to="/docs/repository">Document của tôi</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
