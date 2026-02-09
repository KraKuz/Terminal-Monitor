import { OrderItem } from "../types/OrderItem";

export const orderItemsMock: OrderItem[] = [
  {
    id: 1,
    name: 'Унитаз-компакт "Рио" (Рио) Черный кракелюр',
    plan: "12 (1+0)",
    fact: "0 (0+0)",
    status: "loading",
  },
  {
    id: 2,
    name: 'Умывальник "Комфорт" Белый',
    plan: "192 (33+20)",
    fact: "192 (33+20)",
    status: "done",
  },
  {
    id: 3,
    name: "Пьедестал Белый",
    plan: "35 (1+0)",
    fact: "35 (1+0)",
    status: "more",
  },
  {
    id: 4,
    name: 'Унитаз-компакт "Детский" (Прайм) Белый',
    plan: "12 (1+0)",
    fact: "12 (1+0)",
    status: "none",
  },
];