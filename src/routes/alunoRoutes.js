import { Router } from 'express'
import { AlunoController } from '../controllers/AlunoController.js'

const alunoRoutes = Router()
const alunoController = new AlunoController()

/**
 * @swagger
 * /alunos:
 *   post:
 *     summary: Cria o perfil de aluno vinculado a um usuário já cadastrado
 *     tags: [Alunos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, nome, telefone, cpf]
 *             properties:
 *               userId:
 *                 type: string
 *               nome:
 *                 type: string
 *               telefone:
 *                 type: string
 *               cpf:
 *                 type: string
 *             example:
 *               userId: "652f1c2e8f1b2c3a4d5e6f7a"
 *               nome: "Julia Souza"
 *               telefone: "11999998888"
 *               cpf: "12345678900"
 *     responses:
 *       201:
 *         description: Perfil de aluno criado com sucesso
 *       400:
 *         description: Dados inválidos, usuário inexistente ou CPF já cadastrado
 */
alunoRoutes.post('/alunos', (req, res) => alunoController.create(req, res))

/**
 * @swagger
 * /alunos/{id}:
 *   get:
 *     summary: Busca um aluno pelo ID do perfil de aluno
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do aluno
 *       404:
 *         description: Aluno não encontrado
 */
alunoRoutes.get('/alunos/:id', (req, res) => alunoController.getById(req, res))

/**
 * @swagger
 * /alunos/usuario/{userId}:
 *   get:
 *     summary: Busca o perfil de aluno a partir do ID do usuário (login)
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do aluno
 *       404:
 *         description: Perfil de aluno não encontrado para este usuário
 */
alunoRoutes.get('/alunos/usuario/:userId', (req, res) => alunoController.getByUserId(req, res))

export { alunoRoutes }
