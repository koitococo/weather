import { Inter } from "next/font/google";
import { getWeatherBgColor } from "@/utils/weather";
import { getSkyConText, SkyConType } from "@/types/skycon";
import AQIBadge from "@/components/AQIBadge";
import React from "react";
import { AreaChart as ReChartsAreaChart, Area, ResponsiveContainer, LabelList } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });


export type PlotData = {
  time: string;
  temperature: number;
  skycon: SkyConType;
  aqi: number;
};


function AreaChartTooltip({ data, skycon, isNight }: { data: PlotData; skycon?: SkyConType; isNight?: boolean }) {
  const date = new Date(data.time);
  return (
    <div
      style={inter.style}
      className={clsx(
        skycon ? `${getWeatherBgColor(skycon, isNight)}` : "bg-black bg-opacity-90",
        "py-2 px-3 rounded-lg border-t border-semi-transparent-dark text-white",
      )}>
      <div className="text-xs whitespace-nowrap opacity-80">
        {date.toLocaleString("zh-CN", {
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        })}
      </div>
      <div className="whitespace-nowrap">
        <span className="text-lg font-medium">{data.temperature.toFixed(0) ?? "--"}°</span>
        <span className="ml-1 text-sm">{getSkyConText(data.skycon)}</span>
      </div>
      <div className="text-xs whitespace-nowrap">
        <AQIBadge
          data-aqi={data.aqi}
          aqi={data.aqi}
          showVal
        />
      </div>
    </div>
  );
}

export function AreaChart2({
  plotData,
  skycon,
  isNight,
}: { plotData: PlotData[]; skycon?: SkyConType; isNight?: boolean }) {
  return (
    <ResponsiveContainer>
      <ChartContainer
        config={{
          temperature: {
            label: "温度",
          },
          aqi: {
            label: "AQI",
          },
          time: {
            label: "时间",
          },
        }}>
        <ReChartsAreaChart
          accessibilityLayer
          data={plotData}
          margin={{
            top: 24,
            right: 32,
            left: 32,
            bottom: 0,
          }}>
          <defs>
            <linearGradient
              id="fillGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1">
              <stop
                offset="0%"
                stopColor="#fff"
                stopOpacity={1}
              />
              <stop
                offset="80%"
                stopColor="#fff"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <ChartTooltip
            cursor={false}
            defaultIndex={1}
            content={
              <ChartTooltipContent
                nameKey="time"
                customRenderer={(item, index) => {
                  return (
                    <AreaChartTooltip data={item.payload} skycon={skycon} isNight={isNight} key={`area-chart-tooltip-${index}`}/>
                  );
                }}
              />
            }
          />
          <Area
            dataKey="temperature"
            type="natural"
            fill="url(#fillGradient)"
            dot={{
              fill: "#fff",
            }}
            stroke="#fff"
            activeDot={{
              r: 4,
            }}>
            <LabelList
              position="top"
              fillOpacity={1}
              dataKey="temperature"
              offset={12}
              fontSize={14}
              formatter={(value: number) => `${value.toFixed(0)}°`}
              fill="#fff"
            />
          </Area>
        </ReChartsAreaChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}
