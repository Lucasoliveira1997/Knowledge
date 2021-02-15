const queries = require('./queries')

module.exports = app => {
    const { existsOrError } = app.api.validator

    const save = async (req, resp) => {
        const article = { ...req.body }
        if (req.params.id) article.id = req.params.id

        try {
            existsOrError(article.name, 'Nome não informado')
            existsOrError(article.description, 'Descrição não informada')
            existsOrError(article.categoryId, 'Categoria não informada')
            existsOrError(article.userId, 'Autor não informado')
            existsOrError(article.content, 'Conteúdo não informado')
        } catch (error) {
            resp.status(400).send(error)
        }

        if (article.id) {
            try {
                const articleUpdated = await app.db('articles').update(article).where({ id: article.id })
                return resp.status(202).send(articleUpdated)
            } catch (error) {
                return resp.status(500).send(error)
            }
        } else {
            try {
                const articleCreated = await app.db('articles').insert(article)
                return resp.status(201).send(articleCreated)
            } catch (error) {
                return resp.status(500).send(error)
            }
        }
    }

    const limit = 10
    const get = async (req, resp) => {
        const page = req.query.page || 1

        try {
            const result = await app.db('articles').count('id').first()

            const articles = await app.db('articles').select('id', 'name', 'description').limit(limit).offset(Number(page) * limit - limit)

            return resp.status(200).send({ data: articles, limit, page, count: result.count })

        } catch (error) {
            return resp.status(500).send(error)
        }
    }

    const getById = async (req, resp) => {
        try {
            const id = await app.db('articles').select('id').where({ id: req.params.id })

            existsOrError(id, 'Id inválido')

            const article = await app.db('articles').where({ id: req.params.id })

            return resp.status(200).send(article)
        } catch (error) {
            return resp.status(500).send(error)
        }
    }

    const getByCategory = async (req, resp) => {
        const page = req.query.page || 1
        const categoryId = req.params.id

        try {
            const categories = await app.db.raw(queries.categoryWithChildren, categoryId)
            const ids = categories.rows.map(category => category.id)

            const articlesByCategory = await app.db({ a: 'articles', u: 'users' })
                .select('a.id', 'a.name', 'a.description', 'a.imageUrl', { author: 'u.name' })
                .limit(limit).offset(page * limit - limit)
                .whereRaw('?? = ??', ['u.id', 'a.userId'])
                .whereIn('categoryId', ids)
                .orderBy('a.id', 'desc')

            return resp.status(200).json(articlesByCategory)
        } catch (error) {
            return resp.status(500).send(error)
        }
    }

    const remove = async (req, resp) => {
        try {
            const id = await app.db('articles').select('id').where({ id: req.params.id })

            try {
                existsOrError(id, 'Id inválido')
            } catch (error) {
                return resp.status(400).send(error)
            }

            const rowsDeleted = await app.db('articles').where({ id: req.params.id }).del()
            existsOrError(rowsDeleted, 'Artigo não encontrado.')

            return resp.status(204).send('Artigo excluído com sucesso')
        } catch (error) {
            return resp.status(500).send(error)
        }
    }

    return { save, remove, get, getById, getByCategory }
}