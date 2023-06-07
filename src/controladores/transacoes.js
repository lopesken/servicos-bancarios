// const { format } = require("date-fns");
const { v4: uuid } = require('uuid');
const { format } = require('date-fns')
//yyyy-mm-dd hh-mm-ss

const depositar = (req, res) => {
    try {
        const { numero_conta, valor } = req.body

        let filtroDeConta = contas.find(usuario => {
            return usuario.numero == numero_conta
        })
        if (!filtroDeConta) {
            return res.status(404).json({
                'mensagem': 'Conta não encontrada'
            })
        }

        if (filtroDeConta) {
            filtroDeConta.saldo = Number(filtroDeConta.saldo) + Number(valor)
            depositos.push({ data: format(new Date, 'yyyy-MM-dd HH:mm:ss'), numero_conta, valor });
            return res.status(200).json({
                'mensagem': `Deposito de ${valor} efetuado! `
            })
        }


    } catch (error) {
        return res.status(400).json({
            'mensagem': `Erro no servidor ${error.message}`
        })
    }
}
const sacar = (req, res) => {
    try {
        const { numero_conta, valor } = req.body

        let filtroDeConta = contas.find(usuario => {
            return usuario.numero == numero_conta
        })

        if (filtroDeConta.saldo < valor) {
            return res.status(403).json({
                'mensagem': 'Saldo insuficiente!'
            })
        }

        if (filtroDeConta) {
            filtroDeConta.saldo = Number(filtroDeConta.saldo) - Number(valor)
            saques.push({ data: format(new Date, 'yyyy-MM-dd HH:mm:ss'), numero_conta, valor })
            return res.status(200).json({
                'mensagem': `Saque de ${valor} efetuado! `
            })
        }

    } catch (error) {
        return res.status(400).json({
            'mensagem': `Erro no servidor ${error.message}`
        })
    }
}
const transferir = (req, res) => {
    try {
        const { numero_conta_origem
            , valor, numero_conta_destino
        } = req.body

        let filtroDeConta = contas.find((usuario) => {
            return usuario.numero == numero_conta_origem

        })
        let filtroDeContaDestino = contas.find((usuario) => {
            return usuario.numero == numero_conta_destino

        })
        if (!filtroDeConta || !filtroDeContaDestino) {
            return res.status(404).json({
                'mensagem': 'Conta não encontrada'
            })
        }

        if (filtroDeConta.saldo < valor) {
            return res.status(403).json({
                'mensagem': 'Saldo insuficiente!'
            })
        }
        if (!valor || valor <= 0) {
            return res.status(403).json({
                'mensagem': 'Saldo não informado ou inferior a 0!'
            })
        }
        if (filtroDeConta == filtroDeContaDestino) {
            return res.status(403).json({
                'mensagem': 'Conta de origem e destino são iguais, transação não realizada.'
            })
        }

        if (filtroDeConta && filtroDeContaDestino) {
            filtroDeConta.saldo = filtroDeConta.saldo - valor;
            filtroDeContaDestino.saldo = Number(filtroDeContaDestino.saldo) + Number(valor);
            transferencias.push({ data: format(new Date, 'yyyy-MM-dd HH:mm:ss'), numero_conta_origem, numero_conta_destino, valor });

            return res.status(200).json({
                'mensagem': `Transferência de ${valor} efetuado! `
            })

        }

    } catch (error) {
        return res.status(400).json({
            'mensagem': `Erro no servidor ${error.message}`
        })
    }
}
const saldoAtual = (req, res) => {
    const { numero_conta } = req.query

    const encontrarConta = contas.find((usuario) => {
        return usuario.numero == numero_conta
    })
    return res.status(200).json({
        'mensagem': `Saldo de R$${encontrarConta.saldo}`
    })
}
const extrato = (req, res) => {
    try {
        const { numero_conta } = req.query

        if (contas.length === 0) {
            return res.status(404).json({
                'mensagem': 'Não temos usuários em nossa base de dados'
            })
        }

        const extratoDepositos = depositos.filter((depositos) => {
            return depositos.numero_conta == numero_conta
        })
        const extratoSaques = saques.filter((saques) => {
            return saques.numero_conta == numero_conta
        })
        const transferenciasRecebidas = transferencias.filter((transferencias) => {
            return transferencias.numero_conta_destino == numero_conta
        })
        const transferenciasEnviadas = transferencias.filter((transferencias) => {
            return transferencias.numero_conta_origem == numero_conta
        })

        if (extratoDepositos || extratoSaques || extratoTransferenciasRecebidas || extratoTransferenciasEnviadas) {
            return res.status(200).json({
                extratoDepositos,
                extratoSaques, transferenciasEnviadas, transferenciasRecebidas
            })
        }
    } catch (error) {
        return res.status(400).json({
            'mensagem': `Erro no servidor ${error.message}`
        });
    }
}
module.exports = {
    sacar,
    transferir,
    depositar,
    extrato,
    saldoAtual,
}