import { HourlyData } from "@/types/hourly";
import DataCard, { DataCardProps } from "@/components/DataCard";
import { Clock } from "tabler-icons-react";
import { useMemo } from "react";
import { SkyConType } from "@/types/skycon";
import WeatherIcon from "@/components/WeatherIcon";
import AQIBadge from "@/components/AQIBadge";
import { AreaChart2, PlotData } from "./AreaChart";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export default function HourlyCard({
  data,
  skycon,
  isNight,
  ...props
}: Omit<DataCardProps, "icon" | "title"> & {
  data?: HourlyData;
  skycon?: SkyConType;
  isNight?: boolean;
}) {
  const plotData = useMemo(() => {
    return Array.from(
      { length: data?.temperature.length ?? 0 },
      (_, i) =>
        ({
          time: data!.temperature[i].datetime,
          temperature: data!.temperature[i].value,
          skycon: data!.skycon[i].value,
          aqi: data!.air_quality.aqi[i].value.chn,
        }) as PlotData,
    );
  }, [data]);

  return (
    <DataCard
      {...props}
      icon={<Clock size={14} />}
      title="48小时预报">
      <div className="h-full flex flex-col justify-between">
        {data ? (
          <>
            <div className="text-center">{data?.description}</div>
            <ScrollArea className="mx-[-12px] mb-[-8px] [&_[data-orientation=horizontal]]:transition-[height] [&_[data-orientation=horizontal]]:duration-150 [&_[data-orientation=horizontal]:hover]:h-2 [&_[data-orientation=horizontal]:hover]:bg-white/10">
              <div className="h-[100px] w-[3400px]">
                <AreaChart2
                  skycon={skycon}
                  plotData={plotData}
                  isNight={isNight}
                />
              </div>
              <div
                className="w-[3400px] pb-2 grid justify-items-center gap-0"
                style={{ gridTemplateColumns: `repeat(${plotData.length}, minmax(0, 1fr))` }}>
                {plotData.map((data) => {
                  const date = new Date(data.time);
                  const hour = date.getHours();
                  return (
                    <div
                      className="flex flex-col items-center gap-1"
                      key={data.time}>
                      <WeatherIcon
                        className="w-5 h-5"
                        skycon={data.skycon}
                      />
                      <AQIBadge
                        aqi={data.aqi}
                        short
                      />
                      <div className="text-xs opacity-80">
                        {hour === 0
                          ? date.toLocaleDateString("zh-CN", {
                              month: "short",
                              day: "numeric",
                            })
                          : date.toLocaleTimeString("zh-CN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                      </div>
                    </div>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </>
        ) : (
          <div className="justify-center h-48">暂无数据</div>
        )}
      </div>
    </DataCard>
  );
}
