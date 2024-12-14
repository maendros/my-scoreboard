import { prefetchTeams } from "@/lib/fetchTeams";
import { NextResponse } from "next/server";

const validateCronRequest = (req: Request) => {
  const authHeader = req.headers.get("authorization");
  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
};

export async function GET(req: Request) {
  if (!validateCronRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const teams = await prefetchTeams();
    return NextResponse.json({
      success: true,
      teamsCount: teams.length,
      message: "Teams cache has been refreshed by cron",
    });
  } catch (error: any) {
    console.error("Cron refresh error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
