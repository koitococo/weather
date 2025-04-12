"use client";

import React from "react";
import { AreaChart2, PlotData } from "@/components/AreaChart";

const data: PlotData[] = [
  { time: "2023-04-17T13:00+08:00", temperature: 24, skycon: "PARTLY_CLOUDY_DAY", aqi: 100 },
  { time: "2023-04-17T14:00+08:00", temperature: 23, skycon: "PARTLY_CLOUDY_DAY", aqi: 63 },
  { time: "2023-04-17T15:00+08:00", temperature: 23, skycon: "CLOUDY", aqi: 72 },
  { time: "2023-04-17T16:00+08:00", temperature: 22, skycon: "CLOUDY", aqi: 76 },
  { time: "2023-04-17T17:00+08:00", temperature: 20.67, skycon: "CLOUDY", aqi: 60 },
  { time: "2023-04-17T18:00+08:00", temperature: 20.33, skycon: "CLOUDY", aqi: 65 },
  { time: "2023-04-17T19:00+08:00", temperature: 20, skycon: "CLOUDY", aqi: 57 },
  { time: "2023-04-17T20:00+08:00", temperature: 19.3, skycon: "CLOUDY", aqi: 67 },
  { time: "2023-04-17T21:00+08:00", temperature: 17, skycon: "PARTLY_CLOUDY_NIGHT", aqi: 56 },
  { time: "2023-04-17T22:00+08:00", temperature: 15.1, skycon: "CLEAR_NIGHT", aqi: 50 },
  { time: "2023-04-17T23:00+08:00", temperature: 14.2, skycon: "CLOUDY", aqi: 50 },
  { time: "2023-04-18T00:00+08:00", temperature: 13.5, skycon: "CLOUDY", aqi: 50 },
  { time: "2023-04-18T01:00+08:00", temperature: 13.4, skycon: "FOG", aqi: 50 },
  { time: "2023-04-18T02:00+08:00", temperature: 13.3, skycon: "FOG", aqi: 50 },
  { time: "2023-04-18T03:00+08:00", temperature: 13.2, skycon: "FOG", aqi: 48 },
  { time: "2023-04-18T04:00+08:00", temperature: 13.1, skycon: "FOG", aqi: 47 },
  { time: "2023-04-18T05:00+08:00", temperature: 13, skycon: "FOG", aqi: 47 },
  { time: "2023-04-18T06:00+08:00", temperature: 13.2, skycon: "FOG", aqi: 45 },
  { time: "2023-04-18T07:00+08:00", temperature: 14.9, skycon: "CLOUDY", aqi: 44 },
  { time: "2023-04-18T08:00+08:00", temperature: 16.5, skycon: "CLOUDY", aqi: 44 },
  { time: "2023-04-18T09:00+08:00", temperature: 18.3, skycon: "CLOUDY", aqi: 42 },
  { time: "2023-04-18T10:00+08:00", temperature: 20, skycon: "CLOUDY", aqi: 41 },
  { time: "2023-04-18T11:00+08:00", temperature: 21.8, skycon: "CLOUDY", aqi: 41 },
  { time: "2023-04-18T12:00+08:00", temperature: 23.23, skycon: "CLOUDY", aqi: 48 },
  { time: "2023-04-18T13:00+08:00", temperature: 24.82, skycon: "CLOUDY", aqi: 62 },
  { time: "2023-04-18T14:00+08:00", temperature: 26.41, skycon: "CLOUDY", aqi: 45 },
  { time: "2023-04-18T15:00+08:00", temperature: 27.96, skycon: "CLOUDY", aqi: 56 },
  { time: "2023-04-18T16:00+08:00", temperature: 28, skycon: "CLOUDY", aqi: 73 },
  { time: "2023-04-18T17:00+08:00", temperature: 27.92, skycon: "CLOUDY", aqi: 68 },
  { time: "2023-04-18T18:00+08:00", temperature: 27.63, skycon: "CLOUDY", aqi: 77 },
  { time: "2023-04-18T19:00+08:00", temperature: 26.8, skycon: "CLOUDY", aqi: 71 },
  { time: "2023-04-18T20:00+08:00", temperature: 25.78, skycon: "CLOUDY", aqi: 46 },
  { time: "2023-04-18T21:00+08:00", temperature: 23.96, skycon: "CLOUDY", aqi: 44 },
  { time: "2023-04-18T22:00+08:00", temperature: 22.2, skycon: "CLOUDY", aqi: 45 },
  { time: "2023-04-18T23:00+08:00", temperature: 20.55, skycon: "CLOUDY", aqi: 48 },
  { time: "2023-04-19T00:00+08:00", temperature: 18.99, skycon: "CLOUDY", aqi: 51 },
  { time: "2023-04-19T01:00+08:00", temperature: 17.44, skycon: "CLOUDY", aqi: 53 },
  { time: "2023-04-19T02:00+08:00", temperature: 16.39, skycon: "CLOUDY", aqi: 56 },
  { time: "2023-04-19T03:00+08:00", temperature: 15.87, skycon: "PARTLY_CLOUDY_NIGHT", aqi: 56 },
  { time: "2023-04-19T04:00+08:00", temperature: 15.49, skycon: "PARTLY_CLOUDY_NIGHT", aqi: 57 },
  { time: "2023-04-19T05:00+08:00", temperature: 15.19, skycon: "PARTLY_CLOUDY_NIGHT", aqi: 58 },
  { time: "2023-04-19T06:00+08:00", temperature: 15, skycon: "CLOUDY", aqi: 57 },
  { time: "2023-04-19T07:00+08:00", temperature: 16.7, skycon: "CLOUDY", aqi: 56 },
  { time: "2023-04-19T08:00+08:00", temperature: 18.4, skycon: "CLOUDY", aqi: 56 },
  { time: "2023-04-19T09:00+08:00", temperature: 20.1, skycon: "CLOUDY", aqi: 55 },
  { time: "2023-04-19T10:00+08:00", temperature: 21.8, skycon: "PARTLY_CLOUDY_DAY", aqi: 55 },
  { time: "2023-04-19T11:00+08:00", temperature: 23.5, skycon: "PARTLY_CLOUDY_DAY", aqi: 55 },
  { time: "2023-04-19T12:00+08:00", temperature: 25.2, skycon: "PARTLY_CLOUDY_DAY", aqi: 53 },
];

export default function Page() {
  return (
    <div className="bg-gray-700">
      <div className="h-[30vh]">
        <AreaChart2
          isNight={false}
          skycon="LIGHT_HAZE"
          plotData={data}
        />
      </div>
    </div>
  );
}
