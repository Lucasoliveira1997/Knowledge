module.exports = middleware => {
    return (req, resp, next) => {

        if(!req.user.admin) {
            return resp.status(402).send('Usuário não é administrador')
        }
        
        middleware(req,resp,next)      
    }
}