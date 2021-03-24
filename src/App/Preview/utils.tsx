import { useEffect, useMemo, useState } from "react";
import { generateGltf } from "../../generate/generate";
import type { Stage } from "../store/store";

export const useUpload = (body: ArrayBuffer | null) => {
  const [result, setResult] = useState<{ body: ArrayBuffer; url: string }>();

  useEffect(() => {
    if (!body) return;

    fetch(`/upload`, { method: "post", body })
      .then((res) => res.text())
      .then((url) => setResult({ url, body }));
  }, [body]);

  return body === result?.body && result ? result.url : null;
};

export const useGlb = (stage: Stage | null) => {
  const [result, setResult] = useState<{ stage: Stage; glb: ArrayBuffer }>();

  useEffect(() => {
    if (!stage) return;

    generateGltf(stage).then((glb) => setResult({ glb, stage }));
  }, [stage]);

  return stage === result?.stage && result ? result.glb : null;
};

export const useObjectUrl = (
  binary: Blob | ArrayBuffer | null,
  type?: string
) => {
  const url = useMemo(() => {
    if (!binary) return;
    const blob = binary instanceof Blob ? binary : new Blob([binary], { type });
    return URL.createObjectURL(blob);
  }, [binary]);

  useEffect(() => {
    if (url) return () => URL.revokeObjectURL(url);
  }, [url]);

  return url;
};
