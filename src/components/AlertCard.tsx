import DataCard, { DataCardProps } from "@/components/DataCard";
import { WeatherAlertContent } from "@/types/alert";
import { AlertTriangle, ChevronUp } from "tabler-icons-react";
import { useState } from "react";
import { useElementSize } from "@mantine/hooks"; // Keep hook for height calculation
import { SimpleBadge } from "@/components/SimpleBadge"; // Assuming this is a custom/shadcn component
import clsx from "clsx"; // Use clsx for conditional classes

export interface AlertCardProps extends Omit<DataCardProps, "icon" | "title"> {
  data?: WeatherAlertContent[];
}

export default function AlertCard({
  data,
  className,
  ...props
}: AlertCardProps) {
  const [isHidden, setIsHidden] = useState(false);
  const { ref, height } = useElementSize();

  return (
    <DataCard
      className={clsx(className, "border-0!")}
      {...props}
      onTitleClick={() => setIsHidden((prev) => !prev)}
      icon={<AlertTriangle size={16} />}
      title="天气预警"
      titleBg={
        isHidden ? undefined : getLevelColor(data?.[0]?.code.slice(2, 4))
      }
      extra={
        <div className="flex items-center gap-2">
          {/* Badge with opacity transition */}
          <div
            className={clsx(
              "flex items-center transition-opacity duration-200",
              isHidden ? "opacity-100" : "opacity-0 invisible", // Use invisible to prevent interaction when hidden
            )}
          >
            {isHidden && <SimpleBadge>{data?.length ?? 0} 则</SimpleBadge>}
          </div>
          <button
            aria-label="Toggle alert details"
            className="flex h-5 w-5 items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700" // Basic styling, adjust as needed
          >
            <ChevronUp
              size={20}
              className={clsx(
                "transition-transform duration-200",
                isHidden ? "rotate-180" : "rotate-0",
              )}
            />
          </button>
        </div>
      }
    >
      {/* Accordion content area */}
      <div
        style={{ height: isHidden ? 0 : height }}
        className="overflow-hidden transition-[height] duration-200 -mx-3 last:-mb-2"
        // Removed mx={-12} -> adjust padding within DataCard or here if needed
      >
        <div ref={ref}>
          {data?.map((alert) => {
            const [type, level] = getAlertTypeLevel(alert.code);
            return (
              <div
                key={alert.alertId}
                className="border-t border-black/10 px-4 py-2 dark:border-white/10" // Replaced border-semi-transparent, px="md", py="sm"
                style={{
                  backgroundColor: getLevelColor(alert.code.slice(2, 4)),
                }} // Replaced bg prop
              >
                <div className="flex items-center justify-between gap-2"> {/* Replaced Group */}
                  <span className="font-bold"> {/* Replaced Text */}
                    {type}
                    {level}预警
                  </span>
                </div>
                <p className="mt-1 text-sm"> {/* Replaced Text */}
                  {alert.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </DataCard>
  );
}

// Helper functions remain the same
function getAlertType(type: string) {
  switch (type) {
    case "01":
      return "台风";
    case "02":
      return "暴雨";
    case "03":
      return "暴雪";
    case "04":
      return "寒潮";
    case "05":
      return "大风";
    case "06":
      return "沙尘暴";
    case "07":
      return "高温";
    case "08":
      return "干旱";
    case "09":
      return "雷电";
    case "10":
      return "冰雹";
    case "11":
      return "霜冻";
    case "12":
      return "大雾";
    case "13":
      return "霾";
    case "14":
      return "道路结冰";
    case "15":
      return "森林火险";
    case "16":
      return "雷雨大风";
    case "17":
      return "春季沙尘天气趋势";
    case "18":
      return "沙尘";
    default:
      return "未知";
  }
}

function getAlertLevel(level: string) {
  switch (level) {
    case "00":
      return "白色";
    case "01":
      return "蓝色";
    case "02":
      return "黄色";
    case "03":
      return "橙色";
    case "04":
      return "红色";
    default:
      return "";
  }
}

function getLevelColor(level?: string) {
  // Using rgba for background colors with opacity
  switch (level) {
    case "00":
      return "rgba(255,255,255,0.15)"; // White
    case "01":
      return "rgba(49,101,255,0.3)"; // Blue
    case "02":
      return "rgba(250,237,30,0.3)"; // Yellow
    case "03":
      return "rgba(247,141,25,0.4)"; // Orange
    case "04":
      return "rgba(215,47,40,0.4)"; // Red
    default:
      return "transparent";
  }
}

function getAlertTypeLevel(code: string) {
  const type = code.slice(0, 2);
  const level = code.slice(2, 4);
  return [getAlertType(type), getAlertLevel(level)];
}
