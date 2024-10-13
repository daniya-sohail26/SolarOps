// import ButtonGradient from "./assets/svg/ButtonGradient";
// import Benefits from "./components/Benefits";
// import Collaboration from "./components/Collaboration";
// import Footer from "./components/Footer";
// import Header from "./components/Header";
// import Hero from "./components/Hero";
// import Pricing from "./components/Pricing";
// import Roadmap from "./components/Roadmap";
// import Services from "./components/Services";

// const App = () => {
//   return (
//     <>
//       <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
//         <Header />
//         <Hero />
//         <Benefits />
//         <Collaboration />
//         <Services />
//         <Pricing />
//         <Roadmap />
//         <Footer />
//       </div>

//       <ButtonGradient />
//     </>
//   );
// };

// export default App;

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";

import { themeSettings } from "./theme";

// Import components
import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import Collaboration from "./components/Collaboration";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import Roadmap from "./components/Roadmap";
import Services from "./components/Services";

// Import dashboard components
import Layout from "./scenes/Layout";
import Dashboard from "./scenes/Dashboard";
import AirQuality from "./scenes/AirQuality";
import Admin from "./scenes/Admin";
import Weather from "./scenes/Weather";
import CO2Emission from "./scenes/CO2Emission";
import TrafficFlowMap from "./scenes/TrafficFlowMap";
import WaterUsage from "./scenes/WaterUsage";
import EnergyConsumption from "./scenes/EnergyConsumption";
import ParkingAvailability from "./scenes/ParkingAvailability";

// Landing page component
const LandingPage = () => {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Hero />
        <Benefits />
        <Collaboration />
        <Services />
        <Pricing />
        <Roadmap />
        <Footer />
      </div>
      <ButtonGradient />
    </>
  );
};

// Define routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<LandingPage />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/airquality" element={<AirQuality />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/co2emissions" element={<CO2Emission />} />
        <Route path="/trafficflow" element={<TrafficFlowMap />} />
        <Route path="/waterusage" element={<WaterUsage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/energy-consumption" element={<EnergyConsumption />} />
        <Route path="/parkingavailability" element={<ParkingAvailability />} />
      </Route>
    </>
  )
);

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;

