import { useEffect, useMemo } from "react";

/**
 * wrapper around URL.createObjectURL
 */
export function useObjectUrl(binary: Blob | ArrayBuffer | null, type?: string) {
  const url = useMemo(() => {
    if (!binary) return null;
    const blob = binary instanceof Blob ? binary : new Blob([binary], { type });
    return URL.createObjectURL(blob);
  }, [binary]);

  useEffect(() => {
    if (url) return () => URL.revokeObjectURL(url);
  }, [url]);

  return url;
}
