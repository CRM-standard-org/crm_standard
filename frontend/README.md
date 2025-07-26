
# CRM Standard Prateep Frontend

## โครงสร้างโปรเจกต์

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
  - `Customer/`: จัดการข้อมูลลูกค้า
    - ระบบสมาชิกลูกค้า
    - ประวัติการติดต่อ
    - การจัดการแท็กและกลุ่มลูกค้า
    
  - `Financial/`: ระบบการเงินและเอกสาร
    - `quotation/`: ระบบใบเสนอราคา
    - `sale-order-details/`: รายละเอียดคำสั่งซื้อ
    - `approve-details-quotation/`: การอนุมัติใบเสนอราคา
    - `pdf/`: ระบบพิมพ์เอกสาร PDF (ใบเสนอราคา, ใบสั่งซื้อ)
    
  - `Dashboard/`: ระบบรายงานและการวิเคราะห์
    - `summary-sale/`: สรุปยอดขาย
    - `reports/`: รายงานต่างๆ
    - `report-customers/`: รายงานลูกค้า
    - `report-tags-customer/`: รายงานการวิเคราะห์แท็กลูกค้า
    - `report-years/`: รายงานประจำปี
    
  - `Product/`: จัดการข้อมูลสินค้า
    - รายการสินค้า
    - กลุ่มสินค้า
    - ราคาและสต็อก
    
  - `Organization/`: จัดการข้อมูลองค์กร
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

## วิธีเริ่มต้น

1. ติดตั้ง dependencies:
   ```bash
   npm install
   ```
2. รัน development server:
   ```bash
   npm run dev
   ```
3. เปิดใช้งานที่ http://localhost:5173

---
สำหรับรายละเอียดเพิ่มเติม ดูโครงสร้างโปรเจกต์รวมที่ [../README.md](../README.md)

