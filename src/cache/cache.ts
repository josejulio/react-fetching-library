import { Action } from '../client/client.types';
import { Cache } from './cache.types';

export const convertActionToBase64 = (action: Action<any>) => {
  return Buffer.from(JSON.stringify(action)).toString('base64');
};

export const createCache = <T>(
  isCacheable: (action: Action<any, any>) => boolean,
  isValid: (response: T & { timestamp: number }) => boolean,
) => {
  let items: { [key: string]: any } = {};

  const add = (action: Action<any, any>, value: T) => {
    if (isCacheable(action)) {
      items[convertActionToBase64(action)] = { ...value, timestamp: Date.now() };
    }
  };

  const remove = (action: Action<any, any>) => {
    delete items[convertActionToBase64(action)];
  };

  const get = (action: Action<any, any>) => {
    const response = items[convertActionToBase64(action)];
    const valid = response && isValid(response);

    if (valid) {
      return response;
    }

    if (response && !valid) {
      remove(action);
    }
  };

  const setItems = (value: { [key: string]: any }) => {
    items = value;
  };

  const getItems = () => {
    return items;
  };

  return {
    add,
    get,
    getItems,
    remove,
    setItems,
  } as Cache<T>;
};
