const { poolQuery } = require('../conexoes/conexoes');

const depositar = async (req, res) => {
    const { conta, valor } = req.body

    try {
        const select = `select saldo from contas where numero = $1`
        const saldoAnterior = await poolQuery(select, [conta])
        const valorAnterior = saldoAnterior.rows[0].saldo
        const soma = Number(valorAnterior) + Number(valor)
        const update = `update contas set saldo = $1 where numero=$2`
        await poolQuery(update, [soma, conta])

        return res.status(201).json({ mensagem: `R$${valor} depositado` })

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })

    }
}
const sacar = async (req, res) => {
    const { conta, valor } = req.body

    try {
        const select = `select saldo from contas where numero = $1`
        const saldoAnterior = await poolQuery(select, [conta])
        const valorAnterior = saldoAnterior.rows[0].saldo

        if (Number(valorAnterior) > Number(valor)) {
            const subtracao = Number(valorAnterior) - Number(valor)
            const update = `update contas set saldo = $1 where numero=$2`
            await poolQuery(update, [subtracao, conta])
            return res.status(201).json({ mensagem: `Saque de R$${valor} realizado com sucesso` })
        }
        return res.status(400).json({ mensagem: `Saldo insuficiente` })


    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }


}
const transferir = async (req, res) => { }
const saldoAtual = async (req, res) => { }
const extrato = async (req, res) => { }
module.exports = {
    sacar,
    transferir,
    depositar,
    extrato,
    saldoAtual,
}