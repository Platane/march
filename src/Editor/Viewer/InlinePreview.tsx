import { styled } from "@linaria/react";
import { Html } from "@react-three/drei";
import React from "react";

export const InlinePreview = ({ canvas }: { canvas: HTMLElement }) => {
  return (
    <Html>
      <Container
        ref={(el) => el?.appendChild(canvas)}
        style={{ pointerEvents: "none" }}
      />
    </Html>
  );
};

const w = 64;

const Container = styled.div`
  & > canvas {
    border: solid 1px orange;
    position: relative;
    left: -${w / 2}px !important;
    top: -${w / 2}px !important;
    width: ${w}px !important;
    height: ${w}px !important;
  }
`;
