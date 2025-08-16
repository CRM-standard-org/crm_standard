import { PrismaClient, roles } from '@prisma/client'
const prisma = new PrismaClient()
import bcrypt from 'bcryptjs';
import { rolesData } from "../src/common/models/roleData";
import { statusData , socialData , vatData } from "../src/common/models/dataSeed";
import { countryData , provinceData ,districtData } from "../src/common/models/addressSeed";

async function main() {
  let roldAdmin: roles | null = null;

  for (const role of rolesData) {
      const result = await prisma.roles.upsert({
          where: { role_name: role },
          update: {}, // No update needed for now
          create: {
              role_name: role,
          },
      });

      // Save the result for the Admin role
      if (role === "Admin") {
          roldAdmin = result;
      }
  }
  if (!roldAdmin) {
    throw new Error("Admin role was not found or created.");
  }

  // create Company
  const company = await prisma.company.upsert({
    where: { name_th : 'บลูพีค อินโนเวชั่น จำกัด'},
    update: {},
    create: {
      name_th: 'บลูพีค อินโนเวชั่น จำกัด',
      name_en: 'blue peak'
    }
  })
  
  // Create User Admin
  const password = "123456";
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);  
  const hashPassword = await bcrypt.hash(password, salt);

  const employeeAdmin = await prisma.employees.upsert({
    where: { username: 'admin@gmail.com' },
    update: {},
    create: {
      employee_code: 'K1000',
        username: 'admin@gmail.com',
        password: hashPassword, 
        email: 'admin@gmail.com',
        role_id: roldAdmin.role_id,
        first_name: 'admin',
        is_active: true
    },
  })
  
  const employeePalm = await prisma.employees.upsert({
    where: { username: 'warinpalm@gmail.com' },
    update: {},
    create: {
      employee_code: 'K1001',
        username: 'warinpalm@gmail.com',
        password: hashPassword, 
        email: 'warinpalm@gmail.com',
        role_id: roldAdmin.role_id,
        first_name: 'warinpalm',
        is_active: true
    },
  })

  const employeePor = await prisma.employees.upsert({
    where: { username: 'myzero0139@gmail.com' },
    update: {},
    create: {
      employee_code: 'K1002',
        username: 'myzero0139@gmail.com',
        password: hashPassword, 
        email: 'myzero0139@gmail.com',
        role_id: roldAdmin.role_id,
        first_name: 'zero',
        is_active: true
    },
  })

  for (const employeeStatus of statusData) {
    await prisma.employeeStatus.upsert({
        where: { name: employeeStatus },
        update: {}, // No update needed for now
        create: {
            name: employeeStatus,
        },
    });
  }
  for (const social of socialData) {
    await prisma.social.upsert({
        where: { name: social },
        update: {}, // No update needed for now
        create: {
            name: social,
        },
    });
  }

  await prisma.country.upsert({
      where: { country_name: countryData[0] },
      update: {},
      create: {
        country_name: countryData[0],
      },
  })

  const country = await prisma.country.findUnique({  
      where: { country_name: countryData[0] },
  })

  if (country){
    for (const province of provinceData) {
      await prisma.province.upsert({
        where: { province_name: province },
        update: {},
        create: {
          province_name: province,
          country_id: country.country_id,
        },
      });
    }

    for (const district of districtData) {
      const province = await prisma.province.findUnique({
        where: { province_name: district.provinceName },
      });
  
      if (province) {
        await prisma.district.upsert({
          where: {
            province_id_name: {
              province_id: province.province_id,
              district_name: district.name,
            },
          },
          update: {},
          create: {
            district_name: district.name,
            province_id: province.province_id,
          },
        });
      }
    }
  }

  for (const vat of vatData) {
    await prisma.vat.upsert({
        where: { vat_percentage: vat },
        update: {},
        create: { vat_percentage: vat },
    });
  }

  // Seed forecast weight config (priorities 1-5) if not exists or update to new mapping
  const defaultWeights = [
    { priority: 5, weight_percent: 80 },
    { priority: 4, weight_percent: 60 },
    { priority: 3, weight_percent: 40 },
    { priority: 2, weight_percent: 20 },
    { priority: 1, weight_percent: 10 },
  ];
  for (const w of defaultWeights) {
    await prisma.forecastWeightConfig.upsert({
      where: { priority: w.priority },
      update: { weight_percent: w.weight_percent },
      create: { priority: w.priority, weight_percent: w.weight_percent, created_by: employeeAdmin.employee_id, updated_by: employeeAdmin.employee_id },
    });
  }

  // Seed annual company goal for current year if absent
  const currentYear = new Date().getFullYear();
  const existingAnnualGoal = await prisma.salesGoal.findFirst({ where: { year: currentYear, month: null } });
  if (!existingAnnualGoal) {
    await prisma.salesGoal.create({ data: { year: currentYear, month: null, goal_amount: 12000000, created_by: employeeAdmin.employee_id, updated_by: employeeAdmin.employee_id } });
  }



}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
  })