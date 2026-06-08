import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login/Login";
import Dashboard from "@/pages/Dashboard/Dashboard";
import ShelterList from "@/pages/Shelter/ShelterList";
import WarehouseManagement from "@/pages/Warehouse/WarehouseManagement";
import PersonnelTracking from "@/pages/Personnel/PersonnelTracking";
import EmergencyManagement from "@/pages/Emergency/EmergencyManagement";
import ReportCenter from "@/pages/Reports/ReportCenter";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<div />} />
          <Route path="/shelter" element={<ShelterList />} />
          <Route
            path="/warehouse"
            element={
              <ProtectedRoute allowedRoles={['站长', '指挥长', '市人防办']}>
                <WarehouseManagement />
              </ProtectedRoute>
            }
          />
          <Route path="/personnel" element={<PersonnelTracking />} />
          <Route
            path="/emergency"
            element={
              <ProtectedRoute allowedRoles={['指挥长', '市人防办']}>
                <EmergencyManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['站长', '指挥长', '市人防办']}>
                <ReportCenter />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
