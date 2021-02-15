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
            try {
                const userUpdated = await app.db('users').update(user).where({ id: user.id }).whereNull('deletedAt')
                return resp.status(202).send(`User ${user.email} was updated - ${userUpdated}`)

            } catch (error) {
                return resp.status(500).send(error)
            }
        } else {
            try {
                const userCreated = await app.db('users').insert(user)
                return resp.status(201).send(`User ${user.email} was created - ${userCreated}`)

            } catch (error) {
                return resp.status(500).send(error)
            }
        }
    }

    const get = async (req, resp) => {
        try {
            const users = await app.db('users').select('id', 'name', 'email', 'admin', 'deletedAt').whereNull('deletedAt')

            return resp.status(200).json(users)

        } catch (error) {
            return resp.status(500).send(error)
        }
    }

    const getById = async (req, resp) => {

        try {
            const id = await app.db('users').select('id').where({ id: req.params.id })

            existsOrError(id, 'Id inválido')

            const user = await app.db('users').select('id', 'name', 'email', 'admin')
                .where({ id: req.params.id }).whereNull('deletedAt').first()

            return resp.status(200).json({ user, id })

        } catch (error) {
            return resp.status(500).send(error)
        }
    }

    const remove = async (req, resp) => {
        try {
            const articles = await app.db('articles').where({ userId: req.params.id })

            notExistsOrError(articles, 'Existem artigos associados a esse usuário')

            const rowsUpdated = await app.db('users').update({ deletedAt: new Date() }).where({ id: req.params.id })

            existsOrError(rowsUpdated, 'Usuário não encontrado')

            return resp.status(204).send('Usuário deletado')

        } catch (error) {
            return resp.status(500).send(error)
        }
    }

    return { save, get, getById, remove }
}