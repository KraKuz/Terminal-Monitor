import { TrafficLightStatus } from "../types/TrafficLight";

export function trafficLightToClass(status: TrafficLightStatus | null) {
  switch (status) {
    case "Allowed":
    case "PartiallyAllowed":
      return "traffic-green";

    case "Prohibited":
    case "PartiallyProhibited":
      return "traffic-red";

    case "AdditionalAction":
    case "RepeatAction":
    case "Loading":
    case "Off":
    default:
      return "traffic-default";
  }
}