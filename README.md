# CRM Standard Prateep Project Structure

### 🔹 1. **Project Overview**

* คำอธิบายโดยรวมของโปรเจกต์

* วัตถุประสงค์ของระบบ / เว็บไซต์
* ฟีเจอร์หลักที่มีอยู่ในระบบ
  
---

### 🔹 2. **Technology Stack**

- **frontend/**  
  พัฒนาโดยใช้ React + TypeScript + Vite  
  แบ่งตาม features และ components เพื่อความเป็นระเบียบและ maintain ง่าย

- **backend/**  
  พัฒนาโดยใช้ Node.js + TypeScript, Prisma, Express  
  มีโครงสร้างแยกตามโมดูล เช่น การจัดการใบเสนอราคา, นิสัย, แท็ก ฯลฯ

- **database/**  
  PostgresSQL

- **API/**  
  REST API

- **docker-compose.yml**  
  สำหรับรัน backend, frontend และ database ด้วย Docker

- **docs API/**  
  มี Postman collection และคู่มือ API : https://documenter.getpostman.com/view/36305586/2sB2cd5JDS

- **Other Tools**: Docker, Zod (validation), Postman (API testing) , Prisma (ORM) , Multer

---

### 🔹 3. **Project Structure**

## FRONTEND
```
frontend/
│
├── public/                # static files เช่น รูปภาพ โลโก้
├── font/                  # ฟอนต์ภาษาไทย
├── src/
│   ├── components/        # UI components (customs, layouts, ui)
│   ├── features/          # ฟีเจอร์หลัก เช่น Customer, Financial, Product ฯลฯ
│   ├── services/          # เรียกใช้งาน API
│   ├── hooks/             # custom hooks
│   ├── types/             # type definitions
│   ├── configs/           # config ต่างๆ ของแอป
│   ├── lib/               # utility functions
│   ├── pages/             # หน้าเพจแต่ละส่วน
│   ├── routes/            # การจัดการ routing
│   ├── utils/             # ฟังก์ชันช่วยเหลือทั่วไป
│   ├── zustand/           # state management (Zustand)
│   └── ...                # โค้ด frontend อื่นๆ
├── index.html             # entry point
├── package.json           # dependencies และ script ของ frontend
├── tailwind.config.ts     # Tailwind CSS config
├── vite.config.ts         # Vite config
├── tsconfig.json          # TypeScript config
└── README.md              # ไฟล์นี้
```

## คำอธิบาย

- **components/**  
  รวม UI components ที่ใช้ซ้ำได้ เช่น ปุ่ม, ฟอร์ม, layout ฯลฯ
- **features/**  
  โค้ดแต่ละฟีเจอร์หลักของแอปพลิเคชัน แยกตามโมดูล:
  - `Dashboard/`: การวิเคราะห์ติดตามผล
    - dashboard ต่างๆ
    - กราฟ

  - `Customer/`: ลูกค้า
    - ระบบจัดการลูกค้า
    - ข้อมูลพื้นฐานและบันทึกกิจกรรมของลูกค้า
    - การจัดการแท็กและกลุ่มลูกค้า
    
  - `Financial/`: การขายและธุรกรรม
    - จัดการใบเสนอราคา และ ใบสั่งขาย
    - จัดการช่องทางชำระเงิน และ สกุลเงิน
    - `pdf/`: ระบบพิมพ์เอกสาร PDF (ใบเสนอราคา, ใบสั่งซื้อ)
    
  - `Product/`: สินค้า
    - จัดการสินค้า / กลุ่มสินค้า / หน่วยสินค้า
    
  - `Organization/`: การตั้งค่าองค์กร
    - โครงสร้างบริษัท
    - ทีมงาน
    - พนักงาน
    
  - `login/`: ระบบล็อกอินและการยืนยันตัวตน

- **services/**  
  ฟังก์ชันสำหรับเรียก API ไปยัง backend

- **hooks/**  
  custom hooks สำหรับจัดการ state หรือ logic เฉพาะ

- **types/**  
  กำหนด type และ interface สำหรับ TypeScript

- **configs/**  
  การตั้งค่าต่างๆ ของแอป เช่น config API, theme

- **lib/** และ **utils/**  
  ฟังก์ชันช่วยเหลือทั่วไป เช่น format, validate

- **pages/**  
  หน้าเพจหลักของแต่ละส่วน

- **routes/**  
  การจัดการเส้นทาง (routing) ของแอป

- **zustand/**  
  จัดการ global state ด้วย Zustand

## BACKEND
```
backend/
│
├── docs/                  # เอกสาร API และคู่มือ เช่น Postman collection
├── prisma/                # Prisma schema, migration, และ seed data
│   ├── schema.prisma      # โครงสร้างฐานข้อมูล
│   ├── seed.ts            # สคริปต์ seed ข้อมูล
│   └── ...
├── src/
│   ├── modules/           # โมดูลหลัก เช่น address, auth, customer, product ฯลฯ
│   ├── common/            # middleware, models, utils ทั่วไป
│   ├── db.ts              # การเชื่อมต่อฐานข้อมูล
│   ├── server.ts          # สร้างและรัน Express server
│   ├── index.ts           # entry point
│   └── ...                # โค้ด backend อื่นๆ
├── package.json           # dependencies และ script ของ backend
├── tsconfig.json          # TypeScript config
└── README.md              # ไฟล์นี้
```

## คำอธิบาย

- **docs/**  
  รวมเอกสาร API, Postman collection, คู่มือการใช้งาน
- **prisma/**  
  กำหนด schema, migration, และ seed ข้อมูลสำหรับฐานข้อมูล
- **src/modules/**  
  โค้ดแต่ละโมดูล เช่น การจัดการลูกค้า, สินค้า, ใบเสนอราคา ฯลฯ
- **src/common/**  
  ฟังก์ชัน, middleware, models, utils ที่ใช้ร่วมกัน
- **db.ts**  
  การเชื่อมต่อฐานข้อมูล (เช่น Prisma Client)
- **server.ts**  
  สร้างและรัน Express server
- **index.ts**  
  จุดเริ่มต้นของแอปพลิเคชัน


---

### 🔹 4. **Installation & Setup Instructions**

## วิธีเริ่มต้น Frontend

1. ติดตั้ง dependencies:
   ```bash
   npm install
   ```
2. รัน development server:
   ```bash
   npm run dev
   ```
3. เปิดใช้งานที่ http://localhost:5173

## วิธีเริ่มต้น Backend

1. ติดตั้ง dependencies:
   ```bash
   npm install
   ```
2. ตั้งค่าฐานข้อมูลและ Prisma:
   ```bash
   npx prisma migrate dev หรือ npm run db:migrate
   npx prisma db seed หรือ npm run db:seed
   ```
3. รัน development server:
   ```bash
   npm run dev
   ```
4. เปิดใช้งาน API ที่ http://localhost:8081
---

### 🔹 5. **Deployment Process**

ไม่มี

---

### 🔹 6. **Database Schema**

backend/
│           
├── prisma/                # Prisma schema, migration, และ seed data
│   ├── schema.prisma      # โครงสร้างฐานข้อมูล
│   ├── seed.ts            # สคริปต์ seed ข้อมูล
│   └── ...

---

### 🔹 7. **API Documentation**

https://documenter.getpostman.com/view/36305586/2sB2cd5JDS
---

### 🔹 8. **Account / Credential ที่จำเป็น**

.env frontend

VITE_BASE_API='http://localhost:8081'
VITE_FRONTEND_URL="http://localhost:5173"
---------------------------------------------

.env backend
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

docker compose 
```
version: "3.8"

services:
  # frontend:
  #   build:
  #     context: ./frontend
  #     dockerfile: Dockerfile
  #   ports:
  #     - "3000:80"  
  #   environment:
  #     NODE_ENV: development
  #     REACT_APP_BACKEND_SERVER: http://localhost:8087/api/

  # backend:
  #   build: ./backend
  #   ports:
  #     - "8081:8081"
  #   volumes:
  #     - ./backend:/app
  #   environment:
  #     DATABASE_URL: postgresql://myuser:mypassword@postgres:5432/demo?sslmode=disable
  #     TZ: Asia/Bangkok 
  #   depends_on:
  #     - postgres

  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: crm_standard
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypassword
      TZ: Asia/Bangkok
    ports:
      - "5432:5432"
    volumes:
      - db:/var/lib/postgresql/data

  pgadmin:
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@gmail.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - postgres

  plantuml-server:
    build:
      context: .
      dockerfile: Dockerfile.jetty
    image: plantuml/plantuml-server:jetty
    container_name: plantuml-server
    ports:
      - "8080:8080"
    environment:
      - BASE_URL=plantuml

volumes:
  db:
```
---

### 🔹 9. **Pending Tasks / Known Issues**

การวิเคราะห์ติดตามผล 
  ติดตามกระบวนการขาย (หลังบ้าน + integrate)
  การติดตามตัวชี้วัดสำคัญ (หลังบ้าน + integrate)
  คาดการณ์ยอดขาย (หลังบ้าน + integrate)
  รายงานทั้ง 6 รายงาน (หลังบ้าน + integrate)
---------------------------
การกำหนดข้อมูลพื้นฐานลูกค้า (หลังบ้าน + integrate)
---------------------------
responsive ของ frontend บางหน้า ในหน้าจอมือถืออาจมีเพี้ยนในส่วนของ 

ตัว input ของ label เงื่อนไขการชำระเงินใน file /
 `Feature/Financial/edit-info-quotation`
 `Feature/Financial/edit-sale-order`
 `Feature/Financial/create-quotation`
---------------------------

Piechart เวลาเอาเมาส์ไปชี้มันไม่ชอบแสดงข้อมูลให้ของสีๆนั้นว่าเป็นรายละเอียดของอะไรใน File /
 `Feature/Dashboard/dashboards`
 `Feature/Dashboard/report-category-sale`

--------------------------- 
update employee กรณีที่ลบข้อมูลของ input ที่เคยมีอยู่ออกจะไม่สามารถ update
เปลี่ยนรหัสผ่านของพนักงานไม่ได้ (ฺBackend)

---------------------------

---

### 🔹 10. **Contact / Contributor Info**

* ผู้พัฒนา / ผู้ดูแลโปรเจกต์
วฤณ พรหมวรานนท์ 0890526911 ID LINE : warinpalm
เวงซัว แต 0987514562 ID LINE : wangsua-_-por

---

### 🔹 11. **Version Control**

* Repository URL (GitHub, GitLab ฯลฯ)

* Branch ที่ใช้งานหลัก
Branch Dev-Palm จะเป็นส่วนของ การพัฒนาฝั่ง frontend เป็นหลัก
Branch Dev-Por จะเป็นส่วนของ การพัฒนาฝั่ง backend เป็นหลัก
Branch Dev จะเป็นส่วนของการรวมโค้ด ของ Front กับ Back รวมกัน เพื่อนำมา merge พัฒนาต่อใน Branch ของตัวเอง


---