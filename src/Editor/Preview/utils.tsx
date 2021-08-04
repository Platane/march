import { generateGltf } from "../generate/generate";
import { useAsyncMemo } from "../../hooks/useAsyncMemo";
import type { Stage } from "../store/store";

export const useUpload = (body: ArrayBuffer | null) =>
  useAsyncMemo(async () => {
    if (!body) return;

    const { url } = await fetch(`/upload`, { method: "post", body }).then(
      (res) => {
        if (!res.ok) throw new Error(res.status.toString());
        return res.json();
      }
    );

    return url;
  }, [body]);

export const useGlb = (stage: Stage | null) =>
  useAsyncMemo(async () => {
    if (!stage) return null;

    const glb = await generateGltf(stage);

    return glb;
  }, [stage]);
