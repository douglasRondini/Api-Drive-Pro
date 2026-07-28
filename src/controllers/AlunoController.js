import { AlunoRepository } from '../repositories/AlunoRepository.js'
import { UserRepository } from '../repositories/userRepository.js'
import { AlunoService } from '../services/AlunoService.js'

const alunoRepository = new AlunoRepository()
const userRepository = new UserRepository()
const alunoService = new AlunoService(alunoRepository, userRepository)

export class AlunoController {
  async create(req, res) {
    try {
      const { userId, nome, telefone, cpf } = req.body
      const aluno = await alunoService.createAluno({ userId, nome, telefone, cpf })
      return res.status(201).json(aluno)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  async getByUserId(req, res) {
    try {
      const { userId } = req.params
      const aluno = await alunoService.getByUserId(userId)
      return res.status(200).json(aluno)
    } catch (error) {
      return res.status(404).json({ error: error.message })
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params
      const aluno = await alunoService.getById(id)
      return res.status(200).json(aluno)
    } catch (error) {
      return res.status(404).json({ error: error.message })
    }
  }
}
