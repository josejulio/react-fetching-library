import { QueryResponse } from "../client/client.types";
import { Action } from "../client/action.types";

export type Cache<T> = {
  add: (action:Action<any>, value: T) => void;
  remove: (action:Action<any>) => void;
  get: (action:Action<any>) => T | undefined ;
  items: { [key: string]: T },
};
