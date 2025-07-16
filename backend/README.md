# CRM Standard Prateep Backend

## โครงสร้างโปรเจกต์

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

## วิธีเริ่มต้น

1. ติดตั้ง dependencies:
   ```bash
   npm install
   ```
2. ตั้งค่าฐานข้อมูลและ Prisma:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```
3. รัน development server:
   ```bash
   npm run dev
   ```
4. เปิดใช้งาน API ที่ http://localhost:3000

---
สำหรับรายละเอียดเพิ่มเติม ดูโครงสร้างโปรเจกต์รวมที่ [../README.md](../README.md)
