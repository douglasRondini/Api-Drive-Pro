import { prisma } from '../config/prisma.js';

export class AgendamentoRepository {
  // 1. Criar uma nova solicitação de aula
  async create(data) {
    return await prisma.solicitacaoAula.create({
      data
    });
  }

  // 2. Buscar agendamento por ID com os dados do Aluno, Instrutor e User
  async findById(id) {
    return await prisma.solicitacaoAula.findUnique({
      where: { id },
      include: {
        aluno: {
          include: {
            user: {
              select: { email: true, name: true }
            }
          }
        },
        instrutor: {
          include: {
            user: {
              select: { email: true, name: true }
            }
          }
        }
      }
    });
  }

  // 3. Verificar conflito de horário para o instrutor
  async findByInstrutorAndTime(instrutorId, dataHora) {
    return await prisma.solicitacaoAula.findFirst({
      where: {
        instrutorId,
        dataHora,
        status: { not: 'CANCELADA' }
      }
    });
  }

  // 4. Listar todas as aulas solicitadas por um Aluno
  async findByAlunoId(alunoId) {
    return await prisma.solicitacaoAula.findMany({
      where: { alunoId },
      include: {
        instrutor: true
      },
      orderBy: { dataHora: 'desc' }
    });
  }

  // 5. Listar solicitações recebidas por um Instrutor
  async findByInstrutorId(instrutorId) {
    return await prisma.solicitacaoAula.findMany({
      where: { instrutorId },
      include: {
        aluno: true
      },
      orderBy: { dataHora: 'asc' }
    });
  }

  // 6. Atualizar status (ex: "ACEITA", "CANCELADA", "CONCLUIDA")
  async updateStatus(id, status) {
    return await prisma.solicitacaoAula.update({
      where: { id },
      data: { status }
    });
  }

  // 7. Atualização genérica (ex: aceitar vaga em aberto atribuindo instrutorId + status)
  async update(id, data) {
    return await prisma.solicitacaoAula.update({
      where: { id },
      data
    });
  }
}