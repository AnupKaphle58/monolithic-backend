import { RouterClass } from "@src/classes";

export interface IRouteInterface {
  segment: string;
  provider: any | RouterClass;
  serializable?: boolean;
}
