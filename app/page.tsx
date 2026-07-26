import connectdb from "./config/mongodbconnection.js";
import Homee from "../app/components/ui/Home/Home.jsx";
export default function Home() {
  connectdb();
  return (
    <div>
      <Homee />
    </div>
  );
}
