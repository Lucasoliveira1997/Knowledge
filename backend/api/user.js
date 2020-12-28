const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validator

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)

    }

    const save = async (req, resp) => {
        const user = { ...req.body }

        if (req.params.id) user.id = req.params.id

        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'Email não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmedPassword, 'Confirmação de senha não informada')
            equalsOrError(user.password, user.confirmedPassword, 'Senhas não conferem')

            const userFromDb = await app.db('users').where({ email: user.email }).first()

            if (!user.id) {
                notExistsOrError(userFromDb, `Usuário ${user.email} já cadastrado!`)
            }

        } catch (msg) {
            return resp.status(400).send(msg)
        }

        user.password = encryptPassword(user.password)
        delete user.confirmedPassword

        if (user.id) {
            app.db('users').update(user).where({ id: user.id })
                .then(_ => resp.status(202).send(`User ${user.email} was updated`))
                .catch(error => resp.status(500).send(error))
        } else {
            app.db('users').insert(user)
                .then(_ => resp.status(201).send(`User ${user.email} was created`))
                .catch(error => resp.status(500).send(error))
        }
    }

    const get = async (req, resp) => {
        try {
            const users = await app.db('users').select('id', 'name', 'email', 'admin')

            return resp.status(200).json(users)

        } catch (error) {
            return resp.status(500).send(error)
        }
    }

    const getById = async (req, resp) => {
        const user = await app.db('users').select('id', 'name', 'email', 'admin').where({ id: req.params.id }).first()

        return resp.status(200).json(user)
    }

    return { save, get, getById }
}