const authSession = (req,res)=>{
    console.log(req.session.user);
    if(req.session.user === 'admin'){
        res.status(200).send('admin')
    }else if(req.session.user && req.session.user !== 'admin'){
        res.status(200).send('user')
    }else{
        res.status(401).send('unauthorized user')
    }
}

module.exports = {authSession}