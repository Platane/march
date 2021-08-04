import React, { useState } from "react";
import { styled } from "@linaria/react";
import { useStore } from "./store/store";

export const DropZone = () => {
  const [picked, setPicked] = useState(false);

  const { addStageFromFile } = useStore();

  const onChange = (event: any) => {
    setPicked(true);

    const [file] = event.target.files;

    addStageFromFile(file);
  };

  return (
    <Container>
      {!picked && (
        <>
          <InputFile type="file" onChange={onChange} />
          <Label>drop gltf</Label>
        </>
      )}

      {picked && <Label>loading</Label>}
    </Container>
  );
};

const Label = styled.div`
  font-size: 24px;
`;

const InputFile = styled.input`
  position: absolute;
  opacity: 0.01;
  top: -100px;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: calc(100% + 100px);
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`;
