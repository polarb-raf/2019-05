import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import './Header.scss';
import { faSignInAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import logo from '../../../assets/images/quickkick-logo.png';

const Header = () => (
  <div className="header">
    <div className="grid-container">
      <div className="header__left">
        <ServiceLogo />
      </div>
      <div className="header__right">
        <NavBar />
      </div>
    </div>
  </div>
);

const ServiceLogo = () => (
  <Link to="/">
    <img className="logo" src={logo} alt="퀵킥 로고" />
  </Link>
);

const NavBar = () => {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const cookie = document.cookie.split('=')[1];
    setIsLogin(cookie === 'true');
  }, []);

  return (
    <nav className="nav-bar">
      <div className="nav-bar__button">
        <Link to="/match">매치 검색</Link>
      </div>
      <div className="nav-bar__button">
        <Link to="/ranking">팀 목록 보기</Link>
      </div>
      {isLogin ? <UserIcon /> : <LoginBtn />}
    </nav>
  );
};

const LoginBtn = () => (
  <div className="nav-bar__login">
    <a href="http://127.0.0.1:4000/auth/naver">로그인</a>
  </div>
);

const UserIcon = () => (
  <div className="nav-bar__user-info">
    <FontAwesomeIcon icon={faUserCircle} size="2x" />
    <div className="nav-bar__user-detail">
      <ul>
        <li>
          <Link to="/team/1">내 팀 보기</Link>
        </li>
        <li>
          <a href="http://127.0.0.1:4000/auth/logout">로그아웃</a>
        </li>
      </ul>
    </div>
  </div>
);

export default Header;
