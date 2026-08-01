import connectdb from "./config/mongodbconnection.js";
import Homee from "../app/components/ui/Home/Home.jsx";
import Userprovider from "../app/context/Usercontext.jsx";
export default function Home() {
  connectdb();
  return (
    <div>
        <Homee />
    </div>
  );
}
