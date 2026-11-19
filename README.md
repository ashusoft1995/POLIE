# 🚔 Hossana Police Management System

A comprehensive police management system built with Spring Boot and Next.js for Hossana Police Department.

## 🎯 Features

### Citizen Portal
- **Crime Reporting** - Submit detailed crime reports online
- **Traffic Incidents** - Report traffic accidents and violations
- **Missing Person Reports** - File missing person cases
- **Officer Nominations** - Nominate officers for exceptional service

### Detective Module
- **Case Management** - Create and manage investigation cases
- **Evidence Tracking** - Chain of custody management
- **Report Review** - Review and assign incoming reports
- **Investigation Notes** - Document case progress

### HR Module
- **Employee Management** - Register and manage police officers
- **Leave Management** - Submit and approve leave requests
- **Payroll System** - Generate and process payroll

### Traffic Department
- **Traffic Report Management** - Handle traffic incident reports
- **Violation Tracking** - Track traffic violations

## 🏗️ Architecture

### Backend
- **Framework**: Spring Boot 3.3.5
- **Language**: Java 21
- **Database**: PostgreSQL
- **Security**: Spring Security + JWT
- **ORM**: JPA/Hibernate

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI

## 📦 Installation

### Prerequisites
- Java 21
- Node.js 18+
- PostgreSQL 14+
- Maven 3.9+

### Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on: `http://localhost:8080`

### Frontend Setup

```bash
cd hcops
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

### Database Configuration

Update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/hossana_police
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## 🔐 Default Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Police Head | chief | chief123 |
| Detective | detective | detective123 |
| Traffic Officer | traffic | traffic123 |
| HR Manager | hr | hr123 |
| System Admin | admin | admin123 |

**⚠️ Change these passwords in production!**

## 📊 Database Schema

### Main Tables
- `users` - System users and officers
- `crime_reports` - Citizen crime reports
- `traffic_reports` - Traffic incident reports
- `missing_persons` - Missing person reports
- `nominations` - Officer nominations
- `cases` - Investigation cases
- `evidences` - Case evidence items
- `leave_requests` - Employee leave requests
- `payrolls` - Payroll records

## 🔗 API Endpoints

### Public Endpoints (No Authentication)
```
POST /api/crime-reports
POST /api/traffic-reports
POST /api/missing-persons
POST /api/nominations
```

### Protected Endpoints (JWT Required)
```
# Employee Management
GET    /api/employees
POST   /api/employees
PUT    /api/employees/{id}

# Case Management
GET    /api/cases
POST   /api/cases
PUT    /api/cases/{id}/status

# Evidence
POST   /api/evidence
GET    /api/evidence/case/{caseId}

# Leave Requests
POST   /api/leave-requests
GET    /api/leave-requests
POST   /api/leave-requests/{id}/approve

# Payroll
POST   /api/payroll
GET    /api/payroll
PUT    /api/payroll/{id}/status
```

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
mvn clean package
java -jar target/hossana-police-backend-1.0.0.jar
```

### Frontend Deployment
```bash
cd hcops
npm run build
npm start
```

## 📝 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://localhost:5432/hossana_police
JWT_SECRET=your-secret-key
MAIL_HOST=smtp.gmail.com
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Developed for Hossana Police Department

## 📞 Support

For support and queries:
- Email: support@hossanapolice.gov.et
- Emergency: 911

---

**Version**: 1.0.0  
**Last Updated**: November 2026
