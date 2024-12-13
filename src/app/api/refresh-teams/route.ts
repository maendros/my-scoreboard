import { prefetchTeams } from "@/lib/fetchTeams";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  try {
    const teams = await prefetchTeams();
    return NextResponse.json({
      success: true,
      teamsCount: teams.length,
      message: "Teams cache has been refreshed",
    });
  } catch (error: any) {
    console.error("Error refreshing teams:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
