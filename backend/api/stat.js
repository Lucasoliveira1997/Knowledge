module.exports = app => {

    const Stat = app.mongoose.model('Stat', {
        users: Number,
        categories: Number,
        articles: Number,
        createdAt: Date
    })

    const get = async (req, resp) => {
        try {
            const status = await Stat.findOne({}, {}, { sort: { 'createdAt': -1 } })

            return resp.status(200).send(status || { articles: 0, categories: 0, users: 0, })
        } catch (error) {
            return resp.status(500).send(status)
        }
    }

    return { Stat, get }
}