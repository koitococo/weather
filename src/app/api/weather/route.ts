import { DEFAULT_COORD } from "@/utils/env";
import { NextRequest } from "next/server";
import MockData from "@/mock/weather2.json";

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
    // const res = await fetch(`https://api.caiyunapp.com/v2.6/${token}/${coord}/weather.json?alert=true&dailysteps=10`);
    // const data = await res.json()
    const data = MockData;
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
