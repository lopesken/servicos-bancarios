const bcrypt = require('bcrypt');
const { poolQuery } = require('../conexoes/conexoes')

const validarSenha = async (req, res, next) => {
    const { email, senha } = req.body

    try {
        const select = `select * from usuarios where email=$1`
        const result = await poolQuery(select, [email])
        let usuario = result.rows[0]

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

        if (!senhaCorreta) {
            return res.status(401).json({
                mensagem: "Usuário e/ou senha inválido(s)."
            })
        }
        const { senha: secret, ...usuarioSemSenha } = usuario
        req.usuario = usuarioSemSenha

        next()
    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}
const validarDados = (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    if (!nome || !data_nascimento || !telefone || !email || !senha || !cpf) {
        return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios.' });
    }
    if (senha && senha.length < 6) {
        return res.status(400).json({ mensagem: 'A senha deve ter pelo menos 6 caracteres.' });
    }
    if (cpf && cpf.length !== 11 && cpf !== Number(cpf)) {
        return res.status(400).json({ mensagem: 'O CPF deve conter 11 caracteres numéricos.' });

    }


    next()
}
const validarDadosAtualizar = (req, res, next) => {
    const { nome, data_nascimento, telefone, email, senha } = req.body

    if (!nome || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios.' });
    }
    if (senha && senha.length < 6) {
        return res.status(400).json({ mensagem: 'A senha deve ter pelo menos 6 caracteres.' });
    }
    next()

}
const duplicidade = async (req, res, next) => {
    const { cpf } = req.body

    try {
        const select = `select * from usuarios where cpf = $1`
        const resultado = await poolQuery(select, [cpf])

        if (resultado.rowCount !== 0) {
            return res.status(400).json({ mensagem: `Há usuario cadastrado com o CPF ou Email informado` })
        }

        next()
    } catch (error) {
        return res.status(500).json({ mensagem: error.mensagem })
    }
}
module.exports = {
    validarSenha,
    validarDados,
    duplicidade,
    validarDadosAtualizar
}