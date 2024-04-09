import { Routes, Route } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import CityList from "../CityList/CityList";
import Detail from "../Detail/Detail";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <Header />
      <div className="main">
        <Routes>
          <Route path="/*" element={<CityList />}/>
          <Route path="/detail" element={<Detail />}/>
        </Routes>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
