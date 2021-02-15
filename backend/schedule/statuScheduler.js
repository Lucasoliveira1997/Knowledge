const schedule = require('node-schedule')

module.exports = app => {

    schedule.scheduleJob('*/1 * * * *', async () => {
        const usersCount = await app.db('users').count('id').first()
        const categoriesCount = await app.db('categories').count('id').first()
        const articlesCount = await app.db('articles').count('id').first()

        const { Stat } = app.api.stat

        const lastStat = await Stat.findOne({}, {}, { sort: { 'createdAt': -1 } })

        const stat = new Stat({
            articles: articlesCount.count,
            categories: categoriesCount.count,
            users: usersCount.count,
            createdAt: new Date()
        })

        const changeUsers = !lastStat || lastStat.users !== stat.users
        const changeCategories = !lastStat || lastStat.categories !== stat.categories
        const changeArticles = !lastStat || lastStat.articles !== stat.articles

        if(changeUsers || changeCategories || changeArticles) {
            stat.save().then(() => console.log('[Stats] Estatísticas atualizadas!'))
        }
    })
}