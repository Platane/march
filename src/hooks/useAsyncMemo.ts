/* eslint-disable react-hooks/rules-of-hooks */
import { useLayoutEffect, useState } from "react";

/**
 * same as useMemo, but the handler is asynchronous
 * returns null while the handler is pending
 */
export const useAsyncMemo = <T, D>(
  transform: () => T | Promise<T>,
  dependencies: D[]
) => {
  const [result, setResult] = useState<{ output: T; dependencies: D[] }>();

  const [error, setError] = useState<Error>();
  if (error) throw error;

  useLayoutEffect(() => {
    let canceled = false;

    Promise.resolve()
      .then(transform)
      .then((output) => {
        if (!canceled) setResult({ output, dependencies });
      })
      .catch(setError);

    return () => {
      canceled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return result && arrayEquals(result.dependencies, dependencies)
    ? result.output
    : null;
};

const arrayEquals = <T>(a: T[], b: T[]) =>
  a.length === b.length && a.every((_, i) => a[i] === b[i]);
