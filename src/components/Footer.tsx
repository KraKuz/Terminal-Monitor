import React from "react";

type FooterProps = {
  visible: boolean;
};

function Footer({ visible }: FooterProps) {
  if (!visible) return null;

  return (
    <table className="footer-table">
      <thead>
        <tr>
          <th>Цвет</th>
          <th>Значение</th>
        </tr>
      </thead>
      <tbody>
        <tr className="status-none">
          <td>Красный</td>
          <td>Нет в заказе</td>
        </tr>
        <tr className="status-more">
          <td>Оранжевый</td>
          <td>Больше чем в заказе</td>
        </tr>
        <tr className="status-done">
          <td>Зелёный</td>
          <td>Погрузка выполнена</td>
        </tr>
        <tr className="status-loading">
          <td>Белый</td>
          <td>Погрузка</td>
        </tr>
      </tbody>
    </table>
  );
}

export default Footer;