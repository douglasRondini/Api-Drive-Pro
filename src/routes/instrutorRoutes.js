import { Router } from 'express'
import { InstrutorController } from '../controllers/InstrutorController.js'

const instrutorRoutes = Router()
const instrutorController = new InstrutorController()

/**
 * @swagger
 * /instrutores:
 *   post:
 *     summary: Cria o perfil de instrutor vinculado a um usuário já cadastrado
 *     tags: [Instrutores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, nome, telefone, cnh, placaVeiculo]
 *             properties:
 *               userId:
 *                 type: string
 *               nome:
 *                 type: string
 *               telefone:
 *                 type: string
 *               cnh:
 *                 type: string
 *               placaVeiculo:
 *                 type: string
 *             example:
 *               userId: "652f1c2e8f1b2c3a4d5e6f7b"
 *               nome: "Carlos Lima"
 *               telefone: "11988887777"
 *               cnh: "98765432100"
 *               placaVeiculo: "ABC1D23"
 *     responses:
 *       201:
 *         description: Perfil de instrutor criado com sucesso
 *       400:
 *         description: Dados inválidos, usuário inexistente ou CNH já cadastrada
 */
instrutorRoutes.post('/instrutores', (req, res) => instrutorController.create(req, res))

/**
 * @swagger
 * /instrutores/disponiveis:
 *   get:
 *     summary: Lista os instrutores marcados como disponíveis
 *     tags: [Instrutores]
 *     responses:
 *       200:
 *         description: Lista de instrutores disponíveis
 */
instrutorRoutes.get('/instrutores/disponiveis', (req, res) => instrutorController.listDisponiveis(req, res))

/**
 * @swagger
 * /instrutores/{id}:
 *   get:
 *     summary: Busca um instrutor pelo ID do perfil de instrutor
 *     tags: [Instrutores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do instrutor
 *       404:
 *         description: Instrutor não encontrado
 */
instrutorRoutes.get('/instrutores/:id', (req, res) => instrutorController.getById(req, res))

/**
 * @swagger
 * /instrutores/usuario/{userId}:
 *   get:
 *     summary: Busca o perfil de instrutor a partir do ID do usuário (login)
 *     tags: [Instrutores]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do instrutor
 *       404:
 *         description: Perfil de instrutor não encontrado para este usuário
 */
instrutorRoutes.get('/instrutores/usuario/:userId', (req, res) => instrutorController.getByUserId(req, res))

/**
 * @swagger
 * /instrutores/{id}/disponibilidade:
 *   patch:
 *     summary: Atualiza a disponibilidade do instrutor para novas aulas
 *     tags: [Instrutores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [disponivel]
 *             properties:
 *               disponivel:
 *                 type: boolean
 *             example:
 *               disponivel: true
 *     responses:
 *       200:
 *         description: Disponibilidade atualizada
 *       400:
 *         description: Instrutor não encontrado
 */
instrutorRoutes.patch('/instrutores/:id/disponibilidade', (req, res) => instrutorController.updateDisponibilidade(req, res))

export { instrutorRoutes }
