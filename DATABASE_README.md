# Database Docker Compose

ไฟล์ Docker Compose สำหรับจัดการฐานข้อมูลของระบบ CRM

## ไฟล์ที่สร้างขึ้น

- `docker-compose.db.yml` - การตั้งค่าฐานข้อมูลพื้นฐาน (PostgreSQL + Redis + PgAdmin)
- `docker-compose.db.dev.yml` - การตั้งค่าสำหรับ Development environment
- `docker-compose.db.prod.yml` - การตั้งค่าสำหรับ Production environment
- `.env.db.example` - ตัวอย่างไฟล์ environment variables

## การใช้งาน

### Development Environment

```bash
# เริ่มฐานข้อมูลสำหรับ development
docker-compose -f docker-compose.db.dev.yml up -d

# ดูสถานะ
docker-compose -f docker-compose.db.dev.yml ps

# หยุดฐานข้อมูล
docker-compose -f docker-compose.db.dev.yml down
```

### Production Environment

```bash
# คัดลอกไฟล์ environment variables
cp .env.db.example .env.db

# แก้ไขค่าในไฟล์ .env.db ให้เหมาะสม
# แล้วเริ่มฐานข้อมูล
docker-compose -f docker-compose.db.prod.yml --env-file .env.db up -d
```

### การใช้งานพื้นฐาน

```bash
# เริ่มฐานข้อมูลแบบพื้นฐาน
docker-compose -f docker-compose.db.yml up -d
```

## การเชื่อมต่อ

### PostgreSQL
- **Host**: localhost
- **Port**: 5432
- **Database**: crm_standard (dev: crm_standard_dev, prod: crm_standard_prod)
- **Username**: myuser (prod: ใช้ค่าจาก .env.db)
- **Password**: mypassword (prod: ใช้ค่าจาก .env.db)

### Redis
- **Host**: localhost
- **Port**: 6379
- **Password**: redispw (prod: ใช้ค่าจาก .env.db)

### PgAdmin (Web Interface)
- **URL**: http://localhost:5050
- **Email**: admin@gmail.com
- **Password**: admin

## Database URL สำหรับ Backend

### Development
```
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/crm_standard_dev?schema=public
REDIS_URI=redis://default:redispw@localhost:6379
```

### Production
```
DATABASE_URL=postgresql://produser:strongpassword123@localhost:5432/crm_standard_prod?schema=public
REDIS_URI=redis://default:strongredispassword123@localhost:6379
```

## การ Backup และ Restore

### Backup Database
```bash
# สำหรับ development
docker exec crm-postgres-dev pg_dump -U myuser crm_standard_dev > backup_dev.sql

# สำหรับ production
docker exec crm-postgres-prod pg_dump -U produser crm_standard_prod > backup_prod.sql
```

### Restore Database
```bash
# สำหรับ development
docker exec -i crm-postgres-dev psql -U myuser crm_standard_dev < backup_dev.sql

# สำหรับ production
docker exec -i crm-postgres-prod psql -U produser crm_standard_prod < backup_prod.sql
```

## การลบข้อมูล

```bash
# หยุดและลบ containers พร้อม volumes
docker-compose -f docker-compose.db.dev.yml down -v

# ลบ volumes ที่ไม่ใช้
docker volume prune
```

## หมายเหตุ

1. ไฟล์ production ใช้ environment variables เพื่อความปลอดภัย
2. ควรเปลี่ยนรหัสผ่านในการใช้งานจริง
3. ระบบมี health check สำหรับการตรวจสอบสถานะฐานข้อมูล
4. มีการตั้งค่า logging สำหรับ production environment
