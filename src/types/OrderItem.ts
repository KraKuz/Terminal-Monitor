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
  State: number;
  IsUpdated: boolean;
};

export type OrderItem = {
  id: number;
  name: string;
  plan: string;
  fact: string;
  status: Status;
  displayStatus?: Status;
  isUpdating?: boolean;
  nextStatus?: Status;
  raw?: OrderDetailsRaw;
};