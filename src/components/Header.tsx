type HeaderProps = {
  currentTime: Date;
};

function Header({ currentTime }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-title">
        Монитор погрузочных терминалов
      </div>
      <div className="header-time">
        {currentTime.toLocaleDateString("ru-RU")}{" "}
        {currentTime.toLocaleTimeString("ru-RU")}
      </div>
    </header>
  );
}

export default Header;