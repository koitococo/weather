import { DailyData } from "@/types/daily";
import DataCard, { DataCardProps } from "@/components/DataCard";
import { CalendarEvent } from "tabler-icons-react";
import { getSkyConText, SkyConType } from "@/types/skycon";
import { useMemo } from "react";
import WeatherIcon from "@/components/WeatherIcon";
import AQIBadge from "@/components/AQIBadge";
import { useElementSize } from "@mantine/hooks";

export type DailyRowData = {
  date?: string;
  skycon?: SkyConType;
  precipitation?: number;
  precipitationProbability?: number;
  temperature?: number;
  temperatureMax?: number;
  temperatureMin?: number;
  AQI?: number;
};

export interface DailyCardProps extends Omit<DataCardProps, "icon" | "title"> {
  data?: DailyData;
}

export default function DailyCard({ data, ...props }: DailyCardProps) {
  const [rows, minT, maxT] = useMemo(() => {
    let minTemperature: number | undefined = Infinity;
    let maxTemperature: number | undefined = -Infinity;
    return [
      Array.from({ length: data?.temperature.length ?? 10 }, (_, i): DailyRowData => {
        minTemperature =
          data?.temperature[i].min && minTemperature ? Math.min(minTemperature, data.temperature[i].min) : undefined;
        maxTemperature =
          data?.temperature[i].max && maxTemperature ? Math.max(maxTemperature, data.temperature[i].max) : undefined;
        return {
          date: data?.temperature[i].date,
          skycon: data?.skycon[i].value,
          precipitation: data?.precipitation[i].avg,
          precipitationProbability: data?.precipitation[i].probability,
          temperature: data?.temperature[i].avg,
          temperatureMax: data?.temperature[i].max,
          temperatureMin: data?.temperature[i].min,
          AQI: data?.air_quality.aqi[i].avg.chn,
        };
      }),
      minTemperature,
      maxTemperature,
    ];
  }, [data]);

  const { ref, width } = useElementSize();

  return (
    <DataCard
      ref={ref}
      {...props}
      icon={<CalendarEvent size={14} />}
      title={`10日预报`}>
      <div className="flex flex-col gap-2 text-sm">
        {rows.map((row, index) => {
          const date = row.date ? new Date(row.date) : new Date(Date.now() + 86400000 * index);
          const isToday = date.toDateString() === new Date().toDateString();
          const formattedDate = date.toLocaleDateString("zh-CN", {
            month: "2-digit",
            day: "2-digit",
          });
          const weekday = date.toLocaleDateString("zh-CN", { weekday: "short" });

          return (
            <div
              key={date.getTime()}
              className="flex items-center justify-between gap-2">
              {/* Date */}
              <div className="flex-shrink-0 w-[40px] sm:w-[80px] text-left">
                <span className="hidden sm:inline">{formattedDate} </span>
                <span>{isToday ? "今天" : weekday}</span>
              </div>

              {/* AQI Badge (visible on medium screens and up) */}
              {width > 320 && (
                <div className="flex-shrink-0 w-[80px] text-center">
                  <AQIBadge
                    aqi={row.AQI}
                    showVal={row.AQI != undefined}
                    short
                  />
                </div>
              )}

              {/* Weather Icon */}
              <div className={`flex-shrink-0 text-center ${width > 500 ? "w-[64px] text-right" : "w-[32px]"}`}>
                {row.skycon ? (
                  <WeatherIcon
                    className="w-5 h-5 inline-block"
                    skycon={row.skycon}
                  />
                ) : (
                  <span className="inline-block w-5 h-5"></span> // Placeholder for alignment
                )}
              </div>

              {/* Skycon Text (visible on large screens and up) */}
              {width > 500 && (
                <div className="flex-shrink-0 w-[64px] text-left opacity-80">
                  {row.skycon ? getSkyConText(row.skycon) : "--"}
                </div>
              )}

              {/* Min Temperature */}
              <div className="flex-shrink-0 w-[40px] text-right opacity-80">
                {row.temperatureMin?.toFixed(0) ?? "--"}°
              </div>

              {/* Temperature Indicator */}
              <div className="flex-grow min-w-[50px] sm:min-w-[120px]">
                <TemperatureIndicator
                  min={row.temperatureMin}
                  max={row.temperatureMax}
                  lower={minT}
                  upper={maxT}
                />
              </div>

              {/* Max Temperature */}
              <div className="flex-shrink-0 w-[40px] text-left">{row.temperatureMax?.toFixed(0) ?? "--"}°</div>
            </div>
          );
        })}
      </div>
    </DataCard>
  );
}

interface TemperatureIndicatorProps {
  min?: number;
  max?: number;
  lower?: number;
  upper?: number;
}

function TemperatureIndicator({ min, max, lower, upper }: TemperatureIndicatorProps) {
  const isValid = min != undefined && max != undefined && lower != undefined && upper != undefined;
  const [left, right] = isValid ? calcBoundary(lower, upper) : [0, 1];

  const bgSize = 300 / (right - left);
  const bgPos = ((left + 1) / 3) * 100;

  const mLeftPercent = isValid ? ((min - lower) / (upper - lower)) * 100 : 50;
  const mRightPercent = isValid ? ((upper - max) / (upper - lower)) * 100 : 50;

  return (
    <div className="relative temperature-indicator h-1 rounded-full overflow-hidden bg-semi-transparent-dark">
      <div
        className="transition-spacing duration-700"
        style={{
          height: "100%",
          marginLeft: `${mLeftPercent}%`,
          marginRight: `${mRightPercent}%`,
          clipPath: "inset(0 round 4px)",
        }}>
        <div
          className="absolute inset-0 bg-gradient-linear origin-left transition-transform duration-700"
          style={{ transform: `scaleX(${bgSize}%) translateX(-${bgPos}%)` }}
        />
      </div>
    </div>
  );
}

type CalcBoundaryConfig = {
  coldTemperature: number;
  hotTemperature: number;
  minGap: number;
};

function calcBoundary(
  lower: number,
  upper: number,
  config: CalcBoundaryConfig = {
    coldTemperature: -10,
    hotTemperature: 40,
    minGap: 0.2,
  },
): [number, number] {
  const { coldTemperature, hotTemperature, minGap } = config;
  let left = (lower - coldTemperature) / (hotTemperature - coldTemperature);
  let right = (upper - coldTemperature) / (hotTemperature - coldTemperature);

  // 调整间隔
  if (right - left < minGap) {
    const middle = (left + right) / 2;
    left = middle - minGap / 2;
    right = middle + minGap / 2;
  }

  left = Math.max(left, -1);
  right = Math.min(right, 2);

  return [left, right];
}
