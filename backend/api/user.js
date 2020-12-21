module.exports = app => {

    const save = (req, resp) => {
        resp.send('users save')
    }

    return { save }
}