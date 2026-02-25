// src/hooks/useOrderDetails.ts
import { useEffect, useRef, useState } from "react";
import { wsService } from "../services/wsService";
import { OrderInfoData } from "./useOrderInfo";
import { OrderItem, OrderDetailsRaw, Status } from "../types/OrderItem";

const ANIMATION_MS = 2000; // длительность жёлтой анимации 

function mapStateToStatus(state: number): Status {
  switch (state) {
    case 0: return "none";     // NotInOrder
    case 1: return "more";     // TooMany
    case 2: return "less";     // InWork
    case 3: return "equal";    // Complete
    default: return "less";
  }
}

export function useOrderDetails(orderInfo: OrderInfoData | null, terminalId: number | null) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  // Таймеры per Type1CId
  const timersRef = useRef<Record<number, ReturnType<typeof setTimeout> | null>>({});

  useEffect(() => {
    if (!orderInfo || terminalId == null) {
      // очистка таймеров
      Object.values(timersRef.current).forEach(t => t && clearTimeout(t));
      timersRef.current = {};
      setOrderItems([]);
      return;
    }

    const orderId = orderInfo.id;
    const startDate = orderInfo.shipmentStart;
    const fetchOrder = () => {
      const msg = `[getorderdetails]|#|terminalid=${terminalId}|#|orderid=${orderId}|#|startdate=${startDate}`;
      wsService.send(msg);
    };

    const interval = setInterval(fetchOrder, 1000);
    fetchOrder();

    return () => {
      clearInterval(interval);
    };
  }, [orderInfo, terminalId]);

  useEffect(() => {
    const unsubscribe = wsService.subscribe((msg) => {
      try {
        const parsed = JSON.parse(msg);

        if (!parsed.Header?.startsWith("[getorderdetails]")) return;

        // фильтр по терминалу
        if (parsed.Query?.TerminalId !== terminalId) return;

        const body = typeof parsed.Body === "string" ? JSON.parse(parsed.Body) : parsed.Body;
        if (!Array.isArray(body)) {
          // очистка если пришёл не массив
          setOrderItems([]);
          return;
        }

        // Обновление state
        setOrderItems(prev => {
          // indexByType для удобного доступа к предыдущему элементу
          const prevByType = new Map<number, OrderItem>();
          for (const p of prev) {
            if (p.raw && typeof p.raw.Type1CId === "number") prevByType.set(p.raw.Type1CId, p);
          }

          const nextList: OrderItem[] = body.map((it: OrderDetailsRaw, idx: number) => {
            const typeId = it.Type1CId;
            const canonicalStatus = mapStateToStatus(it.State);
            const existing = prevByType.get(typeId);

            const incomingIsUpdated = !!it.IsUpdated;

            if (incomingIsUpdated) {
              const displayStatus = existing ? (existing.displayStatus ?? existing.status) : canonicalStatus;

              // сбрасываем старые таймеры и ставим новый
              if (timersRef.current[typeId]) {
                clearTimeout(timersRef.current[typeId]!);
              }

              // запускаем таймер: по окончании анимации применяем nextStatus
              timersRef.current[typeId] = setTimeout(() => {
                setOrderItems(cur => {
                  return cur.map(ci => {
                    if (ci.raw?.Type1CId === typeId) {
                      return {
                        ...ci,
                        status: canonicalStatus,
                        displayStatus: canonicalStatus,
                        isUpdating: false,
                        nextStatus: undefined,
                      };
                    }
                    return ci;
                  });
                });
                // удаляем таймер
                delete timersRef.current[typeId];
              }, ANIMATION_MS);

              return {
                id: idx + 1,
                name: it.FullName,
                plan: `${it.AmountTotal.toString()} (${it.Div}+${it.Rem})`,
                fact: `${it.AmountCurrent.toString()} (${it.DivReal}+${it.RemReal})`,
                status: canonicalStatus,
                displayStatus: displayStatus,
                isUpdating: true,
                nextStatus: canonicalStatus,
                raw: it,
              };
            } else {
              if (timersRef.current[typeId]) {
                const existingDisplay = existing ? (existing.displayStatus ?? existing.status) : canonicalStatus;
                return {
                  id: idx + 1,
                  name: it.FullName,
                  plan: `${it.AmountTotal.toString()} (${it.Div}+${it.Rem})`,
                  fact: `${it.AmountCurrent.toString()} (${it.DivReal}+${it.RemReal})`,
                  status: canonicalStatus,
                  displayStatus: existingDisplay,
                  isUpdating: true,
                  nextStatus: canonicalStatus,
                  raw: it,
                };
              } else {
                return {
                  id: idx + 1,
                  name: it.FullName,
                  plan: `${it.AmountTotal.toString()} (${it.Div}+${it.Rem})`,
                  fact: `${it.AmountCurrent.toString()} (${it.DivReal}+${it.RemReal})`,
                  status: canonicalStatus,
                  displayStatus: canonicalStatus,
                  isUpdating: false,
                  nextStatus: undefined,
                  raw: it,
                };
              }
            }
          });

          // очистка таймеров для элементов, которых в новом массиве больше нет
          const presentIds = new Set(body.map((it: any) => it.Type1CId));
          for (const keyStr of Object.keys(timersRef.current)) {
            const key = Number(keyStr);
            if (!presentIds.has(key) && timersRef.current[key]) {
              clearTimeout(timersRef.current[key]!);
              delete timersRef.current[key];
            }
          }

          return nextList;
        });

      } catch (e) {
        // игнорируем парс ошибки
      }
    });

    return unsubscribe;
  }, [terminalId]);

  // cleanup all timers
  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(t => t && clearTimeout(t));
      timersRef.current = {};
    };
  }, []);

  return orderItems;
}