import { UserRepository } from '../repositories/userRepository.js'
import { AlunoRepository } from '../repositories/AlunoRepository.js'
import { InstrutorRepository } from '../repositories/InstrutorRepository.js'
import { UserService } from '../services/userService.js'

const userRepository = new UserRepository()
const alunoRepository = new AlunoRepository()
const instrutorRepository = new InstrutorRepository()
const userService = new UserService(userRepository, alunoRepository, instrutorRepository)

export class UserController {
  async create(req, res) {
    try {
      const { email, name, age, password, role, telefone, cpf, cnh, placaVeiculo } = req.body
      const newUser = await userService.createUser({ email, name, age, password, role, telefone, cpf, cnh, placaVeiculo })
      return res.status(201).json(newUser)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body
      const result = await userService.login({ email, password })
      return res.status(200).json(result)
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  }

  async list(req, res) {
    try {
      const users = await userService.getAllUsers()
      return res.status(200).json(users)
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno ao buscar usuários.' })
    }
  }
}