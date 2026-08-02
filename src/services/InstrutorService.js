export class InstrutorService {
  constructor(instrutorRepository, userRepository) {
    this.instrutorRepository = instrutorRepository
    this.userRepository = userRepository
  }

  async createInstrutor({ userId, nome, telefone, cnh, placaVeiculo }) {
    if (!userId || !nome || !telefone || !cnh || !placaVeiculo) {
      throw new Error('userId, nome, telefone, cnh e placaVeiculo são obrigatórios.')
    }

    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new Error('Usuário não encontrado.')
    }

    const instrutorExists = await this.instrutorRepository.findByUserId(userId)
    if (instrutorExists) {
      throw new Error('Este usuário já possui um perfil de instrutor.')
    }

    const cnhExists = await this.instrutorRepository.findByCnh(cnh)
    if (cnhExists) {
      throw new Error('CNH já cadastrada.')
    }

    // id do Instrutor = id do User (chave primária compartilhada)
    return await this.instrutorRepository.create({ id: userId, nome, telefone, cnh, placaVeiculo })
  }

  async getByUserId(userId) {
    const instrutor = await this.instrutorRepository.findByUserId(userId)
    if (!instrutor) {
      throw new Error('Perfil de instrutor não encontrado.')
    }
    return instrutor
  }

  async getById(id) {
    const instrutor = await this.instrutorRepository.findById(id)
    if (!instrutor) {
      throw new Error('Instrutor não encontrado.')
    }
    return instrutor
  }

  async listDisponiveis() {
    return await this.instrutorRepository.findAllDisponiveis()
  }

  async setDisponibilidade(id, disponivel) {
    const instrutor = await this.instrutorRepository.findById(id)
    if (!instrutor) {
      throw new Error('Instrutor não encontrado.')
    }
    return await this.instrutorRepository.updateDisponibilidade(id, disponivel)
  }

  async updatePriceAula(id, precoAula) {
    const instrutor = await this.instrutorRepository.findById(id)
    if (!instrutor) {
      throw new Error('Instrutor não encontrado.')
    }

    if (precoAula === undefined || precoAula === null) {
      throw new Error('precoAula é obrigatório.')
    }

    const precoNumerico = Number(precoAula)
    if (Number.isNaN(precoNumerico) || precoNumerico < 0) {
      throw new Error('precoAula deve ser um número válido e maior ou igual a zero.')
    }

    return await this.instrutorRepository.updatePriceAula(id, precoNumerico)
  }
}
