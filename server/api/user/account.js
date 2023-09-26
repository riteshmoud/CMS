const {userExists} = require('../../functions')

const userSignIn = async (req,res)=>{
    const {email,password} = req.body.formData
    if(await userExists(email)){
        if(await validatePassword(email,password)){
            req.session.user = authorizedUser
            res.status(200).send('User logged in')
        }else{
            res.status(400).send("Invalid password!")
        }
    }else{
        res.status(400).send("Not a valid user!")
    }
}

module.exports = {userSignIn}