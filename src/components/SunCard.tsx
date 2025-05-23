import type { DailyAstroType } from "@/types/daily";
import DataCard, { type DataCardProps } from "@/components/DataCard";
import { Sunrise, Sunset, Sunset2 } from "tabler-icons-react";
import DataItems from "@/components/DataItems";

export default function SunCard({
  data,
  ...props
}: Omit<DataCardProps, "icon" | "title"> & {
  data?: DailyAstroType;
}) {
  return (
    <DataCard
      {...props}
      icon={<Sunset2 size={14} />}
      title="日出日落">
      <div className="h-full flex justify-center items-center">
        <div className="flex flex-col grow w-full justify-between items-center max-w-[200px] ">
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
