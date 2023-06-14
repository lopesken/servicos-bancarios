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

        return res.status(200).json({ mensagem: `R$${valor} depositado` })

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
            return res.status(200).json({ mensagem: `Saque de R$${valor} realizado com sucesso` })
        }
        return res.status(400).json({ mensagem: `Saldo insuficiente` })


    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }


}
const transferir = async (req, res) => {
    const { remetente, destinatario, valor } = req.body
    try {
        const selectRemetente = `select saldo from contas where numero = $1`
        const resultado = await poolQuery(selectRemetente, [remetente])
        const saldo = resultado.rows[0].saldo

        if (Number(saldo) > Number(valor)) {
            const select = `select saldo from contas where numero = $1`
            const saldoAnterior = await poolQuery(select, [destinatario])
            const sub = Number(saldo) - Number(valor)
            const updateRemetente = `update contas set saldo = $1 where numero = $2`
            await poolQuery(updateRemetente, [sub, remetente])

            const soma = Number(valor) + Number(saldoAnterior.rows[0].saldo)
            const updateDestinatario = `update contas set saldo = $1 where numero = $2`
            await poolQuery(updateDestinatario, [soma, destinatario])

            return res.status(200).json({ mensagem: `Transferencia realizada com sucesso` })
        }
        return res.status(400).json({ mensagem: `Saldo insuficiente` })

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}
const saldoAtual = async (req, res) => {
    const { conta } = req.body
    try {
        const select = `select saldo from contas where numero = $1`
        const resultado = await poolQuery(select, [conta])

        return res.status(200).json(resultado.rows)

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })

    }
}
module.exports = {
    sacar,
    transferir,
    depositar,
    saldoAtual
}