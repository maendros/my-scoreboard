import cron from "node-cron";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const fetchTeams = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/refresh-teams", {
      method: "GET",
    });

    const data = await response.json();
    console.log("Cron job result:", data);
  } catch (error) {
    console.error("Cron job failed:", error);
  }
};

// Schedule task to run every 3 months
cron.schedule("0 0 1 */3 *", () => {
  console.log("Running teams fetch cron job");
  fetchTeams();
});

// Initial fetch
fetchTeams();
