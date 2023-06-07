const { v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { poolQuery } = require('../conexoes/conexoes');


const criarUsuario = async (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    try {
        const criptografia = await bcrypt.hash(senha, 10)
        const insert = `insert into usuarios (nome, cpf, data_nascimento, telefone, email, senha) values ($1,$2,$3,$4,$5,$6)`
        await poolQuery(insert, [nome, cpf, data_nascimento, telefone, email, criptografia])

        return res.status(201).json({ mensagem: `Usuário criado com sucesso` })
    } catch (error) {
        return res.status(500).json({ 'mensagem': `Erro no servidor ${error.message}` })
    }
}
const criarConta = async (req, res) => {
    let { id } = req.usuario
    try {
        let numero = uuid()
        const insert = `insert into contas (numero, usuario_id) values ($1,$2)`
        await poolQuery(insert, [numero, id])

        return res.status(201).json({ mensagem: `Conta criada com sucesso` })
    } catch (error) {
        return res.status(500).json({ 'mensagem': `Erro no servidor ${error.message}` })

    }
}
const login = async (req, res) => {
    const { id } = req.usuario

    try {
        const token = jwt.sign({ id: id }, process.env.JWT, { expiresIn: '1h' })
        return res.status(200).json({ id, token })

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}
const listarContas = async (req, res) => {
    const { id } = req.usuario
    try {
        const select = `select * from contas where usuario_id = $1`
        const resultado = await poolQuery(select, [id])
        const contas = resultado.rows
        return res.status(200).json({ contas })
    } catch (error) {
        return res.status(400).json({
            'mensagem': `Erro no servidor ${error.message}`
        });
    }
}
const atualizarDados = async (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const { id } = req.usuarioLogado
    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10)
        console.log(senhaCriptografada)
        const update = `update usuarios set nome = $1, cpf =$2, data_nascimento =$3, telefone =$4, email =$5, senha =$6 where id=$7`
        await poolQuery(update, [nome, cpf, data_nascimento, telefone, email, senhaCriptografada, id])

        return res.status(201).json()
    } catch (error) {
        return res.status(500).json({
            'mensagem': `Erro no servidor ${error.message}`
        })
    }
}
const excluirConta = async (req, res) => {
    const { id } = req.params
    try {
        const deletar = `delete from contas where id = $1`
        const resultado = await poolQuery(deletar, [id])

        return res.status(202).json({ mesangem: `Conta excluida` })
    } catch (error) {
        return res.status(400).json({
            'mensagem': `Erro no servidor ${error.message}`
        })
    }
}



module.exports = {
    criarUsuario,
    criarConta,
    listarContas,
    atualizarDados,
    excluirConta,
    login
}