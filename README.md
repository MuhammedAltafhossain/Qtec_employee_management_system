# Employee Management System

## Overview
This project is an Employee Management System that includes CRUD operations for employees, department management, performance reviews, and advanced querying with optimization. The application is built with ASP.NET Core for the backend and React.js for the frontend, with a focus on relational database design and performance considerations.

## Features
### Backend (ASP.NET Core)
1. **Employee CRUD Operations**:
   - Add, view, update, and soft-delete employees.
   - Employee fields include Name, Email, Phone, Department, Position, Joining Date, and Status.
   - Pagination for employee listing.

2. **Department Management**:
   - Add and manage departments with fields like Department Name, Manager, and Budget.
   - One-to-One relationship between Department Manager and Employee.
   - One-to-Many relationship between Departments and Employees.

3. **Performance Reviews**:
   - Record quarterly performance reviews for employees.
   - Fields include Employee ID, Review Date, Review Score (1-10), and Review Notes.
   - One-to-Many relationship between Employees and Performance Reviews.

4. **Advanced Query**:
   - Calculate the average performance score per department.
   - Exclude employees without performance reviews.

5. **Search and Filter**:
   - Search employees by Name.
   - Filter employees by Department, Position, and Performance Score range.
   - Pagination for efficient data loading.

### Frontend (React.js)
- Interactive interface to:
  - View, add, update, and delete employees.
  - Search and filter employees.
  - Display average performance score per department.
    - Seamless integration with the backend.

## Setup Instructions

### Backend Setup (ASP.NET Core)
1. **Prerequisites**:
   - Install [.NET 7 SDK](https://dotnet.microsoft.com/download).
   - Install SQL Server or use an alternative database provider.

2. **Clone Repository**:
   ```bash
   git clone (https://github.com/MuhammedAltafhossain/Qtec_employee_management_system)
   cd backend
   ```

3. **Database Setup**:
   - Create a SQL Server database named `EmployeeManagement`.
   - Run the provided SQL scripts (`/sql-scripts`) to create tables, relationships, and indexes.

4. **Configure Connection String**:
   - Update the `appsettings.json` file with your SQL Server connection string.
     ```json
     {
       "ConnectionStrings": {
         "DefaultConnection": "Server=YOUR_SERVER;Database=EmployeeManagement;User Id=YOUR_USERNAME;Password=YOUR_PASSWORD;"
       }
     }
     ```

5. **Run the Application**:
   ```bash
   dotnet restore
   dotnet build
   dotnet run
   ```
   - The backend will run at `http://localhost:5000`.

### Frontend Setup (React.js)
1. **Prerequisites**:
   - Install [Node.js](https://nodejs.org/).
   - Install a package manager like npm or yarn.

2. **Clone Repository**:
   ```bash
   git clone (https://github.com/MuhammedAltafhossain/Qtec_employee_management_system)
   cd frontend
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Environment Configuration**:
   - Create a `.env` file in the root directory and specify the backend API URL:
     ```env
     VITE_API_URL=https://localhost:7001/api/
     ```

5. **Run the Application**:
   ```bash
   npm start
   ```
   - The frontend will run at `http://localhost:7001`.

6. **Connecting Backend and Frontend**:
   - Ensure both backend (`http://localhost:7001`) and frontend (`http://localhost:5174/`) are running.
   - Verify API calls from the frontend are reaching the backend using browser developer tools.

## Documentation
### Repository Structure
- **Backend**: Contains the ASP.NET Core project for the API.
- **Frontend**: Contains the React.js project for the UI.
- **SQL Scripts**: Includes scripts for database creation and stored procedures.
