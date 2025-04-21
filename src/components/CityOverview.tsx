import { getSkyConText, SkyConType } from "@/types/skycon";
import { ChevronDown, ChevronUp, Location } from "tabler-icons-react";
import WeatherIcon from "@/components/WeatherIcon";
import { useMemo } from "react";

// A simple SVG spinner component
const Spinner = ({ className }: { className?: string }) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export interface CityOverviewProps {
  city?: string;
  street?: string;
  fallbackCity?: string;
  highTemperature?: number;
  lowTemperature?: number;
  temperature?: number;
  skycon?: SkyConType;
  onGetLocation?: () => void;
  locating?: boolean;
  geoLoading?: boolean;
  weatherValidating?: boolean;
  showLocationIcon?: boolean;
}

export default function CityOverview({
  city,
  street,
  fallbackCity,
  highTemperature,
  lowTemperature,
  temperature,
  skycon,
  onGetLocation,
  locating,
  geoLoading,
  weatherValidating,
  showLocationIcon,
}: CityOverviewProps) {
  const statusText = useMemo(() => {
    if (locating) return "定位中...";
    if (geoLoading) return "获取位置信息...";
    return undefined;
  }, [locating, geoLoading]);

  const isLoading = locating || geoLoading || weatherValidating;

  return (
    <div className="pt-1 pb-16 px-12 rounded-lg w-full">
      <button
        title="切换地点"
        className="w-full flex justify-center items-center gap-3 cursor-pointer rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors py-3 mb-12"
        onClick={onGetLocation}>
        {isLoading ? <Spinner className="w-4 h-4 text-white" /> : showLocationIcon ? <Location size={16} /> : null}
        <span className="whitespace-nowrap">{statusText ?? (city || fallbackCity) ?? "选择地点"}</span>
        <span className="whitespace-nowrap">{statusText ? undefined : street}</span>
      </button>
      <div className="flex justify-center items-center w-full">
        <div className="flex justify-between w-full max-w-sm ">
          <div className="flex flex-col items-center gap-1">
            {skycon ? (
              <WeatherIcon
                className="w-14 h-14"
                skycon={skycon}
              />
            ) : (
              <div className="w-14 h-14" /> // Placeholder
            )}
            <span className="text-sm">{skycon ? getSkyConText(skycon) : "--"}</span>
          </div>
          <div className="flex flex-col justify-center items-center">
            <span className="font-medium text-[58px] leading-none">
              {temperature?.toFixed(0) ?? "--"}
              {/* Using relative positioning for degree symbol */}
              <span className="relative top-[-0.2em] text-3xl align-baseline">°</span>
            </span>
            <div className="flex gap-4 mt-1">
              {" "}
              {/* Added margin-top */}
              <div className="flex items-center gap-1">
                <ChevronUp size={16} />
                <span className="whitespace-nowrap text-sm">{highTemperature?.toFixed(0) ?? "--"}℃</span>
              </div>
              <div className="flex items-center gap-1">
                <ChevronDown size={16} />
                <span className="whitespace-nowrap text-sm">{lowTemperature?.toFixed(0) ?? "--"}℃</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
