import React from "react";

type HeaderProps = {
  currentTime: Date;
  isConnected: boolean;
};

const Header: React.FC<HeaderProps> = ({ currentTime, isConnected }) => {
  return (
    <header className="header">
      <div className="header-title">
        Монитор погрузочных терминалов
      </div>
      <div className="header-time">
        {currentTime.toLocaleDateString("ru-RU")}{" "}
        {currentTime.toLocaleTimeString("ru-RU")}
        {" | "}
        WS: {isConnected ? "OK" : "NO"}
      </div>
    </header>
  );
}

export default Header;