const mongoose = require('mongoose')

const { mongoDb } = require('../.env')

mongoose.connect(mongoDb.url, mongoDb.options)
    .catch(e => {
        const msg = 'ERRO: Não foi possivel conectar com o MongoDB'
        console.log('\x1b[41m%s\x1b[37m', msg, '\x1b[0m')
    })