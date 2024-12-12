import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale, // x-axis
  LinearScale, // y-axis
  PointElement, // points on the line
  LineElement, // actual line
  Title,
  Tooltip,
  Legend,
  BarElement
);
