const STATUS_VALIDOS = ['PENDENTE', 'ACEITA', 'RECUSADA', 'CANCELADA', 'CONCLUIDA']

export class AgendamentoService {
  constructor(agendamentoRepository, alunoRepository, instrutorRepository) {
    this.agendamentoRepository = agendamentoRepository
    this.alunoRepository = alunoRepository
    this.instrutorRepository = instrutorRepository
  }

  async createSolicitacao({ alunoId, instrutorId, localOrigem, dataHora, preco }) {
    if (!alunoId || !localOrigem || !dataHora) {
      throw new Error('alunoId, localOrigem e dataHora são obrigatórios.')
    }

    const aluno = await this.alunoRepository.findById(alunoId)
    if (!aluno) {
      throw new Error('Aluno não encontrado.')
    }

    const dataHoraDate = new Date(dataHora)
    if (Number.isNaN(dataHoraDate.getTime())) {
      throw new Error('dataHora inválida.')
    }

    if (instrutorId) {
      const instrutor = await this.instrutorRepository.findById(instrutorId)
      if (!instrutor) {
        throw new Error('Instrutor não encontrado.')
      }

      const conflito = await this.agendamentoRepository.findByInstrutorAndTime(instrutorId, dataHoraDate)
      if (conflito) {
        throw new Error('Instrutor já possui uma aula agendada neste horário.')
      }
    }

    return await this.agendamentoRepository.create({
      alunoId,
      instrutorId: instrutorId ?? null,
      localOrigem,
      dataHora: dataHoraDate,
      preco
    })
  }

  async getById(id) {
    const agendamento = await this.agendamentoRepository.findById(id)
    if (!agendamento) {
      throw new Error('Agendamento não encontrado.')
    }
    return agendamento
  }

  async listByAluno(alunoId) {
    const aluno = await this.alunoRepository.findById(alunoId)
    if (!aluno) {
      throw new Error('Aluno não encontrado.')
    }
    return await this.agendamentoRepository.findByAlunoId(alunoId)
  }

  async listByInstrutor(instrutorId) {
    const instrutor = await this.instrutorRepository.findById(instrutorId)
    if (!instrutor) {
      throw new Error('Instrutor não encontrado.')
    }
    return await this.agendamentoRepository.findByInstrutorId(instrutorId)
  }

  // Instrutor aceita uma solicitação (própria ou uma aula em aberto sem instrutor definido)
  async aceitar(id, instrutorId) {
    const agendamento = await this.agendamentoRepository.findById(id)
    if (!agendamento) {
      throw new Error('Agendamento não encontrado.')
    }
    if (agendamento.status !== 'PENDENTE') {
      throw new Error('Apenas solicitações pendentes podem ser aceitas.')
    }
    if (agendamento.instrutorId && agendamento.instrutorId !== instrutorId) {
      throw new Error('Esta solicitação já está vinculada a outro instrutor.')
    }

    const instrutor = await this.instrutorRepository.findById(instrutorId)
    if (!instrutor) {
      throw new Error('Instrutor não encontrado.')
    }

    const conflito = await this.agendamentoRepository.findByInstrutorAndTime(instrutorId, agendamento.dataHora)
    if (conflito && conflito.id !== id) {
      throw new Error('Instrutor já possui uma aula agendada neste horário.')
    }

    return await this.agendamentoRepository.update(id, {
      instrutorId,
      status: 'ACEITA'
    })
  }

  async recusar(id) {
    return await this._mudarStatus(id, ['PENDENTE'], 'RECUSADA')
  }

  async cancelar(id) {
    return await this._mudarStatus(id, ['PENDENTE', 'ACEITA'], 'CANCELADA')
  }

  async concluir(id) {
    return await this._mudarStatus(id, ['ACEITA'], 'CONCLUIDA')
  }

  async atualizarStatus(id, status) {
    if (!STATUS_VALIDOS.includes(status)) {
      throw new Error(`Status inválido. Use um dos: ${STATUS_VALIDOS.join(', ')}.`)
    }
    const agendamento = await this.agendamentoRepository.findById(id)
    if (!agendamento) {
      throw new Error('Agendamento não encontrado.')
    }
    return await this.agendamentoRepository.updateStatus(id, status)
  }

  async _mudarStatus(id, statusPermitidos, novoStatus) {
    const agendamento = await this.agendamentoRepository.findById(id)
    if (!agendamento) {
      throw new Error('Agendamento não encontrado.')
    }
    if (!statusPermitidos.includes(agendamento.status)) {
      throw new Error(`Não é possível mudar para ${novoStatus} a partir do status ${agendamento.status}.`)
    }
    return await this.agendamentoRepository.updateStatus(id, novoStatus)
  }
}
