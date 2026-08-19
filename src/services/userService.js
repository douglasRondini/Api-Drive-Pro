import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_super_segura'
const ROLES_VALIDAS = ['Aluno', 'Instrutor', 'ADMIN']

export class UserService {
  constructor(userRepository, alunoRepository, instrutorRepository) {
    this.userRepository = userRepository
    this.alunoRepository = alunoRepository
    this.instrutorRepository = instrutorRepository
  }

  async createUser({ email, name, age, password, role = 'Aluno', telefone, cpf, cnh, placaVeiculo }) {
    if (!password) {
      throw new Error('A senha é obrigatória.')
    }

    if (!ROLES_VALIDAS.includes(role)) {
      throw new Error(`Role inválida. Use um dos: ${ROLES_VALIDAS.join(', ')}.`)
    }

    const userExists = await this.userRepository.findByEmail(email)
    if (userExists) {
      throw new Error('E-mail já cadastrado.')
    }

    let perfilData = null

    if (role === 'Aluno') {
      if (!telefone || !cpf) {
        throw new Error('telefone e cpf são obrigatórios para role Aluno.')
      }
      const cpfExists = await this.alunoRepository.findByCpf(cpf)
      if (cpfExists) {
        throw new Error('CPF já cadastrado.')
      }
      perfilData = { nome: name, telefone, cpf }
    }

    if (role === 'Instrutor') {
      if (!telefone || !cnh || !placaVeiculo) {
        throw new Error('telefone, cnh e placaVeiculo são obrigatórios para role Instrutor.')
      }
      const cnhExists = await this.instrutorRepository.findByCnh(cnh)
      if (cnhExists) {
        throw new Error('CNH já cadastrada.')
      }
      perfilData = { nome: name, telefone, cnh, placaVeiculo }
    }

    // Criptografa a senha com custo 10
    const hashedPassword = await bcrypt.hash(password, 10)

    const { user, perfil } = await this.userRepository.createWithProfile({
      email,
      name,
      age,
      password: hashedPassword,
      role,
      perfil: perfilData
    })

    // Remove a senha do objeto de retorno por segurança
    const { password: _, ...userWithoutPassword } = user
    return { ...userWithoutPassword, perfil }
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw new Error('E-mail e senha são obrigatórios.')
    }

    // 1. Busca o usuário pelo e-mail
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new Error('E-mail ou senha incorretos.')
    }

    // 2. Compara a senha informada com o hash salvo no banco
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      throw new Error('E-mail ou senha incorretos.')
    }

    // 3. Gera o token JWT válido por 7 dias
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
        role: user.role
      },
      token
    }
  }

  async getAllUsers() {
    return await this.userRepository.findAll()
  }
}