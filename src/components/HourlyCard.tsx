import { HourlyData } from "@/types/hourly";
import DataCard, { DataCardProps } from "@/components/DataCard";
import { Clock } from "tabler-icons-react";
import { Box, Center, ScrollArea, SimpleGrid, Stack, Text } from "@mantine/core";
import { useMemo } from "react";
import { SkyConType } from "@/types/skycon";
import WeatherIcon from "@/components/WeatherIcon";
import AQIBadge from "@/components/AQIBadge";
import { AreaChart2, PlotData } from "./AreaChart";

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
    const d = Array.from(
      { length: data?.temperature.length ?? 0 },
      (_, i) =>
        ({
          time: data!.temperature[i].datetime,
          temperature: data!.temperature[i].value,
          skycon: data!.skycon[i].value,
          aqi: data!.air_quality.aqi[i].value.chn,
        }) as PlotData,
    );
    console.log(JSON.stringify(d));
    return d;
  }, [data]);

  return (
    <DataCard
      {...props}
      icon={<Clock size={14} />}
      title="48小时预报">
      <Box className="h-full flex flex-col justify-between">
        {data ? (
          <>
            <Text align="center">{data?.description}</Text>
            <ScrollArea
              mx={-12}
              mb={-8}
              scrollbarSize={6}
              styles={(_theme) => ({
                scrollbar: {
                  '&[data-orientation="horizontal"]': {
                    transition: "height 150ms ease-in-out",
                  },
                  '&[data-orientation="horizontal"]:hover': {
                    height: "8px",
                    transition: "height 150ms ease-in-out",
                    background: "rgba(255,255,255,0.1)",
                  },
                },
              })}>
              <Box
                h={100}
                w={3400}>
                <AreaChart2
                  skycon={skycon}
                  plotData={plotData}
                  isNight={isNight}
                />
              </Box>
              <SimpleGrid
                w={3400}
                cols={plotData.length}
                pb={8}
                className="justify-items-center"
                spacing={0}>
                {plotData.map((data) => {
                  const date = new Date(data.time);
                  const hour = date.getHours();
                  return (
                    <Stack
                      spacing={4}
                      align="center"
                      key={data.time}>
                      <WeatherIcon
                        className="w-5 h-5"
                        skycon={data.skycon}
                      />
                      <AQIBadge
                        aqi={data.aqi}
                        short
                      />
                      <Text
                        size="xs"
                        opacity={0.8}>
                        {hour === 0
                          ? date.toLocaleDateString("zh-CN", {
                              month: "short",
                              day: "numeric",
                            })
                          : date.toLocaleTimeString("zh-CN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                      </Text>
                    </Stack>
                  );
                })}
              </SimpleGrid>
            </ScrollArea>
          </>
        ) : (
          <Center h={192}>暂无数据</Center>
        )}
      </Box>
    </DataCard>
  );
}
