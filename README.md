# SteelCare – Preventive Maintenance Management System (PMMS)

SteelCare is a premium, enterprise-grade full-stack web application designed to digitize the preventive maintenance process for shopfloor machinery. It allows administrators to register machinery, schedule maintenance, assign tasks to field technicians, and track execution history. Engineers can view assignments, log progress, and record completion remarks.

---

## 🚀 Tech Stack

### Backend
- **Core:** Java 17, Spring Boot 3.3.1
- **Security:** Spring Security, JWT Authentication (io.jsonwebtoken)
- **Data Access:** Spring Data JPA, Hibernate, MySQL 8.0
- **Documentation:** Swagger UI / OpenAPI 3.0 (`springdoc-openapi`)
- **Tools:** Maven, Lombok, Jakarta Validation

### Frontend
- **Framework:** React (Vite)
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS v3, Vanilla CSS
- **Charts:** Chart.js, `react-chartjs-2`
- **Icons:** Lucide React

---

## 🛠️ Project Structure

```text
VT project/
├── backend/                  # Spring Boot 3.x backend
│   ├── pom.xml               # Maven configuration
│   └── src/main/java/...     # Package structure (config, controller, service, entity, etc.)
├── frontend/                 # Vite + React + Tailwind frontend
│   ├── package.json          # Node dependencies
│   ├── tailwind.config.js    # Tailwind layout properties
│   └── src/...               # Pages, components, contexts, and css
└── README.md                 # Project guide
```

---

## 🔧 Installation & Setup

### Prerequisites
- **Java JDK 17** (Ensure `java -version` returns JDK 17)
- **Maven 3.9+**
- **Node.js** (latest LTS/stable) & **npm**
- **Docker Desktop** (running)

---

### Step 1: Start MySQL Database via Docker
Run the following commands in your terminal to start a MySQL container on port `3306` (or `3307` if 3306 is occupied):

```bash
# Pull and start the MySQL 8.0 container
docker run -d --name steelcare-db -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=steelcare mysql:8.0
```

> [!NOTE]
> If port `3306` is already occupied by another local MySQL daemon, the container will run on port `3307`. The backend `application.yml` is already pre-configured to connect to `localhost:3307`. If you run on port `3306`, update the datasource URL in `backend/src/main/resources/application.yml` to `localhost:3306`.

---

### Step 2: Start the Backend Service
Navigate to the `backend/` directory, compile the application, and boot the Spring Boot application:

```bash
cd backend

# Compile and package the application
export JAVA_HOME=/opt/homebrew/opt/openjdk@17 # Explicitly point to Java 17
mvn clean compile

# Run the dev server
mvn spring-boot:run
```
The backend server will run at **`http://localhost:8080`**.

---

### Step 3: Start the Frontend Application
Open a new terminal window, navigate to the `frontend/` directory, install packages, and start the Vite dev server:

```bash
cd frontend

# Install Node modules
npm install

# Start the Vite React development server
npm run dev
```
The frontend application will be hosted at **`http://localhost:5173`**.

---

## 🔑 Demo Login Credentials

The application automatically seeds a sample dataset into the database on startup. You can log in using the following accounts:

### 1. Administrator Account
- **Email:** `admin@steelcare.com`
- **Password:** `password`
- **Access Scope:** 
  - Manage (Add/Edit/Delete) shopfloor machines.
  - Schedule maintenance tasks and assign engineers.
  - View real-time analytics dashboard & status trends.
  - Delete completed/scheduled tasks.

### 2. Employee Account (Scheduler)
- **Email:** `employee@steelcare.com`
- **Password:** `password`
- **Access Scope:**
  - Schedule preventive maintenance tasks and assign engineers.
  - View real-time analytics dashboard & status trends.
  - View shopfloor machine listings and details (read-only).

### 3. Engineer Account (Technician 1)
- **Email:** `engineer1@steelcare.com`
- **Password:** `password`
- **Access Scope:**
  - View assigned maintenance tasks.
  - Update status (`PENDING` ➔ `IN_PROGRESS` ➔ `COMPLETED`).
  - Write completion remarks and log hours.
  - Access machinery records and past histories.

### 4. Engineer Account (Technician 2)
- **Email:** `engineer2@steelcare.com`
- **Password:** `password`
- **Access Scope:** Same as above (holds one overdue task in the database seeder to test warning indicators).

---

## 📝 API & Swagger Documentation
Once the backend is running, you can explore, test, and execute REST APIs directly using the Swagger UI web client:

- **Swagger UI endpoint:** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **OpenAPI Schema docs:** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

To test JWT authenticated routes in Swagger UI:
1. Call `/auth/login` with credentials.
2. Copy the `token` string from the JSON response.
3. Click the **Authorize** lock button in the top-right of Swagger.
4. Paste the token and click **Authorize**.

---

## ⚙️ Core Scheduler Logic
A Spring Scheduler is active in `MaintenanceScheduler.java`. It executes once every night at midnight to check:
1. If a machine's `nextMaintenanceDate` is in the past.
2. If an active maintenance task's `scheduledDate` is in the past and has not been set to `COMPLETED`.

If overdue items are detected, the system automatically writes a new `Notification` alert which appears immediately in the floating Alert panel on the dashboard.
