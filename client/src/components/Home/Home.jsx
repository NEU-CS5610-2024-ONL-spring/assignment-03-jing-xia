import { Routes, Route } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import CityList from "../CityList/CityList";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <Header />
      <div className="main">
        <Routes>
          <Route path="/citylist" element={CityList}/>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
