# 🏗️ System Architecture - CRM Standard

## 📋 **Architecture Overview**

ระบบ CRM Standard ใช้สถาปัตยกรรมแบบ **3-Tier Architecture** พัฒนาด้วย **Microservices approach** เพื่อความยืดหยุ่นและง่ายต่อการบำรุงรักษา

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │    │    Business     │    │      Data       │
│      Layer      │◄──►│     Logic       │◄──►│     Access      │
│   (Frontend)    │    │   (Backend)     │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🎨 **Frontend Architecture**

### Technology Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **UI Library**: Tailwind CSS + shadcn/ui
- **HTTP Client**: Axios
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Form Handling**: React Hook Form + Zod validation
- **Charts**: Recharts/Chart.js

### Folder Structure
```
frontend/src/
├── components/          # Reusable UI components
│   ├── customs/        # Custom business components
│   ├── layouts/        # Layout components
│   └── ui/            # Basic UI components (shadcn)
├── features/          # Feature-based modules
│   ├── Customer/      # Customer management
│   ├── Financial/     # Quotation & Sales
│   ├── Dashboard/     # Analytics & Reports
│   ├── Product/       # Product management
│   └── Organization/  # Company & Team management
├── hooks/             # Custom React hooks
├── services/          # API service layer
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── configs/           # App configurations
└── zustand/          # Global state stores
```

### Key Design Patterns
- **Feature-Based Architecture**: แยกโมดูลตาม business domain
- **Custom Hooks Pattern**: แยก data fetching logic
- **Component Composition**: ใช้ composition แทน inheritance
- **Service Layer Pattern**: แยก API calls ออกจาก components

---

## ⚙️ **Backend Architecture**

### Technology Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js + TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Validation**: Zod
- **File Upload**: Multer
- **API Documentation**: Postman Collection

### Folder Structure
```
backend/src/
├── modules/           # Feature modules
│   ├── auth/         # Authentication
│   ├── customer/     # Customer management
│   ├── quotation/    # Quotation handling
│   ├── product/      # Product management
│   ├── employee/     # Employee management
│   └── [module]/     # Other business modules
│       ├── [module]Model.ts      # Data models & validation
│       ├── [module]Repository.ts # Data access layer
│       ├── [module]Service.ts    # Business logic
│       └── [module]Router.ts     # Route handlers
├── common/           # Shared utilities
│   ├── middleware/   # Express middlewares
│   ├── models/       # Common models
│   └── utils/        # Utility functions
├── uploads/          # File storage
├── db.ts            # Database connection
└── server.ts        # Express server setup
```

### Key Design Patterns
- **Repository Pattern**: แยก data access logic
- **Service Layer Pattern**: แยก business logic
- **Dependency Injection**: ใช้ dependency injection
- **Middleware Pattern**: ใช้ Express middleware
- **Module Pattern**: แยกแต่ละ feature เป็น module

---

## 🗄️ **Database Architecture**

### Database Design
- **Database**: PostgreSQL 14+
- **ORM**: Prisma
- **Migration**: Prisma Migrate
- **Connection Pool**: Prisma Connection Pool

### Key Tables
```sql
-- Core Business Entities
Customer (ลูกค้า)
├── CustomerContact (ผู้ติดต่อ)
├── CustomerTags (แท็กลูกค้า)
├── Address (ที่อยู่)
└── Activity (กิจกรรม)

Quotation (ใบเสนอราคา)
├── QuotationItem (รายการสินค้า)
├── QuotationStatus (สถานะ)
└── QuotationFile (ไฟล์แนบ)

Product (สินค้า)
├── GroupProduct (กลุ่มสินค้า)
└── Unit (หน่วย)

Organization (องค์กร)
├── Company (บริษัท)
├── Employee (พนักงาน)
├── Team (ทีม)
└── Role (บทบาท)
```

### Database Indexes
```sql
-- Performance optimized indexes
Customer: company_name, email, priority
Product: product_name, group_product_id
Employee: username, email, employee_code
Quotation: quotation_number, customer_id, created_at
```

---

## 🔐 **Security Architecture**

### Authentication & Authorization
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │    │   Backend   │    │  Database   │
│             │    │             │    │             │
│ 1. Login    │───►│ 2. Validate │───►│ 3. Check    │
│             │    │             │    │    User     │
│ 4. JWT      │◄───│ 3. Generate │    │             │
│    Token    │    │    JWT      │    │             │
│             │    │             │    │             │
│ 5. API      │───►│ 6. Verify   │    │             │
│    Request  │    │    JWT      │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
```

### Security Measures
- **JWT Authentication**: Access & Refresh tokens
- **CORS Protection**: Configured origin restrictions
- **Rate Limiting**: Request rate limiting per IP
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Prisma ORM protection
- **XSS Protection**: Helmet.js middleware

---

## 🌐 **API Architecture**

### REST API Design
```
Base URL: http://localhost:8081/v1/

Authentication:
POST /auth/login
POST /auth/refresh
POST /auth/logout

Customer Management:
GET    /customer/get?page=1&limit=10&search=
POST   /customer/create
GET    /customer/get/:id
PUT    /customer/update/:id
DELETE /customer/delete/:id

Quotation Management:
GET    /quotation/get
POST   /quotation/create
GET    /quotation/get/:id
PUT    /quotation/update/:id
POST   /quotation/approve/:id
```

### API Response Format
```json
{
  "success": boolean,
  "message": string,
  "responseObject": object | array,
  "statusCode": number
}
```

---

## 🐳 **Deployment Architecture**

### Docker Setup
```yaml
# docker-compose.yml
services:
  postgres:    # Database
  pgadmin:     # Database admin
  # backend:   # API server (commented)
  # frontend:  # Web application (commented)
```

### Environment Configuration
```
Development:
- Frontend: http://localhost:5173
- Backend:  http://localhost:8081
- Database: postgresql://localhost:5432

Production: (TBD)
- Frontend: TBD
- Backend:  TBD
- Database: Cloud PostgreSQL
```

---

## 📊 **Performance Considerations**

### Frontend Optimization
- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Component lazy loading
- **State Management**: Optimized with Zustand
- **Caching**: TanStack Query cache
- **Bundle Size**: Tree shaking with Vite

### Backend Optimization
- **Database Indexing**: Optimized indexes
- **Connection Pooling**: Prisma connection pool
- **Caching**: Redis caching (configured but not active)
- **Rate Limiting**: Request throttling
- **Error Handling**: Centralized error handling

### Database Optimization
- **Indexing Strategy**: Strategic indexes on frequently queried columns
- **Query Optimization**: Efficient Prisma queries
- **Data Relationships**: Optimized foreign key relationships
- **Migration Strategy**: Prisma migration management

---

## 🔄 **Integration Patterns**

### Frontend-Backend Integration
```
Frontend (React) ◄─────► Backend (Express)
     ▲                        ▲
     │                        │
     ▼                        ▼
TanStack Query           Prisma ORM
     ▲                        ▲
     │                        │
     ▼                        ▼
 Local State              PostgreSQL
```

### Error Handling Flow
```
API Error ───► Service Layer ───► Hook ───► Component
    │              │               │           │
    ▼              ▼               ▼           ▼
HTTP Status    Error Response   Error State   UI Error
```

---

## 🚀 **Scalability Considerations**

### Current Architecture Limitations
- **Single Database**: One PostgreSQL instance
- **Monolithic Backend**: Single Express application
- **File Storage**: Local file system storage

### Future Scalability Options
- **Database Scaling**: Read replicas, sharding
- **Microservices**: Split into domain-specific services
- **Cloud Storage**: Move to S3/Cloud Storage
- **Load Balancing**: Multiple backend instances
- **CDN**: Static asset delivery

---

## 📋 **Monitoring & Logging**

### Current Status
- **Logging**: Basic console logging
- **Error Tracking**: Basic error handling
- **Monitoring**: None implemented

### Recommended Additions
- **Application Monitoring**: APM tools
- **Error Tracking**: Sentry/Bugsnag
- **Logging**: Structured logging (Winston)
- **Health Checks**: API health endpoints
- **Performance Monitoring**: Response time tracking
