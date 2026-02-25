// src/types/OrderItem.ts
export type Status = "none" | "more" | "equal" | "less";

export type OrderDetailsRaw = {
  Type1CId: number;
  FullName: string;
  AmountCurrent: number;
  AmountTotal: number;
  AmountStandart: number;
  Div: number;
  Rem: number;
  DivReal: number;
  RemReal: number;
  State: number; // raw numeric state from backend
  IsUpdated: boolean;
};

export type OrderItem = {
  // идентификатор в таблице (переисчисляется при отображении)
  id: number;

  // пользовательские поля для отображения
  name: string;
  plan: string;
  fact: string;

  // canonical status (целевой, "правильный" статус по бекенду)
  status: Status;

  // видимый статус (тот, по которому сортируем/рисуем сейчас)
  displayStatus?: Status;

  // если идёт анимация — флаг
  isUpdating?: boolean;

  // если обновление запланировано: куда перейти после анимации
  nextStatus?: Status;

  // голые данные от бэка (для подсчётов и отладки)
  raw?: OrderDetailsRaw;
};