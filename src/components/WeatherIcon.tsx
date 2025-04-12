import { HTMLAttributes } from "react";
import { cls } from "@/utils/helper";
import { SkyConType } from "@/types/skycon";

export type IconType =
  | "baoyu"
  | "baitianduoyun"
  | "baoxue"
  | "daxue"
  | "dabaoyu"
  | "baitianzhenxue"
  | "dayu"
  | "baitianzhenyu"
  | "dongyu"
  | "wu"
  | "qiangshachenbao"
  | "leizhenyubanyoubingbao"
  | "leizhenyu"
  | "shachenbao"
  | "tedabaoyu"
  | "fuchen"
  | "qing"
  | "xiaoxue"
  | "xiaoyu"
  | "yejianzhenxue"
  | "yangsha"
  | "wumai"
  | "yin"
  | "zhongyu"
  | "yujiaxue"
  | "zhongxue"
  | "yejianduoyun"
  | "yejianzhenyu"
  | "yejianqing";

const skyconMap: Record<SkyConType, IconType> = {
  CLEAR_DAY: "qing",
  CLEAR_NIGHT: "yejianqing",
  PARTLY_CLOUDY_DAY: "baitianduoyun",
  PARTLY_CLOUDY_NIGHT: "yejianduoyun",
  CLOUDY: "yin",
  LIGHT_HAZE: "wumai",
  MODERATE_HAZE: "wumai",
  HEAVY_HAZE: "wumai",
  LIGHT_RAIN: "xiaoyu",
  MODERATE_RAIN: "zhongyu",
  HEAVY_RAIN: "dayu",
  STORM_RAIN: "baoyu",
  FOG: "wu",
  LIGHT_SNOW: "xiaoxue",
  MODERATE_SNOW: "zhongxue",
  HEAVY_SNOW: "daxue",
  STORM_SNOW: "baoxue",
  DUST: "fuchen",
  SAND: "qiangshachenbao",
  WIND: "shachenbao",
};

export interface WeatherIconProps extends Omit<IconfontProps, "icon"> {
  skycon: SkyConType;
}

export default function WeatherIcon({ skycon, ...props }: WeatherIconProps) {
  return <Iconfont {...props} icon={`#weather-icon-${skyconMap[skycon]}`} />;
}

interface IconfontProps extends HTMLAttributes<HTMLOrSVGElement> {
  icon: string;
}

function Iconfont({ icon, className, ...props }: IconfontProps) {
  return (
    <svg className={cls("iconfont", className)} aria-hidden="true" {...props}>
      <use xlinkHref={icon} />
    </svg>
  );
}
