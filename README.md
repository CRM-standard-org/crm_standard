# CRM Standard Prateep Project Structure

## โครงสร้างโปรเจกต์

```
crm_standard_prateep/
│
├── backend/
│   ├── docs/                  # เอกสาร API และคู่มือ
│   ├── prisma/                # Prisma schema และ migration
│   ├── src/
│   │   ├── modules/           # โมดูลหลัก เช่น quotation, color, tag ฯลฯ
│   │   ├── common/            # middleware, utils, handler ทั่วไป
│   │   └── ...                # โค้ด backend อื่นๆ
│   ├── package.json           # dependencies และ script ของ backend
│   └── tsconfig.json          # TypeScript config
│
├── frontend/
│   ├── public/                # static files
│   ├── font/                  # ฟอนต์
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── features/          # แต่ละ feature เช่น Customer, Financial, Product ฯลฯ
│   │   ├── services/          # เรียก API
│   │   ├── hooks/             # custom hooks
│   │   ├── types/             # type definitions
│   │   └── ...                # โค้ด frontend อื่นๆ
│   ├── index.html             # entry point
│   ├── package.json           # dependencies และ script ของ frontend
│   ├── tailwind.config.ts     # Tailwind CSS config
│   ├── vite.config.ts         # Vite config
│   └── tsconfig.json          # TypeScript config
│
├── docker-compose.yml         # สำหรับรันระบบด้วย Docker
├── class_diagram.puml         # UML diagram
├── usecase_diagram.puml       # Use case diagram
└── README.md                  # โครงสร้างโปรเจกต์นี้
```

## คำอธิบาย

- **backend/**  
  พัฒนาโดยใช้ Node.js + TypeScript, Prisma, Express  
  มีโครงสร้างแยกตามโมดูล เช่น การจัดการใบเสนอราคา, สี, แท็ก ฯลฯ

- **frontend/**  
  พัฒนาโดยใช้ React + TypeScript + Vite  
  แบ่งตาม features และ components เพื่อความเป็นระเบียบและ maintain ง่าย

- **docker-compose.yml**  
  สำหรับรัน backend, frontend และ database ด้วย Docker

- **docs/**  
  มี Postman collection และคู่มือ API

## วิธีเริ่มต้น

ดูรายละเอียดการติดตั้งและรันแต่ละส่วนใน [frontend/README.md](frontend/README.md) และ [backend/docs/README.md](backend/docs/README.md)
