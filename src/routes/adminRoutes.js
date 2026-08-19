import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { UserRepository } from '../repositories/userRepository.js'
import { AlunoRepository } from '../repositories/AlunoRepository.js'
import { InstrutorRepository } from '../repositories/InstrutorRepository.js'
import { buildDashboardSummary } from '../services/AdminDashboardService.js'

const adminRoutes = Router()
const userRepository = new UserRepository()
const alunoRepository = new AlunoRepository()
const instrutorRepository = new InstrutorRepository()

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_super_segura'

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação obrigatório.' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso restrito ao administrador.' })
    }
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' })
  }
}

adminRoutes.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userRepository.findByEmail(email)

    if (!user || user.role !== 'ADMIN') {
      return res.status(401).json({ error: 'Credenciais inválidas para administrador.' })
    }

    const bcrypt = await import('bcryptjs')
    const match = await bcrypt.default.compare(password, user.password)

    if (!match) {
      return res.status(401).json({ error: 'Credenciais inválidas para administrador.' })
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    })
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao autenticar administrador.' })
  }
})

adminRoutes.get('/admin/dashboard', requireAdmin, async (req, res) => {
  try {
    const users = await userRepository.findAll()
    const alunos = await alunoRepository.findAll()
    const instrutores = await instrutorRepository.findAll()

    return res.status(200).json({
      ...buildDashboardSummary({ users, alunos, instrutores }),
      alunos,
      instrutores,
      usuarios: users
    })
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao carregar dashboard do administrador.' })
  }
})

adminRoutes.patch('/admin/instrutores/:id/disponibilidade', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { disponivel } = req.body
    const instrutor = await instrutorRepository.updateDisponibilidade(id, Boolean(disponivel))
    return res.status(200).json(instrutor)
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Não foi possível atualizar a disponibilidade.' })
  }
})

adminRoutes.delete('/admin/usuarios/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const user = await userRepository.findById(id)

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' })
    }

    if (user.role === 'ADMIN') {
      return res.status(400).json({ error: 'Não é possível excluir um administrador.' })
    }

    if (req.user && req.user.id === id) {
      return res.status(400).json({ error: 'Você não pode excluir sua própria conta de administrador.' })
    }

    await userRepository.deleteById(id)
    return res.status(200).json({ success: true, deletedUserId: id })
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Não foi possível excluir o usuário.' })
  }
})

export { adminRoutes }
