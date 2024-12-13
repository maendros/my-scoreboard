import { NextResponse } from "next/server";
import { prefetchTeams } from "@/lib/fetchTeams";

export const runtime = "edge";
export const preferredRegion = "fra1";

export async function GET() {
  try {
    const teams = await prefetchTeams();
    return NextResponse.json(teams);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
