import type { NextRequest } from "next/server";
import { AMAP_WEB_KEY } from "@/utils/env";

export async function GET(req: NextRequest) {
  const key = AMAP_WEB_KEY;
  if (!key) {
    return Response.json(
      {
        message: "AMAP_WEB_KEY is not set",
      },
      {
        status: 500,
      },
    );
  }

  const coord = req.nextUrl.searchParams.get("coord") as string | undefined;
  if (!coord) {
    return Response.json(
      {
        message: "Coordinate is required",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const res = await fetch(
      `https://restapi.amap.com/v3/geocode/regeo?key=${key}&location=${coord}`,
    );
    return Response.json(await res.json());
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
