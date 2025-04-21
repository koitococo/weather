import { DailyAstroType } from "@/types/daily";
import DataCard, { DataCardProps } from "@/components/DataCard";
import { Sunrise, Sunset, Sunset2 } from "tabler-icons-react";
import DataItems from "@/components/DataItems";

export interface SunCardProps extends Omit<DataCardProps, "icon" | "title"> {
  data?: DailyAstroType;
}

export default function SunCard({ data, ...props }: SunCardProps) {
  return (
    <DataCard
      {...props}
      icon={<Sunset2 size={14} />}
      title="日出日落">
      <div className="h-full flex justify-center items-center">
        <div className="max-w-[160px] flex flex-col flex-grow w-full h-full justify-between items-center">
        <DataItems
          data={[
            {
              icon: <Sunrise size={16} />,
              title: "日出",
              value: data?.sunrise?.time,
            },
            {
              icon: <Sunset size={16} />,
              title: "日落",
              value: data?.sunset?.time,
            },
          ]}
          spacing={"xs"}
          fallback="--:--"
          align="center"
        />
        </div>
      </div>
    </DataCard>
  );
}
