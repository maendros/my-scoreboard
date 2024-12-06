import cron from "node-cron";
import fetch from "node-fetch";

interface FetchTeamsResponse {
  success: boolean;
  message?: string;
  teams?: any[];
}

const fetchTeams = async () => {
  console.log("Running local cron job to fetch teams...");
  try {
    const response = await fetch(
      "http://localhost:5000/api/fetch-gaming-teams"
    );
    const data = (await response.json()) as FetchTeamsResponse;

    if (typeof data?.success !== "boolean") {
      throw new Error(
        "Invalid response format: 'success' field is missing or invalid."
      );
    }

    console.log("Fetched teams successfully:", data?.success);
  } catch (error) {
    console.error("Error during cron job:", error);
  }
};
fetchTeams();

cron.schedule("*/5 * * * *", fetchTeams);
