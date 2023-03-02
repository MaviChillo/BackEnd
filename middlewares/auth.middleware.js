export function auth(req, res, next){
    if(req.session.logged){
        next()
    }else{
        res.redirect('/login')
    }
}

export function isLogged(req, res, next){
    if(req.session.logged){
        if(req.session.admin){
            res.redirect('/admin')
        }else{
            res.redirect('/products')
        }
    }else{
        next()
    }
}

export function isAdmin(req, res, next) {
    if(req.session.admin){
        next()
    } else {
        res.redirect('/products')
    }
}

// export function isUser(req, res, next) {
//     if(req.session.user){
//         next()
//     } else {
//         res.redirect('/admin')
//     }
// }