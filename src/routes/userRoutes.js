import { Router } from 'express'
import { UserController } from '../controllers/userController.js'

const userRoutes = Router()
const userController = new UserController()

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário e já gera automaticamente o perfil de Aluno ou Instrutor conforme a role
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, age, password]
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               age:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Aluno, Instrutor, ADMIN]
 *                 default: Aluno
 *                 description: Define a role do usuário. Se Aluno ou Instrutor, o perfil correspondente é criado junto na mesma transação.
 *               telefone:
 *                 type: string
 *                 description: Obrigatório para role Aluno ou Instrutor
 *               cpf:
 *                 type: string
 *                 description: Obrigatório para role Aluno
 *               cnh:
 *                 type: string
 *                 description: Obrigatório para role Instrutor
 *               placaVeiculo:
 *                 type: string
 *                 description: Obrigatório para role Instrutor
 *           examples:
 *             aluno:
 *               summary: Cadastro de Aluno
 *               value:
 *                 email: julia@email.com
 *                 name: Julia
 *                 age: "20"
 *                 password: "minhasenha123"
 *                 role: Aluno
 *                 telefone: "11999998888"
 *                 cpf: "12345678900"
 *             instrutor:
 *               summary: Cadastro de Instrutor
 *               value:
 *                 email: carlos@email.com
 *                 name: Carlos Lima
 *                 age: "35"
 *                 password: "minhasenha123"
 *                 role: Instrutor
 *                 telefone: "11988887777"
 *                 cnh: "98765432100"
 *                 placaVeiculo: "ABC1D23"
 *     responses:
 *       201:
 *         description: Usuário (e perfil, se aplicável) criado com sucesso
 *       400:
 *         description: E-mail já cadastrado, CPF/CNH já cadastrado ou dados inválidos
 */
userRoutes.post('/users', (req, res) => userController.create(req, res))

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
userRoutes.get('/users', (req, res) => userController.list(req, res))

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autentica um usuário e retorna o Token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: julia@email.com
 *               password: "minhasenha123"
 *     responses:
 *       200:
 *         description: Login efetuado com sucesso (retorna usuário e token)
 *       401:
 *         description: Credenciais inválidas
 */
// Corrigido 'resp' para 'res' aqui:
userRoutes.post('/login', (req, res) => userController.login(req, res))




export { userRoutes }