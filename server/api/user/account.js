const {userExists, validatePassword} = require('../../functions')
const bcrypt = require('bcrypt')
const {db} = require('../../db')

// used in bcrypt function
const saltRounds = 10

const userSignIn = async (req,res)=>{
    const {email,password} = req.body.formData
    let authUser = new Object({})
    if(await userExists(email)){
        if(await validatePassword(email,password,authUser)){
            req.session.user = authUser.user
            res.status(200).send('User logged in')
        }else{
            res.status(400).send("Invalid password!")
        }
    }else{
        res.status(400).send("Not a valid user!")
    }
}


const userRegistration = async (req,res)=>{
    const {fullname,email,password,contact} = req.body.formData
    if(await userExists(email)){
        res.status(400).send("User already exists")
    }else{
        bcrypt.hash(password,saltRounds,async (err,hashPwd)=>{
            if(err){
                res.status(400).send('Cannot register user')
            }else{
                let date = (new Date()).toLocaleDateString() + '  ' + (new Date()).toLocaleTimeString()
                const sqlInsert = 'INSERT INTO users (fullname,email,password,contact,registered_on) VALUES (?,?,?,?,?)'
                const [results] = await db.execute(
                    sqlInsert,
                    [fullname,email,hashPwd,contact,date],
                );
                res.status(200).send('User added')
            }
        })
    }
}

const logout = (req,res) => {
    req.session.destroy();
    res.status(200).send('User logged out')
}

module.exports = {userSignIn,userRegistration,logout}