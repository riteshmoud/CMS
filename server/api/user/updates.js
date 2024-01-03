const {userExists} = require('../../functions')
const {db} = require('../../db')
const bcrypt = require('bcrypt')

// used in bcrypt function
const saltRounds = 10

const userUpdate = async (req,res)=>{
    const {fullname,email,contact,state} = req.body.formData
    // const userExists = await userExists(email)
    console.log(req.session);
    if(!await userExists(email) || email === req.session.user.email){
                const sqlUpdate = 'UPDATE users SET fullname = ?,email = ?,contact = ?,state = ? WHERE users.user_id = ?'
                const results = await db.execute(
                    sqlUpdate,
                    [fullname,email,contact,state,req.session.user.user_id]
                );
                req.session.user = {...req.session.user,fullname,email,contact,state}
                res.status(200).send({fullname,email,contact,state})
    }else{
        res.status(400).send("User already exists")
    }
}

const userUpdatePassword = async (req,res)=>{
    const {old_password,new_password} = req.body.formData
    if(!bcrypt.compareSync(old_password,req.session.user.password)){
        res.status(400).send('Old password is incorrect')
    }
    else{
        bcrypt.hash(new_password,saltRounds,async (err,hashPwd)=>{
            if(err){
                res.status(400).send('Server Error')
            }else{
                const sqlUpdate = 'UPDATE users SET password = ? WHERE users.user_id = ?'
                const [results] = await db.execute(
                    sqlUpdate,
                    [hashPwd,req.session.user.user_id],
                );
                req.session.user = {...req.session.user,password:hashPwd}
                res.status(200).send('User password updated')
            }
        })
    }       
}


module.exports = {userUpdate,userUpdatePassword}