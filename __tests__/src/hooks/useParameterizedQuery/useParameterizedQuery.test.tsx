import React from 'react';
import { act, renderHook } from 'react-hooks-testing-library';

import { useParameterizedQuery } from '../../../../src/hooks/useParameterizedQuery/useParameterizedQuery';
import { QueryResponse, SuspenseCacheItem } from '../../../../src/client/client.types';
import { ClientContextProvider } from '../../../../src/context/clientContext/clientContextProvider';
import { createCache } from '../../../../src/cache/cache';

describe('useParameterizedQuery test', () => {
  const actionCreator: any = jest.fn((endpoint: string) => ({
    method: 'GET',
    endpoint,
  }));

  const fetchFunction: () => Promise<QueryResponse> = async () => ({
    error: false,
    status: 200,
    payload: {
      foo: 'bar',
    },
  });

  const client = {
    query: fetchFunction,
    suspenseCache: createCache<SuspenseCacheItem>(() => true, () => true),
  };

  const wrapper = ({ children }: any) => <ClientContextProvider client={client}>{children}</ClientContextProvider>;

  it('fetches resource and returns proper data on success', async () => {
    jest.useFakeTimers();

    let state: any = {};

    renderHook(
      () => {
        state = useParameterizedQuery(actionCreator);
      },
      {
        wrapper: wrapper,
      },
    );

    expect(state.loading).toEqual(false);
    expect(state.error).toEqual(false);
    expect(state.payload).toEqual(undefined);

    act(() => {
      state.query();
    });

    expect(state.loading).toEqual(true);

    act(() => {
      jest.runAllTimers();
    });

    expect(state.loading).toEqual(false);
    expect(state.payload).toEqual({
      foo: 'bar',
    });

    act(() => {
      state.reset();
    });

    expect(state.payload).toEqual(undefined);
  });
});
