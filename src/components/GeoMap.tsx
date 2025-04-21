import { loadAmapSdk } from "@/utils/location";
import {
  HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ReGeocodeResult } from "@/types/location";
import { Plus } from "tabler-icons-react";
import useSWR from "swr";
import axios from "axios";
import { LocationType } from "@/app/page";
import { Button } from "@/components/ui/button";

export interface GeoMapProps extends HTMLAttributes<HTMLDivElement> {
  AMapKey: string;
  coordinate?: [number, number];
  onChangeCoord?: (coord: AMap.LngLat, info: ReGeocodeResult) => void;
  pinList?: LocationType[];
}

export function parsePosition(position?: string): [number, number] | undefined {
  if (!position) return undefined;
  return position.split(",").map((l) => Number(l)) as [number, number];
}

export default function GeoMap({
  AMapKey,
  coordinate,
  onChangeCoord,
  pinList,
  className,
  ...props
}: GeoMapProps) {
  const map = useRef<AMap.Map>();
  const marker = useRef<AMap.Marker>();
  const AMap = useRef<any>();

  const [lnglat, setLnglat] = useState<AMap.LngLat>();

  const { data: info, isLoading } = useSWR<ReGeocodeResult>(
    lnglat ? ["/api/geocode", lnglat.toString()] : null,
    async ([url, coord]: [string, string | undefined]) =>
      (await axios.get(url, { params: { coord } })).data,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const handleClick = useCallback((e: any) => {
    setLnglat(e.lnglat);
  }, []);

  const initMap = async () => {
    AMap.current = await loadAmapSdk(AMapKey, ["AMap.Geocoder"]);
    map.current = new AMap.current.Map("map-container", {
      mapStyle: "amap://styles/grey",
      touchZoomCenter: 0,
      zoom: 12,
    });
    map.current?.on("click", handleClick);
  };

  const addOrUpdateMarker = async (lnglat: AMap.LngLat | [number, number]) => {
    if (!map.current) return;
    if (marker.current) {
      map.current?.clearMap();
      marker.current = undefined;
    }
    if (!AMap.current) return;
    marker.current = new AMap.current.Marker({
      position: lnglat,
    });
    map.current?.add(marker.current as AMap.Overlay);
  };

  useEffect(() => {
    initMap();
    // Clean up map instance on unmount
    return () => {
      map.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Ensure initMap runs only once

  useEffect(() => {
    if (coordinate && map.current && AMap.current) {
      const currentCenter = map.current.getCenter();
      // Only set center and lnglat if the coordinate actually changed
      if (currentCenter?.getLng() !== coordinate[0] || currentCenter?.getLat() !== coordinate[1]) {
        map.current?.setCenter(coordinate);
        setLnglat(new AMap.current.LngLat(coordinate[0], coordinate[1]));
      }
    }
  }, [coordinate]); // Depend only on coordinate

  useEffect(() => {
    if (lnglat) {
      addOrUpdateMarker(lnglat);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lnglat]); // Depend only on lnglat

  return (
    <div className={className} {...props}>
      <div id="map-container" className="h-[400px]" />
      <p className="text-sm px-4 pt-4 pb-2">
        {isLoading ? "地址加载中..." : info?.regeocode?.formatted_address ?? "点击地图选择位置"}
      </p>
      <div className="flex items-center justify-between px-4 pb-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm">经度：{lnglat?.getLng().toFixed(5) ?? "未知"}</span>
          <span className="text-sm">纬度：{lnglat?.getLat().toFixed(5) ?? "未知"}</span>
        </div>
        {onChangeCoord ? (
          <Button
            variant="outline"
            size="sm" // Shadcn size prop
            disabled={
              !lnglat ||
              !info ||
              isLoading ||
              pinList?.some((pin) => {
                const pos = parsePosition(pin.lnglat);
                return pos && pos[0] === lnglat.getLng() && pos[1] === lnglat.getLat();
              })
            }
            onClick={
              lnglat && info ? () => onChangeCoord(lnglat, info) : undefined
            } // FIXME: white text on white background
          >
            <Plus className="mr-2 h-4 w-4" />
            添加
          </Button>
        ) : null}
      </div>
    </div>
  );
}
