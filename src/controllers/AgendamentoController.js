import { AgendamentoRepository } from '../repositories/AgendamentoRepository.js'
import { AlunoRepository } from '../repositories/AlunoRepository.js'
import { InstrutorRepository } from '../repositories/InstrutorRepository.js'
import { AgendamentoService } from '../services/AgendamentoService.js'

const agendamentoRepository = new AgendamentoRepository()
const alunoRepository = new AlunoRepository()
const instrutorRepository = new InstrutorRepository()
const agendamentoService = new AgendamentoService(agendamentoRepository, alunoRepository, instrutorRepository)

export class AgendamentoController {
  async create(req, res) {
    try {
      const { alunoId, instrutorId, localOrigem, dataHora, preco } = req.body
      const agendamento = await agendamentoService.createSolicitacao({ alunoId, instrutorId, localOrigem, dataHora, preco })
      return res.status(201).json(agendamento)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params
      const agendamento = await agendamentoService.getById(id)
      return res.status(200).json(agendamento)
    } catch (error) {
      return res.status(404).json({ error: error.message })
    }
  }

  async listByAluno(req, res) {
    try {
      const { alunoId } = req.params
      const agendamentos = await agendamentoService.listByAluno(alunoId)
      return res.status(200).json(agendamentos)
    } catch (error) {
      return res.status(404).json({ error: error.message })
    }
  }

  async listByInstrutor(req, res) {
    try {
      const { instrutorId } = req.params
      const agendamentos = await agendamentoService.listByInstrutor(instrutorId)
      return res.status(200).json(agendamentos)
    } catch (error) {
      return res.status(404).json({ error: error.message })
    }
  }

  async aceitar(req, res) {
    try {
      const { id } = req.params
      const { instrutorId } = req.body
      const agendamento = await agendamentoService.aceitar(id, instrutorId)
      return res.status(200).json(agendamento)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  async recusar(req, res) {
    try {
      const { id } = req.params
      const agendamento = await agendamentoService.recusar(id)
      return res.status(200).json(agendamento)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  async cancelar(req, res) {
    try {
      const { id } = req.params
      const agendamento = await agendamentoService.cancelar(id)
      return res.status(200).json(agendamento)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  async concluir(req, res) {
    try {
      const { id } = req.params
      const agendamento = await agendamentoService.concluir(id)
      return res.status(200).json(agendamento)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }
}
