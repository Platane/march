import React from "react";
import { styled } from "@linaria/react";
import { useStore } from "../store/store";

const tools = [null, "translate", "rotate", "scale"] as const;

export const ViewerUi = () => {
  const currentTool = useStore((s) => s.currentTool);
  const selectTool = useStore((s) => s.selectTool);

  return (
    <Container>
      {tools.map((tool) => (
        <Button
          key={tool}
          style={{ fontWeight: tool === currentTool ? "bold" : "normal" }}
          onClick={() => selectTool(tool)}
        >
          {tool || " -- "}
        </Button>
      ))}
    </Container>
  );
};
const Container = styled.div`
  top: 0;
  left: calc(50% - 20px);
  position: fixed;
`;

const Button = styled.button`
  padding: 4px;
`;
