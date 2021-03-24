import { styled } from "@linaria/react";
import { useState } from "react";
import { Stage, useStore } from "../store/store";
import { useGlb, useObjectUrl, useUpload } from "./utils";

export const Preview = () => {
  const [stage, setStage] = useState<Stage>();

  const onStart = () => setStage(useStore.getState().stages[0]);

  const glb = useGlb(stage ?? null);
  const remoteUrl = useUpload(glb);
  const objectUrl = useObjectUrl(glb, "model/gltf-binary");
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
