const jwt = require('jsonwebtoken');
const { poolQuery } = require('../conexoes/conexoes');

const autenticacao = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ mensagem: "Usuario não autenticado" })
    }

    try {
        const token = authorization.split(' ')[1]

        const { id } = jwt.verify(token, process.env.JWT);

        const select = "SELECT * FROM usuarios WHERE id = $1"
        const resultado = await poolQuery(select, [id])

        if (!resultado.rowCount) {
            return res.status(401).json({ mensagem: "Usuario não autenticado" })
        }

        const { senha, ...usuarioLogado } = resultado.rows[0]

        req.usuarioLogado = usuarioLogado

        next()
    } catch (error) {
        return res.status(401).json({ mensagem: "Para acessar esse recurso, informe um token de autenticação válido." })
    }
}

module.exports = autenticacao