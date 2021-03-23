import { styled } from "@linaria/react";
import { useEffect, useMemo, useState } from "react";
import { generateGltf } from "../../generate/generate";
import { Stage, useStore } from "../store/store";

export const Preview = () => {
  const [stage, setStage] = useState<Stage>();

  const onStart = () => setStage(useStore.getState().stages[0]);

  const glb = useGlb(stage ?? null);
  const remoteUrl = useUpload(glb);

  const objectUrl = useMemo(() => {
    if (!glb) return;
    const blob = new Blob([glb], { type: "model/gltf-binary" });
    return URL.createObjectURL(blob);
  }, [glb]);

  const viewerUrl =
    remoteUrl && `https://gltf-viewer.donmccurdy.com/#model=${remoteUrl}`;

  return (
    <Container>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Button onClick={onStart} disabled={stage && !glb}>
          generate
        </Button>

        {stage && (
          <Button
            style={{ marginLeft: "auto" }}
            onClick={() => setStage(undefined)}
          >
            ×
          </Button>
        )}
      </div>

      <div>
        {stage && !glb && <div>generating ...</div>}

        {objectUrl && (
          <A
            target="_blank"
            rel="noopener noreferrer"
            href={objectUrl}
            download={objectUrl.slice(objectUrl.lastIndexOf("/") + 1) + ".glb"}
          >
            gltf
          </A>
        )}

        {viewerUrl && (
          <A target="_blank" rel="noopener noreferrer" href={viewerUrl}>
            viewer url
          </A>
        )}
      </div>
    </Container>
  );
};

const A = styled.a`
  display: block;
  padding: 4px;
`;

const Container = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 10px;
  background-color: #eee;
  z-index: 3;
  min-width: 200px;
`;

const Button = styled.button`
  padding: 4px;
`;

export const useUpload = (body: Buffer | null) => {
  const [result, setResult] = useState<{ body: Buffer; url: string }>();

  useEffect(() => {
    if (!body) return;

    fetch(`/upload`, { method: "post", body })
      .then((res) => res.text())
      .then((url) => setResult({ url, body }));
  }, [body]);

  return body === result?.body && result ? result.url : null;
};

export const useGlb = (stage: Stage | null) => {
  const [result, setResult] = useState<{ stage: Stage; glb: Buffer }>();

  useEffect(() => {
    if (!stage) return;

    generateGltf(stage).then((glb) => setResult({ glb, stage }));
  }, [stage]);

  return stage === result?.stage && result ? result.glb : null;
};
