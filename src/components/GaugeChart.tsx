import React from "react";

function GaugeChart({
  value,
  max = 100,
  min = 0,
  label = "",
  size = 120,
  thickness = 12,
  trackerColor: trackColor = "#F0F0F040",
  color = "#f0f0f0",
  labelColor = "#f0f0f0",
}: {
  value: number;
  max?: number;
  min?: number;
  label?: string;
  size?: number;
  thickness?: number;
  trackerColor?: string;
  color?: string;
  labelColor?: string;
}) {
  const precent = Math.min(Math.max((value - min) / (max - min), 0), 1);

  const width = size;
  const height = (size / 9) * 8;
  const centerX = width / 2;
  const centerY = width / 2;
  const radius = (width / 2) * 0.85;

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number,
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const arc = (startAngle: number, endAngle: number, radius: number) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  return (
    <div style={{ width: width, height: height, position: "relative" }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <path
          d={arc(-135, 135, radius)}
          fill="none"
          stroke={trackColor}
          strokeWidth={thickness}
          strokeLinecap="round"
        />

        <path
          d={
            precent > 0.5
              ? arc(-135, precent * 270 - 135, radius)
              : arc(225, precent * 270 - 135, radius)
          }
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
        />

        {precent && (
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            fontSize={size * 0.2}
            fontWeight={"medium"}
            fill="#ffffff"
          >
            {value}
          </text>
        )}

        {label && (
          <text
            x={centerX}
            y={centerY + radius * 0.45}
            textAnchor="middle"
            fontSize={size * 0.12}
            fill={labelColor}
          >
            {label}
          </text>
        )}
      </svg>
    </div>
  );
}

export default GaugeChart;
