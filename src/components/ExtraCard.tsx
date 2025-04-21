import DataCard, { DataCardProps } from "@/components/DataCard";
import { RealtimeData } from "@/types/realtime";
import {
  Cloud,
  DropletFilled2,
  Eye,
  Flare,
  Gauge,
  Radar2,
  Sun,
  Temperature,
  Umbrella,
} from "tabler-icons-react";
import { ReactNode } from "react";

export interface ExtraCardProps extends Omit<DataCardProps, "icon" | "title"> {
  data?: RealtimeData;
  // 降水概率
  probability?: number;
}

export default function ExtraCard({
  data,
  probability,
  ...props
}: ExtraCardProps) {
  return (
    <DataCard {...props} icon={<Flare size={14} />} title="其他数据">
      <div
        className="grid h-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3"
      >
        <StatDataDisplay
          icon={<Temperature size={16} />}
          title="体感温度"
          value={data?.apparent_temperature.toFixed(1)}
          uint="℃"
        />
        <StatDataDisplay
          icon={<DropletFilled2 size={16} />}
          title="湿度"
          value={
            data?.humidity != undefined
              ? (data.humidity * 100).toFixed(0)
              : "--"
          }
          uint="%"
        />
        <StatDataDisplay
          icon={<Eye size={16} />}
          title="能见度"
          value={data?.visibility}
          uint="km"
        />
        <StatDataDisplay
          icon={<Sun size={16} />}
          title="紫外线"
          value={data?.life_index.ultraviolet.index}
          uint={UVDescription(data?.life_index.ultraviolet.index)}
        />
        <StatDataDisplay
          icon={<Umbrella size={16} />}
          title="降水概率"
          value={probability}
          uint="%"
        />
        <StatDataDisplay
          icon={<Cloud size={16} />}
          title="云量"
          value={
            data?.cloudrate != undefined
              ? (data.cloudrate * 100).toFixed(0)
              : "--"
          }
          uint="%"
        />
        <StatDataDisplay
          icon={<Gauge size={16} />}
          title="气压"
          value={
            data?.pressure != undefined
              ? (data.pressure / 100).toFixed(1)
              : "--"
          }
          uint="hPa"
        />
        <StatDataDisplay
          icon={<Radar2 size={16} />}
          title="短波辐射"
          value={data?.dswrf.toFixed(1)}
          uint="W/m²"
        />
      </div>
    </DataCard>
  );
}

export interface StaticDataDisplayProps {
  icon: ReactNode;
  title: ReactNode;
  value?: ReactNode;
  uint?: ReactNode;
}

function StatDataDisplay({ icon, title, value, uint }: StaticDataDisplayProps) {
  return (
    <div className="flex flex-col justify-center">
      <div className="flex items-center space-x-1 opacity-80">
        {icon}
        <span className="text-sm">{title}</span>
      </div>
      <div className="flex items-end space-x-1">
        <span className="text-xl font-medium">
          {value ?? "--"}
        </span>
        <span className="pb-1 text-sm opacity-80">
          {uint}
        </span>
      </div>
    </div>
  );
}

function UVDescription(level?: number) {
  if (level === undefined) {
    return "未知";
  }
  switch (level) {
    case 0:
      return "无";
    case 1:
    case 2:
      return "很弱";
    case 3:
    case 4:
      return "弱";
    case 5:
    case 6:
      return "中等";
    case 7:
    case 8:
    case 9:
      return "强";
    case 10:
      return "很强";
    default:
      return "极强";
  }
}
