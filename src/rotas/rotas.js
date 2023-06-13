const express = require('express')
const rotas = express.Router()

const {
    criarConta,
    listarContas,
    excluirConta,
    atualizarDados,
    criarUsuario,
    login
} = require('../controladores/usuarios')
const {
    sacar,
    transferir,
    depositar,
    extrato,
    saldoAtual,
} = require('../controladores/transacoes')
const {
    validarDados, validarSenha, duplicidade, validarDadosAtualizar
} = require('../intermediarios/validações')
const autenticacao = require('../intermediarios/token')

rotas.get('/', (req, res) => {
    return res.status(200).json({
        'mensagem': "Bem vindo ao Bank Cubos"
    })
})
rotas.post('/usuario', validarDados, duplicidade, criarUsuario)
rotas.post('/login', validarSenha, login)
rotas.use(autenticacao)
rotas.post('/conta', criarConta)
rotas.get('/conta', listarContas)
rotas.patch('/usuario', validarDadosAtualizar, atualizarDados)
rotas.delete('/excluir/:id', excluirConta)

rotas.patch('/depositar', depositar)
rotas.get('/sacar', sacar)
rotas.get('/transferir', transferir)
rotas.get('/saldo', saldoAtual)
rotas.get('/extrato', extrato)

module.exports = rotas