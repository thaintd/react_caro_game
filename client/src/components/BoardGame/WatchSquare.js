import React from "react";
import { Rect, Text } from "react-konva";

const WatchSquare = ({ rowIndex, colIndex, squareSize, onClick, value, currentPlayer }) => {
  const handleClick = () => {
    if (currentPlayer === "X" && !value) {
      onClick(rowIndex, colIndex);
    }
  };

  let color = "#165470";
  if (value === "X") {
    color = "#CC564E";
  }

  return (
    <>
      <Rect x={colIndex * squareSize} y={rowIndex * squareSize} width={squareSize} height={squareSize} fill={"#ECCC99"} stroke={"#CBAD7B"} onClick={handleClick} />
      <Text x={colIndex * squareSize + squareSize / 2} y={rowIndex * squareSize + squareSize / 2} text={value} fontSize={28} fontFamily="Arial" fontStyle="600" fill={color} align="center" verticalAlign="middle" offsetY={10} offsetX={8} />
    </>
  );
};

export default WatchSquare;
