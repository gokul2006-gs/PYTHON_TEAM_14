# CampusCore - Institutional Resource Management System

CampusCore is a premium, high-performance web platform designed for modern educational institutions to manage resource allocation, faculty consultations, and security audits with absolute transparency.

## 🚀 Key Features

### 🔐 Identity & Access Management (IAM)
- **Multi-Tier RBAC**: Granular role-based access control for Students, Faculty (Staff), Lab In-Charges, and System Administrators.
- **Administrative Enrollment**: Strictly controlled user registration system where only Admins can initialize student and staff accounts to maintain institutional integrity.
- **Secure Authentication**: Powerd by JWT with concurrent session management markers (JTI) and automated account locking after multiple failed attempts.
- **Recovery Protocol**: Self-service "Lost Key" recovery via institutional email verification and OTP.

### 📅 Advanced Booking Ecosystem
- **Algorithm-Driven Scheduling**: Intelligent conflict checking that blocks resources globally once a request is approved or pending.
- **Special Priority Protocol**: Dedicated bypass for massive institutional events (Symposiums, Exams, Conferences) with higher priority weighting.
- **Faculty Consultation (Bridge)**: A unique direct-booking system where students can schedule meetings with staff using only their Employee ID—automatically linking to consultation spaces.
- **Auto-Approval Intelligence**: Staff bookings for institutional resources are automatically granted clearance to eliminate administrative latency.

### 🛡️ Administrative Governance
- **Global Master Schedule**: A central oversight dashboard for Admins to monitor and filter every resource allocation across the campus.
- **Registry Surveillance (Audit Logs)**: Comprehensive logging of every system operation—from login successes to resource modifications—for full transparency.
- **Resource Lifecycle Management**: Dynamic control over Labs, Classrooms, and Equipment status (Active, Maintenance, Inactive).

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4.0 (Modern Glassmorphism Design Language)
- **State/Logic**: React Hook Form, Zod (Schema Validation), Axios
- **Icons**: Lucide React
- **Date Handling**: Date-fns

### Backend
- **Framework**: Django REST Framework (DRF)
- **Security**: SimpleJWT (JSON Web Tokens)
- **Database**: MySQL / SQLite (Development)
- **Logging**: Custom Audit Logging Middleware

## 📦 Project Structure

```text
CAMPUS/
├── backend/            # Django REST API
│   ├── myproject/      # Core Logic (Models, Views, Serializers)
│   ├── settings.py     # Global Configuration
│   └── manage.py       # CLI Manager
└── frontend/           # React SPA
    ├── src/
    │   ├── pages/      # Dashboards & View Layers
    │   ├── services/   # API Communication Layer
    │   ├── context/    # Auth & Multi-role Management
    │   └── layouts/    # Dashboard & Public Shells
    └── package.json    # Dependencies
```

## 🚥 Quick Start

### 1. Prerequisites
- Python 3.10+
- Node.js 20+
- npm / yarn

### 2. Backend Setup
```bash
cd backend
# Install dependencies (requirements.txt)
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt mysqlclient
# Run migrations
python manage.py migrate
# Start server
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🔒 Security Policy
This system implements "Authorization Guard" which bypasses standard algorithmic constraints for priority requests, but requires formal validation from the administrative oversight committee for any manual overrides.

---
*Developed with focus on Premium Aesthetics and Scalable Institutional Logic.*
