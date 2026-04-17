import { useState, useCallback, useRef } from "react";


export type ApiStatus = "idle" | "loading" | "success" | "error";

export interface ApiState<T> {
  data: T | null;
  status: ApiStatus;
  error: string | null;
}

export interface UseApiReturn<T> extends ApiState<T> {
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isIdle: boolean;
}

export type ApiFn<T> = (...args: unknown[]) => Promise<T>;

const INITIAL_STATE = <T>(): ApiState<T> => ({
  data: null,
  status: "idle",
  error: null,
});


export function useApi<T>(fn: ApiFn<T>): UseApiReturn<T> {
  const [state, setState] = useState<ApiState<T>>(INITIAL_STATE<T>());

  const fnRef = useRef(fn);
  fnRef.current = fn;

  const execute = useCallback(async (...args: unknown[]): Promise<T | null> => {
    setState({ data: null, status: "loading", error: null });
    try {
      const result = await fnRef.current(...args);
      setState({ data: result, status: "success", error: null });
      return result;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setState({ data: null, status: "error", error: message });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE<T>());
  }, []);

  return {
    ...state,
    execute,
    reset,
    isLoading: state.status === "loading",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
  };
}


export function useMutation<T, P = unknown>(
  fn: (payload: P) => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (message: string) => void;
  }
) {
  const api = useApi<T>(fn as ApiFn<T>);

  const mutate = useCallback(
    async (payload: P): Promise<T | null> => {
      const result = await api.execute(payload);
      if (result !== null) {
        options?.onSuccess?.(result);
      }
      return result;
    },
    [api.execute]
  );

  const prevError = useRef<string | null>(null);
  if (api.error && api.error !== prevError.current) {
    prevError.current = api.error;
    options?.onError?.(api.error);
  }
  if (!api.error) prevError.current = null;

  return { ...api, mutate };
}