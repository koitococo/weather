"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

import useSWR from "swr";
import CityOverview from "@/components/CityOverview"; // Keep custom components
import AirQualityCard from "@/components/AirQualityCard"; // Keep custom components
import { WeatherData } from "@/types/weather";
import HourlyCard from "@/components/HourlyCard"; // Keep custom components
import WindCard from "@/components/WindCard"; // Keep custom components
import SunCard from "@/components/SunCard"; // Keep custom components
import ExtraCard from "@/components/ExtraCard"; // Keep custom components
import DailyCard from "@/components/DailyCard"; // Keep custom components
import { getWeatherBg, getWeatherBgColor } from "@/utils/weather";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { getLocation } from "@/utils/location";
import { GeolocationError, ReGeocodeResult } from "@/types/location";
import AlertCard from "@/components/AlertCard"; // Keep custom components
import { useLocalStorage } from "@mantine/hooks"; // Keep this hook for now, or replace with another solution like usehooks-ts
import { ChevronDown, ChevronUp, MoreHorizontal, MapPin, Trash2, Loader2 } from "lucide-react"; // Use lucide-react icons
import GeoMap, { parsePosition } from "@/components/GeoMap"; // Keep custom components
import { extractArrayOrString } from "@/utils/helper";
import { SimpleBadge } from "@/components/SimpleBadge"; // Keep custom component or replace with shadcn Badge/div
import { useAppContext } from "@/utils/ctx";
import clsx from "clsx";
import { DialogTitle } from "@radix-ui/react-dialog";

export interface LocationType {
  lnglat: string;
  province: string;
  city: string;
  district: string;
  street: string;
  address: string;
}

export default function Page() {
  const ctx = useAppContext();
  const { amap_js_key } = ctx;
  if (!amap_js_key) {
    throw new Error("AMapKey is required");
  }

  const { toast } = useToast();

  // 定位状态与错误
  const [locating, setLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<GeolocationError>();

  // 选择地点弹出层开启状态
  const [drawerOpened, setDrawerOpened] = useState(false);
  const openDrawer = () => setDrawerOpened(true);
  const closeDrawer = () => setDrawerOpened(false);

  // 我的地址
  const [myAddress, setMyAddress] = useState<ReGeocodeResult>();

  // 定位结果缓存
  const [myLngLat, setMyLngLat] = useLocalStorage<string>({
    key: "myLngLat",
    defaultValue: "",
  });

  // 当前坐标
  const [coord, setCoord] = useState<string>();

  const isManualLocated = coord !== myLngLat;

  // 收藏的地点列表
  const [locationList, setLocationList] = useLocalStorage<LocationType[]>({
    key: "location",
    defaultValue: [],
  });

  const addToLocationList = (location: LocationType) => {
    if (locationList.some((l) => l.lnglat === location.lnglat)) return;
    setLocationList([...locationList, location]);
  };

  const removeFromLocationList = (lnglat: string) => {
    setLocationList(locationList.filter((l) => l.lnglat !== lnglat));
  };

  const moveUpInLocationList = (lnglat: string) => {
    const index = locationList.findIndex((l) => l.lnglat === lnglat);
    if (index === 0) return;
    const newList = [...locationList];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    setLocationList(newList);
  };

  const moveDownInLocationList = (lnglat: string) => {
    const index = locationList.findIndex((l) => l.lnglat === lnglat);
    if (index === locationList.length - 1) return;
    const newList = [...locationList];
    [newList[index + 1], newList[index]] = [newList[index], newList[index + 1]];
    setLocationList(newList);
  };

  const {
    data,
    isLoading: weatherLoading,
    isValidating,
  } = useSWR<WeatherData>(
    coord ? ["/api/weather", coord] : null,
    async ([url, coord]: [string, string | undefined]) => (await axios.get(url, { params: { coord } })).data,
    { keepPreviousData: true },
  );
  const isLoading = weatherLoading || (!coord && !locationError);

  const {
    data: geoData,
    isLoading: geoFetching,
    mutate: mutateGeo,
  } = useSWR<ReGeocodeResult>(
    coord ? ["/api/geocode", coord] : null,
    async ([url, coord]: [string, string | undefined]) => (await axios.get(url, { params: { coord } })).data,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const handleGetLocation = async function () {
    setLocating(true);
    setLocationError(undefined);
    try {
      const result = await getLocation(amap_js_key);
      if (result !== undefined) {
        setMyLngLat(result.position.toString());
        setCoord(result.position.toString());
      }
    } catch (e) {
      const err = e as GeolocationError;
      setLocationError(err);

      const coordStorage = localStorage.getItem("coord");
      if (coordStorage) {
        setCoord(coordStorage);
      }

      console.log("定位失败:", err.message);
      toast({
        variant: "destructive",
        title: "定位失败",
        description: "请检查浏览器是否授予位置权限",
        // Shadcn toast styling is handled via its own variants and global CSS
      });
    }
    setLocating(false);
  };

  useEffect(() => {
    if (coord) {
      localStorage.setItem("coord", coord);
    }
  }, [coord]);

  useEffect(() => {
    if (myLngLat) {
      setCoord(myLngLat);
    }
  }, [myLngLat]);

  useEffect(() => {
    handleGetLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (geoData && !isManualLocated) {
      setMyAddress(geoData);
    }
  }, [geoData, isManualLocated]);

  const getCityAndDistrict = (info: ReGeocodeResult) => {
    const province = extractArrayOrString(info.regeocode.addressComponent.province);
    const cityData = info.regeocode.addressComponent.city;
    const city = Array.isArray(cityData) ? province : cityData;
    const districtData = info.regeocode.addressComponent.district;
    const district = extractArrayOrString(districtData);
    return [province, city, district];
  };

  const city = useMemo(() => {
    if (!geoData?.regeocode?.addressComponent) return undefined;
    return getCityAndDistrict(geoData).slice(1, 3);
  }, [geoData]);

  const street = useMemo(() => {
    if (geoData?.regeocode?.addressComponent) {
      return extractArrayOrString(geoData.regeocode.addressComponent.streetNumber.street);
    }
    return undefined;
  }, [geoData]);

  const [sunrise, sunset] = useMemo(() => {
    if (data?.result?.daily?.astro[0]) {
      const dateString = new Date().toISOString().split("T")[0];
      const astro = data.result.daily.astro[0];
      const sunrise = new Date(`${dateString}T${astro.sunrise.time}+08:00`);
      const sunset = new Date(`${dateString}T${astro.sunset.time}+08:00`);
      return [sunrise, sunset];
    }
    return [undefined, undefined];
  }, [data?.result?.daily?.astro]); // Dependency array simplified

  const isNight = !sunrise || !sunset ? undefined : new Date() >= sunset || new Date() < sunrise;
  const skycon = data?.result?.realtime?.skycon;

  return (
    <div className={`min-h-screen bg-fixed ${getWeatherBg(skycon, isNight)} text-white`}>
      <div className="container mx-auto px-4 py-4 lg:py-8">
        <CityOverview
          city={city?.join("")}
          street={street}
          fallbackCity={coord}
          temperature={data?.result?.realtime?.temperature}
          highTemperature={data?.result?.daily?.temperature[0].max}
          lowTemperature={data?.result?.daily?.temperature[0].min}
          skycon={skycon}
          locating={locating}
          geoLoading={geoFetching}
          showLocationIcon={locating || !isManualLocated}
          onGetLocation={openDrawer} // Trigger drawer open
          weatherValidating={isValidating}
        />
        {data?.result?.alert?.content.length ? (
          <AlertCard
            className="mt-4"
            data={data?.result?.alert?.content}
            loading={isLoading}
          />
        ) : null}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mt-4 lg:mt-6">
          <AirQualityCard
            data={data?.result?.realtime?.air_quality}
            loading={isLoading}
          />
          <HourlyCard
            data={data?.result?.hourly}
            skycon={skycon}
            isNight={isNight}
            loading={isLoading}
          />
          <DailyCard
            className="md:col-span-1" // Adjusted for grid layout
            data={data?.result?.daily}
            loading={isLoading}
          />
          <div className="grid grid-cols-1 gap-4 lg:gap-6">
            <div className="min-[360px]:grid grid-cols-2 max-[360px]:flex flex-col gap-4 lg:gap-6">
              <WindCard
                data={data?.result?.realtime?.wind}
                loading={isLoading}
              />
              <SunCard
                data={data?.result?.daily?.astro[0]}
                loading={isLoading}
              />
            </div>
            <ExtraCard
              data={data?.result?.realtime}
              probability={data?.result?.hourly?.precipitation[0].probability}
              loading={isLoading}
            />
          </div>
        </div>
        <div className="flex justify-center items-center mt-6 lg:mt-8 gap-2">
          <p className="text-sm">
            <a
              className="opacity-60 hover:opacity-100 transition-opacity"
              href="https://github.com/koitococo/weather"
              target="_blank"
              rel="noreferrer">
              GitHub
            </a>
          </p>
          <p className="text-xs opacity-60">·</p>
          <p className="text-sm">
            <span className="opacity-60">数据来源：</span>
            <a
              className="opacity-60 hover:opacity-100 transition-opacity"
              href="https://www.caiyunapp.com/"
              target="_blank"
              rel="noreferrer">
              彩云天气
            </a>
          </p>
        </div>
      </div>

      <Toaster />

      <Drawer
        open={drawerOpened}
        onOpenChange={setDrawerOpened}>
        <DrawerContent
          className={clsx(
            getWeatherBgColor(skycon, isNight),
            "bg-opacity-40 backdrop-blur text-white border-t border-white/20", // Adjusted styling
          )}>
          <DialogTitle />
          <div className="mx-auto w-full max-w-lg">
            <GeoMap
              className="pb-2 mt-2" // Keep existing class
              AMapKey={amap_js_key}
              coordinate={parsePosition(coord)}
              pinList={locationList}
              // setPinList={setLocationList}
              onChangeCoord={(c, info) => {
                const coordString = c.toString();
                setCoord(coordString);
                mutateGeo(info);
                const [province, city, district] = getCityAndDistrict(info);
                const street = extractArrayOrString(info.regeocode.addressComponent.streetNumber.street);
                const address = extractArrayOrString(info.regeocode.formatted_address);
                addToLocationList({
                  lnglat: coordString,
                  province: province ?? "",
                  city: city ?? "",
                  district: district ?? "",
                  address: address ?? "",
                  street: street ?? "",
                });
                closeDrawer();
              }}
            />
            <hr className="border-t border-white/20" /> {/* Replaced Divider */}
            {/* My Location Item */}
            <div
              className={clsx(
                "flex items-center px-5 py-2.5 cursor-pointer transition-colors",
                getWeatherBgColor(skycon, isNight, true), // Use hover variant color
                "!bg-opacity-0 hover:!bg-opacity-20", // Adjusted hover effect
                {
                  "!bg-opacity-20": !isManualLocated, // Active state
                  "opacity-50 cursor-not-allowed": locating, // Disabled state
                },
              )}
              onClick={() => {
                if (!locating) {
                  handleGetLocation().then(() => closeDrawer());
                }
              }}>
              <div className="mr-3 flex-shrink-0 w-5 h-5 flex items-center justify-center">
                {locating ? <Loader2 className="h-5 w-5 animate-spin" /> : <MapPin size={20} />}
              </div>
              <div className="flex-grow overflow-hidden">
                <div className="text-sm font-medium">{locating ? "定位中..." : "我的位置"}</div>
                <div className="text-xs opacity-80 truncate">{myAddress?.regeocode?.formatted_address ?? "未知"}</div>
              </div>
            </div>
            <hr className="border-t border-white/20" /> {/* Replaced Divider */}
            {/* Location List Items */}
            {locationList.map((item, index) => (
              <div
                key={item.lnglat}
                className={clsx(
                  "flex items-center px-5 py-2.5 cursor-pointer transition-colors",
                  getWeatherBgColor(skycon, isNight, true), // Use hover variant color
                  "!bg-opacity-0 hover:!bg-opacity-20", // Adjusted hover effect
                  { "!bg-opacity-20": item.lnglat === coord }, // Active state
                )}
                onClick={() => {
                  setCoord(item.lnglat);
                  closeDrawer();
                }}>
                <div className="mr-3 flex-shrink-0">
                  {/* Using SimpleBadge or replace with shadcn Badge/div */}
                  <SimpleBadge className="!px-1 min-w-[1.25rem]">{index + 1}</SimpleBadge>
                  {/* Example with shadcn Badge:
                  <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">{index + 1}</Badge>
                  */}
                </div>
                <div className="flex-grow overflow-hidden">
                  <div className="text-sm font-medium truncate">
                    {item.province ? `${item.city}${item.district} ${item.street}` : "坐标"}
                  </div>
                  <div className="text-xs opacity-80 truncate">{item.address || item.lnglat}</div>
                </div>
                <div className="ml-2 flex-shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/10" // Adjusted styling
                        onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className={clsx(
                        getWeatherBgColor(skycon, isNight),
                        "bg-opacity-80 backdrop-blur border-white/20 text-white", // Adjusted styling
                      )}>
                      <DropdownMenuItem
                        disabled={index === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          moveUpInLocationList(item.lnglat);
                        }}
                        className="cursor-pointer">
                        <ChevronUp className="mr-2 h-4 w-4" />
                        <span>上移</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={index === locationList.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          moveDownInLocationList(item.lnglat);
                        }}
                        className="cursor-pointer">
                        <ChevronDown className="mr-2 h-4 w-4" />
                        <span>下移</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/20" />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromLocationList(item.lnglat);
                        }}
                        className="text-red-400 focus:text-red-400 focus:bg-red-400/10 cursor-pointer">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>删除</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            {/* Optional: Add DrawerFooter if needed */}
            {/* <DrawerFooter> <Button>Submit</Button> <DrawerClose asChild> <Button variant="outline">Cancel</Button> </DrawerClose> </DrawerFooter> */}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
