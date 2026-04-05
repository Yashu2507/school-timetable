# 🏫 EduSchedule — School Timetable System

A full-stack school timetable management system with a **Java Spring Boot** backend and **React** frontend. Automatically generates conflict-free schedules using a constraint-based algorithm.

---

## ✨ Features

- **Three-division support** — Primary (1–5), Secondary (6–10), Higher (11–12, optional)
- **One-to-one mappings** — Teacher ↔ Subject, Teacher ↔ Class
- **Auto-scheduler** — Constraint-based algorithm prevents teacher conflicts and double-bookings
- **Dual timetable views** — View by class or by individual teacher
- **Full CRUD** — Manage teachers, classes, and subjects with live forms
- **Demo data** — 36 pre-seeded teachers, 12 classes, 15 subjects across all divisions
- **Dark academic UI** — Polished React frontend with responsive grid timetable

---

## 🚀 Quick Start

### Option A — Run with Docker Compose (recommended)

```bash
# Clone / download the project
cd school-timetable

# Build and start both services
docker-compose up --build

# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
# H2 Console: http://localhost:8080/h2-console
```

### Option B — Run manually

**Backend (requires Java 17, Maven)**
```bash
cd backend
./mvnw spring-boot:run
# API ready at http://localhost:8080
```

**Frontend (requires Node 18+)**
```bash
cd frontend
npm install --legacy-peer-deps
npm start
# UI ready at http://localhost:3000
```

---

## 🏗️ Project Structure

```
school-timetable/
├── docker-compose.yml
├── backend/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/java/com/school/timetable/
│       ├── TimetableApplication.java      # Entry point
│       ├── model/
│       │   ├── Teacher.java               # Entity with Division enum
│       │   ├── Subject.java               # Subject entity
│       │   ├── SchoolClass.java           # Class entity (1A, 6B, 11Science…)
│       │   └── TimetableEntry.java        # Scheduled period entry
│       ├── repository/                    # Spring Data JPA interfaces
│       ├── dto/Dto.java                   # All request/response objects
│       ├── algorithm/
│       │   └── TimetableGenerator.java    # Core scheduling algorithm
│       ├── service/                       # Business logic
│       │   ├── TeacherService.java
│       │   ├── SubjectService.java
│       │   ├── SchoolClassService.java
│       │   └── TimetableService.java
│       ├── controller/                    # REST endpoints
│       │   ├── TeacherController.java
│       │   ├── SubjectController.java
│       │   ├── SchoolClassController.java
│       │   └── TimetableController.java
│       └── config/
│           └── DataSeeder.java            # Demo data on startup
└── frontend/
    ├── package.json
    ├── Dockerfile
    ├── nginx.conf
    └── src/
        ├── App.js / App.css               # Global layout + dark theme
        ├── api/api.js                     # Fetch wrapper for all endpoints
        ├── components/
        │   └── Sidebar.js                 # Navigation sidebar
        └── pages/
            ├── Dashboard.js              # Overview + stats
            ├── TeachersPage.js           # Teacher CRUD + assignment
            ├── ClassesPage.js            # Class management
            ├── SubjectsPage.js           # Subject catalog
            └── TimetablePage.js          # Grid viewer + generator
```

---

## 🧠 Scheduling Algorithm

Located in `TimetableGenerator.java`, the algorithm works as follows:

1. **Inputs** — List of teachers (with subject + assigned class) and list of classes for a division
2. **Slot grid** — Creates a 5-day × N-period slot matrix
3. **Shuffled assignment** — Slots are shuffled (seeded by class name) for variety
4. **Constraint checks** per slot:
   - ✅ Teacher is not already scheduled at this time
   - ✅ Class does not already have a period at this time
   - ✅ Teacher has not exceeded their daily period limit
5. **Target** — 5 periods per subject per week (configurable)
6. **Output** — Saved `TimetableEntry` records with start/end times

---

## 📡 REST API Reference

### Teachers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teachers` | Get all teachers (optional `?division=PRIMARY`) |
| GET | `/api/teachers/{id}` | Get single teacher |
| POST | `/api/teachers` | Create teacher |
| PUT | `/api/teachers/{id}` | Update teacher |
| DELETE | `/api/teachers/{id}` | Delete teacher |

### Subjects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subjects` | Get all subjects (optional `?division=`) |
| POST | `/api/subjects` | Create subject |
| PUT | `/api/subjects/{id}` | Update subject |
| DELETE | `/api/subjects/{id}` | Delete subject |

### Classes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/classes` | Get all classes (optional `?division=`) |
| POST | `/api/classes` | Create class |
| PUT | `/api/classes/{id}` | Update class |
| DELETE | `/api/classes/{id}` | Delete class |

### Timetable
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/timetable/generate` | Generate timetable for a division |
| GET | `/api/timetable/class/{className}` | Get class schedule grid |
| GET | `/api/timetable/teacher/{id}` | Get teacher schedule grid |
| GET | `/api/timetable/division/{division}` | Get all schedules for a division |
| GET | `/api/timetable/all` | Get all timetables |
| DELETE | `/api/timetable/clear` | Clear timetable (optional `?division=`) |

### Generate Request Body
```json
{
  "division": "PRIMARY",
  "periodsPerDay": 8,
  "clearExisting": true
}
```

### Example Teacher Create Request
```json
{
  "name": "Priya Sharma",
  "email": "priya@school.edu",
  "division": "PRIMARY",
  "subject": "Mathematics",
  "assignedClass": "3A",
  "maxPeriodsPerDay": 6
}
```

---

## 🎨 UI Pages

| Page | Description |
|------|-------------|
| **Dashboard** | Stats overview, quick actions, generate all timetables button |
| **Teachers** | Add/edit/delete teachers with division, subject, and class assignment |
| **Classes** | Manage school classes (grade, section, student count) per division |
| **Subjects** | Manage subject catalog with periods-per-week slider |
| **Timetable** | View weekly grid by class or teacher; generate per division |

---

## ⚙️ Configuration

### Backend (`application.properties`)
```properties
server.port=8080
spring.datasource.url=jdbc:h2:mem:schooldb   # In-memory DB (replace with MySQL/Postgres for prod)
spring.jpa.hibernate.ddl-auto=create-drop
```

### Switch to MySQL (production)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/schooldb
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```
Add to `pom.xml`:
```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
</dependency>
```

### Frontend API URL
```bash
# .env file in frontend/
REACT_APP_API_URL=http://your-backend-host:8080/api
```

---

## 🔒 Business Rules

| Rule | Enforcement |
|------|-------------|
| Teacher teaches exactly one subject | `subject` field is required, single value |
| Teacher assigned to exactly one class | `assignedClass` field (one-to-one) |
| Primary teachers only teach classes 1–5 | `division` enum validated on create |
| Secondary teachers only teach classes 6–10 | Same division constraint |
| No two classes share a teacher at the same time | Checked in scheduling algorithm |
| No class has two subjects at the same time | Checked in scheduling algorithm |
| Max periods per day per teacher | Configurable (default 6) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2, Spring Data JPA |
| Database | H2 (dev), MySQL/PostgreSQL (prod-ready) |
| Build | Maven |
| Frontend | React 18, CSS3 custom properties |
| HTTP | Fetch API (no axios dependency needed) |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Containerisation | Docker, Docker Compose |
| Web Server | Nginx (frontend container) |
