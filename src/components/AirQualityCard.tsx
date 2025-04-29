import DataCard, { DataCardProps } from "@/components/DataCard";
import { Mist } from "tabler-icons-react";
import { AirQualityType } from "@/types/realtime";
import DataItems from "@/components/DataItems";
import GaugeChart from "./GaugeChart";

export interface AirQualityCardProps extends Omit<DataCardProps, "icon" | "title"> {
  data?: AirQualityType;
}

export function getAQIColor(aqi?: number): string {
  if (aqi == undefined) return "#ffffff4c";
  if (aqi <= 50) return "#2bd92b";
  if (aqi <= 100) return "#ecc40e";
  if (aqi <= 150) return "#ff7e00";
  if (aqi <= 200) return "#e53737";
  if (aqi <= 300) return "#99004c";
  return "#7e0023";
}

export function getAQIText(aqi?: number): string {
  if (aqi == undefined) return "--";
  if (aqi <= 50) return "优";
  if (aqi <= 100) return "良";
  if (aqi <= 150) return "轻度污染";
  if (aqi <= 200) return "中度污染";
  if (aqi <= 300) return "重度污染";
  return "严重污染";
}

export default function AirQualityCard({ data, ...props }: AirQualityCardProps) {
  const aqi = data?.aqi?.chn;

  return (
    <DataCard
      {...props}
      icon={<Mist size={14} />}
      title="空气质量">
      <div className="flex flex-row h-full justify-around items-center gap-4">
        <div className="flex items-center justify-center h-[120px] w-[120px]">
          <GaugeChart
            value={aqi ?? 0}
            max={500}
            color={getAQIColor(aqi)}
            label={getAQIText(aqi)}
          />
        </div>
        <div className="flex items-center justify-center">
          <DataItems
            spacing={"xs"}
            data={[
              {
                title: (
                  <span>
                    PM<sub>10</sub>
                  </span>
                ),
                value: data?.pm10,
              },
              {
                title: (
                  <span>
                    NO<sub>2</sub>
                  </span>
                ),
                value: data?.no2,
              },
              {
                title: (
                  <span>
                    O<sub>3</sub>
                  </span>
                ),
                value: data?.o3,
              },
            ]}
            fallback="--"
          />
        </div>
        <div className="flex items-center justify-center">
          <DataItems
            spacing={"xs"}
            data={[
              {
                title: (
                  <span>
                    PM<sub>2.5</sub>
                  </span>
                ),
                value: data?.pm25,
              },
              {
                title: (
                  <span>
                    SO<sub>2</sub>
                  </span>
                ),
                value: data?.so2,
              },
              { title: <span>CO</span>, value: data?.co },
            ]}
            fallback="--"
          />
        </div>
      </div>
    </DataCard>
  );
}
