import Image from "next/image";
import Nav from "./Nav/nav.js";
import Topbar from "./topbar/topbar.js";

export default function Home() {
  return (
    <div>
      <div>
        <Topbar></Topbar>
      </div>
      <div>
        <Nav />
      </div>
    </div>
  );
}
