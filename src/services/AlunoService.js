export class AlunoService {
  constructor(alunoRepository, userRepository) {
    this.alunoRepository = alunoRepository
    this.userRepository = userRepository
  }

  async createAluno({ userId, nome, telefone, cpf }) {
    if (!userId || !nome || !telefone || !cpf) {
      throw new Error('userId, nome, telefone e cpf são obrigatórios.')
    }

    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new Error('Usuário não encontrado.')
    }

    const alunoExists = await this.alunoRepository.findByUserId(userId)
    if (alunoExists) {
      throw new Error('Este usuário já possui um perfil de aluno.')
    }

    const cpfExists = await this.alunoRepository.findByCpf(cpf)
    if (cpfExists) {
      throw new Error('CPF já cadastrado.')
    }

    // id do Aluno = id do User (chave primária compartilhada)
    return await this.alunoRepository.create({ id: userId, nome, telefone, cpf })
  }

  async getByUserId(userId) {
    const aluno = await this.alunoRepository.findByUserId(userId)
    if (!aluno) {
      throw new Error('Perfil de aluno não encontrado.')
    }
    return aluno
  }

  async getById(id) {
    const aluno = await this.alunoRepository.findById(id)
    if (!aluno) {
      throw new Error('Aluno não encontrado.')
    }
    return aluno
  }
}
