export type OrderItem = {
  id: number;
  name: string;
  plan: string;
  fact: string;
  status?: "none" | "more" | "equal" | "less";
  isUpdating?: boolean;

  raw?: {
    Div: number;
    DivReal: number;
  };
};