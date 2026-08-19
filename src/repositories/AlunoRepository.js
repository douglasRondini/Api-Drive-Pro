import { prisma } from '../config/prisma.js'

export class AlunoRepository {
  async create(data) {
    return await prisma.aluno.create({ data })
  }

  async findById(id) {
    return await prisma.aluno.findUnique({
      where: { id },
      include: {
        user: {
          select: { email: true, name: true }
        }
      }
    })
  }

  // O id do Aluno é o mesmo id do User, então buscar por userId é o mesmo que buscar por id
  async findByUserId(userId) {
    return await prisma.aluno.findUnique({
      where: { id: userId }
    })
  }

  async findByCpf(cpf) {
    return await prisma.aluno.findUnique({
      where: { cpf }
    })
  }

  async findAll() {
    return await prisma.aluno.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            criadoEm: true
          }
        }
      }
    })
  }
}
