import { prisma } from '../config/prisma.js'

export class InstrutorRepository {
  async create(data) {
    return await prisma.instrutor.create({ data })
  }

  async findById(id) {
    return await prisma.instrutor.findUnique({
      where: { id },
      include: {
        user: {
          select: { email: true, name: true }
        }
      }
    })
  }

  // O id do Instrutor é o mesmo id do User, então buscar por userId é o mesmo que buscar por id
  async findByUserId(userId) {
    return await prisma.instrutor.findUnique({
      where: { id: userId }
    })
  }

  async findByCnh(cnh) {
    return await prisma.instrutor.findUnique({
      where: { cnh }
    })
  }

  async findAllDisponiveis() {
    return await prisma.instrutor.findMany({
      where: { disponivel: true },
      include: {
        user: {
          select: { email: true, name: true }
        }
      }
    })
  }

  async updateDisponibilidade(id, disponivel) {
    return await prisma.instrutor.update({
      where: { id },
      data: { disponivel }
    })
  }
}
