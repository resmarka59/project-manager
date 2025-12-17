# Projects-Tracker - Task Management System

This is a robust, full-stack task management application designed to help users track projects, manage tasks, and monitor upcoming deadlines through a professional, centralized dashboard.

## Tools & Technologies Used

Backend: Java 17+, Spring Boot 3 (Spring Security, Spring Data JPA, Hibernate).
Frontend: React.js (Vite), Material UI (MUI), Framer Motion, Axios.
Database: Pg4. 
Authentication: JWT (JSON Web Tokens).


## How to Run the Application

### 1. Database Setup
Before running the backend, you must configure the database.

1.  Open your pgadmin4 Workbench or Terminal.
2.  Create a new database (ensure this matches the name in your `application.properties`):
    ```sql
    CREATE DATABASE taskmanager_db;
    ```
3.  The application uses Hibernate `update` mode, so tables will be created automatically upon the first run.

### 2. Backend Setup (Java/Spring Boot)
1.  Navigate to the `backend` (or `server`) folder.
2.  Open the `src/main/resources/application.properties` file and update your  username and password:
    ```properties
    spring.datasource.username=YOUR_DB_USERNAME
    spring.datasource.password=YOUR_DB_PASSWORD
    ```
3.  Run the application:
    * **Using IDE (IntelliJ/Eclipse):** Run the `TaskManagerApplication.java` class.
    * **Using Terminal:**
        ```bash
        mvn spring-boot:run
        ```
4.  The backend will start on `http://localhost:8080`.

### 3. Frontend Setup (React)
1.  Navigate to the `frontend` folder.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser and navigate to the URL shown in the terminal ( `http://localhost:5173`).

---

##  Main Features
Secure Authentication: Registration with strict password validation (min 6 chars + special characters) and JWT-based Login. 
Centralized Dashboard: A "Pro" interface featuring vertical stacking, stats overview, and project filtering.
Project Management: Create new projects with titles and descriptions.
Deadline Tracking: Dedicated section for "Upcoming Deadlines" (next 7 days), utilizing optimized backend queries.
Interactive UI: Real-time feedback using Toast notifications and loading states.

##  Technical Decisions
Centralized Layout: Used a constrained max-width container (`1200px`) to ensure readability and a professional look across large screens.
Optimized Queries: Implemented `JOIN FETCH` in the backend (JPA) to solve the "N+1 select" and "Lazy Loading" issues when retrieving tasks with project details.
UX/UI: Implemented client-side validation for passwords to reduce server load and provided immediate visual feedback (Toasts) instead of native browser alerts.