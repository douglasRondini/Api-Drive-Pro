import { InstrutorRepository } from '../repositories/InstrutorRepository.js'
import { UserRepository } from '../repositories/userRepository.js'
import { InstrutorService } from '../services/InstrutorService.js'

const instrutorRepository = new InstrutorRepository()
const userRepository = new UserRepository()
const instrutorService = new InstrutorService(instrutorRepository, userRepository)

export class InstrutorController {
  async create(req, res) {
    try {
      const { userId, nome, telefone, cnh, placaVeiculo } = req.body
      const instrutor = await instrutorService.createInstrutor({ userId, nome, telefone, cnh, placaVeiculo })
      return res.status(201).json(instrutor)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  async getByUserId(req, res) {
    try {
      const { userId } = req.params
      const instrutor = await instrutorService.getByUserId(userId)
      return res.status(200).json(instrutor)
    } catch (error) {
      return res.status(404).json({ error: error.message })
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params
      const instrutor = await instrutorService.getById(id)
      return res.status(200).json(instrutor)
    } catch (error) {
      return res.status(404).json({ error: error.message })
    }
  }

  async listDisponiveis(req, res) {
    try {
      const instrutores = await instrutorService.listDisponiveis()
      return res.status(200).json(instrutores)
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno ao buscar instrutores.' })
    }
  }

  async updateDisponibilidade(req, res) {
    try {
      const { id } = req.params
      const { disponivel } = req.body
      const instrutor = await instrutorService.setDisponibilidade(id, Boolean(disponivel))
      return res.status(200).json(instrutor)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  async updatePriceAula(req, res) {
    try {
      const { id } = req.params
      const { precoAula } = req.body
      const instrutor = await instrutorService.updatePriceAula(id, precoAula)
      return res.status(200).json(instrutor)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }
}
