import { DEFAULT_COORD } from "@/utils/env";
import { NextRequest } from "next/server";
import MockData from "@/mock/weather2.json";
import fs from "node:fs";
const use_mock = true;

export async function GET(req: NextRequest) {
  // const token = process.env.WEATHER_TOKEN;
  // if (!token) {
  //   return Response.json(
  //     {
  //       message: "WEATHER_TOKEN is not set",
  //     },
  //     {
  //       status: 500,
  //     },
  //   );
  // }

  const coord = req.nextUrl.searchParams.get("coord") ?? DEFAULT_COORD;
  if (!coord) {
    return Response.json(
      {
        message: "coord is required",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const data = await (async () => {
      if (use_mock) {
        return MockData;
      }
      // const res = await fetch(`https://api.caiyunapp.com/v2.6/${token}/${coord}/weather.json?alert=true&dailysteps=10`);
      const CACHE_DIR = process.env.CACHE_DIR;
      if (CACHE_DIR) {
        const cacheFile = `${CACHE_DIR}/weather-${coord}.json`;
        if (fs.existsSync(cacheFile)) {
          if (fs.statSync(cacheFile).mtimeMs > Date.now() - 24 * 60 * 60 * 1000) {
            return JSON.parse(fs.readFileSync(cacheFile, "utf-8"));
          } else {
            fs.unlinkSync(cacheFile);
          }
        }
        const res = await fetch(`https://weather.hawa130.com/api/weather?coord=${coord}`);
        const data = await res.json();
        fs.writeFileSync(cacheFile, JSON.stringify(data));
        return data;
      } else {
        console.log("CACHE_DIR is not set");
      }
      const res = await fetch(`https://weather.hawa130.com/api/weather?coord=${coord}`);
      return await res.json();
    })();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      {
        message: `${error}`,
      },
      {
        status: 500,
      },
    );
  }
}
