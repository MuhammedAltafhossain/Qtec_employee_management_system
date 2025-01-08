import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Employee from './pages/employee/Employee';
import Department from './pages/Department/Department';
import DepartmentAverageScore from './pages/Department/DepartmentAverageScore.jsx';
import PerformanceReview from './pages/PerformanceReview/PerformanceReview';

function App() {
  return (
    <Router>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li><Link to="/department">Department</Link></li>
              <li><Link to="/employee">Employee</Link></li>
              <li><Link to="/performance">Employee Performance Score</Link></li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">Employee Management System</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><Link to="/">Department Average Score</Link></li>
            <li><Link to="/department">Department</Link></li>
            <li><Link to="/employee">Employee</Link></li>
            <li><Link to="/performance">Employee Performance Score</Link></li>
          </ul>
        </div>
       
      </div>

      {/* Define Routes */}
      <Routes>
        <Route path="/" element={<DepartmentAverageScore/>} />
        <Route path="/department" element={<Department/>} />
        <Route path="/employee" element={<Employee/>} />
        <Route path="/performance" element={<PerformanceReview />} />
      </Routes>
    </Router>
  );
}

export default App;
