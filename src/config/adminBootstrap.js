import bcrypt from 'bcryptjs'
import { prisma } from './prisma.js'

export async function ensureDefaultAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@drivepro.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'DrivePro@123'

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (existingAdmin) {
    return existingAdmin
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  return await prisma.user.create({
    data: {
      email: adminEmail,
      name: 'Administrador Drive Pro',
      age: '30',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })
}
