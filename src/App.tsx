import { Suspense } from "react";
import { useRoutes, Routes, Route, Link, useLocation } from "react-router-dom";
import routes from "tempo-routes";
import QRScanner from "./components/QRScanner";
import ScanHistory from "./components/ScanHistory";
import Settings from "./components/Settings";
import {
  Home as HomeIcon,
  Clock,
  Settings as SettingsIcon,
} from "lucide-react";

function App() {
  const location = useLocation();

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="min-h-screen bg-gray-50">
        {/* For the tempo routes */}
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

        <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
          <div className="flex-1 overflow-auto pb-16">
            <Routes>
              <Route path="/" element={<QRScanner />} />
              <Route path="/history" element={<ScanHistory />} />
              <Route path="/settings" element={<Settings />} />
              {import.meta.env.VITE_TEMPO === "true" && (
                <Route path="/tempobook/*" element={null} />
              )}
            </Routes>
          </div>

          {/* Bottom Navigation */}
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2">
            <div className="max-w-md mx-auto flex justify-around">
              <Link
                to="/"
                className={`flex flex-col items-center p-2 ${location.pathname === "/" ? "text-blue-600" : "text-gray-500"}`}
              >
                <HomeIcon size={24} />
                <span className="text-xs mt-1">Scanner</span>
              </Link>
              <Link
                to="/history"
                className={`flex flex-col items-center p-2 ${location.pathname === "/history" ? "text-blue-600" : "text-gray-500"}`}
              >
                <Clock size={24} />
                <span className="text-xs mt-1">History</span>
              </Link>
              <Link
                to="/settings"
                className={`flex flex-col items-center p-2 ${location.pathname === "/settings" ? "text-blue-600" : "text-gray-500"}`}
              >
                <SettingsIcon size={24} />
                <span className="text-xs mt-1">Settings</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </Suspense>
  );
}

export default App;
