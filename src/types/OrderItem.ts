export type OrderItem = {
  id: number;
  name: string;
  plan: string;
  fact: string;
  status: "none" | "more" | "done" | "loading"; // цвета
  isUpdating?: boolean; // для анимации
};