# CRM Standard Prateep Backend

## Technology Stack

- **Backend**: Node.js (Express.js, TypeScript) 
- **Database**: PostgreSQL (managed via Prisma ORM)
- **API Protocol**: RESTful API (JSON)
- **Other Tools**: Docker, Zod (validation), Postman (API testing) , Prisma (ORM) , Multer

---

## Project Structure

```
backend/
├── build/                # Compiled JS output
├── docs/                 # API documentation & Postman collection
├── prisma/               # Prisma schema, migrations, and seed scripts
├── src/                  # Main source code
│   ├── common/           # Shared middleware, models, utils
│   ├── modules/          # Feature modules (customer, company, auth, etc.)
│   ├── uploads/          # File upload storage
│   ├── db.ts             # Database connection setup
│   ├── index.ts          # App entry point
│   └── server.ts         # Express server setup
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

- **src/modules/**: แยกแต่ละฟีเจอร์ เช่น customer, company, auth, ...
- **prisma/**: จัดการ schema, migration, และ seed ข้อมูล
- **docs/**: รวมไฟล์ Postman collection และเอกสาร API
- **build/**: โค้ดที่ถูก compile แล้ว

---

## Installation & Setup Instructions

### 1. Clone Repository
```sh
git clone <https://github.com/CRM-standard-org/crm_standard.git>
cd backend
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Setup Environment Variables
สร้างไฟล์ `.env` ในโฟลเดอร์ backend/ และนี้คือโค้ดของ .env backend
```
# Environment Configuration
NODE_ENV="development" # Options: 'development', 'production'
PORT="8081"            # The port your server will listen on
HOST="localhost"       # Hostname for the server

# CORS Settings
CORS_ORIGIN="http://localhost:5173" # Allowed CORS origin, adjust as necessary


# Rate Limiting
COMMON_RATE_LIMIT_WINDOW_MS="1000" # Window size for rate limiting (ms)
COMMON_RATE_LIMIT_MAX_REQUESTS="5" # Max number of requests per window per IP

# Setting Database Connection
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/airbag?schema=public"


# JWT
JWT_SECRET="83acc1dd88e0978d73063cc76d8acae76a724acbf5430eabb73d6df2405334c2"
ACCESS_EXPIRATION_MINUTES=10000
REFRESH_EXPIRATION_DAYS=1

# Redis caching
REDIS_URI="redis://default:redispw@localhost:32768"
```

### 4. Database Migration & Seed
```sh
npx prisma migrate dev หรือ npm run db:migrate
npx prisma db seed หรือ npm run db:seed
```

### 5. Run Project (Development)
```sh
npm run dev
```

### 6. Run with Docker (optional)
```sh
docker-compose up --build
```

---

## API Documentation

- ดูรายละเอียด API ทั้งหมดใน `docs/CRM.postman_collection.json` (นำเข้า Postman ได้)
- ดูแบบออนไลน์ : https://documenter.getpostman.com/view/36305586/2sB2cd5JDS

---

##  Pending Tasks / Known Issues

- เอกสารสิ่งที่จะต้องทำต่ออยู่ในกลุ่มไลน์ CRM-Dev ครับ

---

## Version Control

- **Repository URL**: [https://github.com/CRM-standard-org/crm_standard](https://github.com/CRM-standard-org/crm_standard)
- **Main Branch**: `dev` (สำหรับ merge integrate), `Dev-Por` (สำหรับพัฒนา backend)

---

> **Contact**: กลุ่มไลน์ CRM-Dev
