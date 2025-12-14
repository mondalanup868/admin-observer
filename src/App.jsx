import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import InspectionDetails from "./components/InspectionDetails";
import Alerts from "./components/Alerts";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/details/:id" element={<InspectionDetails />} />
    </Routes>
  );
}
