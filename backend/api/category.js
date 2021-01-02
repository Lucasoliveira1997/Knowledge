module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validator

    const save = async (req, resp) => {
        const category = { ...req.body }

        if (req.params.id) category.id = req.params.id

        try {
            existsOrError(category.name, 'Nome não informado')
        } catch (error) {
            return resp.status(400).send(error)
        }

        if (category.id) {
            try {
                const categoryUpdated = await app.db('categories').update(category).where({ id: category.id })
                return resp.status(202).send(`Category ${category.name} it was updated - ${categoryUpdated}`)
            } catch (error) {
                return resp.status(500).send(error)
            }
        } else {
            try {
                const categoryCreated = await app.db('categories').insert(category)
                return resp.status(201).send(`Category ${category.name} it was created - ${categoryCreated}`)
            } catch (error) {
                return resp.status(500).send(error)
            }
        }
    }

    const remove = async (req, resp) => {
        try {
            existsOrError(req.params.id, 'Código da categoria não informado!')

            const subCategory = await app.db('categories').where({ parentId: req.params.id })
            notExistsOrError(subCategory, 'Categoria possui subcategorias.')

            const articles = await app.db('articles').where({ categoryId: req.params.id })
            notExistsOrError(articles, 'Categoria possui artigos.')

            const rowsDeleted = await app.db('categories').where({ id: req.params.id }).del()
            existsOrError(rowsDeleted, 'Categoria não foi deletada')

            return resp.status(204).send(`Category ${req.params.id} it was deleted!`)
        } catch (error) {
            return resp.status(500).send(error)
        }
    }

    const withpath = categories => {
        const getParent = (categories, parentId) => {
            const parent = categories.filter(category => category.id === parentId)
            return parent.length ? parent[0] : null
        }

        const categoriesWithPath = categories.map(category => {
            let path = category.name
            let parent = getParent(categories, category.parentId)

            while (parent) {
                path = `${parent.name} > ${path}`
                parent = getParent(categories, parent.parentId)
            }

            return { ...category, path }
        })

        categoriesWithPath.sort((a, b) => {
            if (a.path < b.path) return -1
            if (a.path > b.path) return 1
            return 0
        })

        return categoriesWithPath
    }

    const get = async (req, resp) => {
        try {
            const categories = await app.db('categories')
            return resp.status(200).json(withpath(categories))

        } catch (error) {
            return resp.status(500).send(error)
        }
    }

    const getById = async (req, resp) => {
        try {
            const category = await app.db('categories').where({ id: req.params.id }).first()
            return resp.status(200).json(category)
        } catch (error) {
            return resp.status(500).send(error)
        }


    }

    return { save, get, getById, remove }
}
