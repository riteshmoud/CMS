const {db} = require('../../db')
const bcrypt = require('bcrypt')

const postRemarks = async (req,res)=>{
    console.log(req.body);
    if(req.body.rem === ''){
        res.status(400).send('Enter remarks')
    }else{
        const updateRemarks = 'UPDATE complaints SET remarks = ? WHERE comp_id = ?'
        const [results] = await db.execute(
            updateRemarks,
            [req.body.rem,req.body.comp_id]
        );
        res.status(200).send('Remark Added')
    }
}

const adminUpdatePassword = async (req,res)=>{
    const {old_password,new_password} = req.body.formData
    console.log(req.body.formData);
    if(!bcrypt.compareSync(old_password,req.session.user.password)){
        res.status(400).send('Old password is incorrect')
    }
    else{
        bcrypt.hash(new_password,saltRounds,async (err,hashPwd)=>{
            if(err){
                res.status(400).send('Server Error')
            }else{
                const sqlUpdate = 'UPDATE admin SET password = ? WHERE admin.username = "admin"'
                const [results] = await db.execute(
                    sqlUpdate,
                    [hashPwd],
                );
                res.status(200).send('User password updated')
            }
        })
    }     
}

module.exports = {postRemarks,adminUpdatePassword}