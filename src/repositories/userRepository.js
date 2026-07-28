import { prisma } from '../config/prisma.js'

export class UserRepository {
  async create(data) {
    return await prisma.user.create({ data })
  }

  // Cria o User e, na mesma transação, o perfil (Aluno ou Instrutor)
  // correspondente à role informada. Se qualquer etapa falhar, nada é persistido.
  async createWithProfile({ email, name, age, password, role, perfil }) {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, name, age, password, role }
      })

      let perfilCriado = null

      if (role === 'Aluno' && perfil) {
        perfilCriado = await tx.aluno.create({
          data: {
            id: user.id, // mesmo id do User (chave primária compartilhada)
            nome: perfil.nome,
            telefone: perfil.telefone,
            cpf: perfil.cpf
          }
        })
      } else if (role === 'Instrutor' && perfil) {
        perfilCriado = await tx.instrutor.create({
          data: {
            id: user.id, // mesmo id do User (chave primária compartilhada)
            nome: perfil.nome,
            telefone: perfil.telefone,
            cnh: perfil.cnh,
            placaVeiculo: perfil.placaVeiculo
          }
        })
      }

      return { user, perfil: perfilCriado }
    })
  }

  async findByEmail(email) {
    return await prisma.user.findUnique({ where: { email } })
  }

  async findById(id) {
    return await prisma.user.findUnique({ where: { id } })
  }

 async findAll() {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        age: true
      }
    })
  }
}