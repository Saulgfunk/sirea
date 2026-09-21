import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../api/client';

type State<T> = { data: T | undefined; loading: boolean; error: string | null };

// Deliberately minimal — no caching, no retries, no react-query. Reaching for
// a data-fetching library felt like more machinery than this screen count
// warrants right now; revisit if the number of screens/refetch needs grows.
export function useApi<T>(fetcher: () => Promise<T>, deps: ReadonlyArray<unknown> = []) {
  const [state, setState] = useState<State<T>>({ data: undefined, loading: true, error: null });

  const run = useCallback(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    fetcher()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err instanceof ApiError ? err.message : 'Something went wrong';
        setState({ data: undefined, loading: false, error: message });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => run(), [run]);

  return { ...state, refetch: run };
}
