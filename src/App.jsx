import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Feeds from "./components/feeds/Feeds";
import Leaves from "./pages/Leaves";
import Jobs from "./pages/Jobs";
import Departments from "./pages/Departments";
import DepartmentDetail from "./pages/DepartmentDetail"; // Assuming this is a new page for department details
import JobDetails from "./pages/JobDetails";
import Payroll from "./pages/Payroll";
import Policies from "./pages/Policies";

import "./App.css";
import Users from "./pages/Users";
import UserProvider from "./context/UserProvider";

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          {/* MainLayout used as a wrapper for internal app routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="leaves" element={<Leaves />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/:jobId" element={<JobDetails />} />
            <Route path="departments/:deptId" element={<DepartmentDetail />} />
            <Route path="users" element={<Users />} />
            <Route path="departments" element={<Departments />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="/policies" element={<Policies />} />
            {/* Optionally, add a 404 */}
            <Route
              path="*"
              element={<div className="p-8 text-red-500">404 Not Found</div>}
            />
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
