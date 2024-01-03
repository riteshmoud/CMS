const {db} = require('../../db')
const bcrypt = require('bcrypt')

const adminLogin = async (req,res)=>{
    const {username,password} = req.body.formData
    if(username === 'admin'){
        const findQuery = 'SELECT * FROM admin WHERE admin.username = ?'
        const [results] = await db.execute(
            findQuery,
            [username],
        );
        // adminSession = results[0]
        if(bcrypt.compareSync(password,results[0].password)){
            req.session.user = 'admin'
            res.status(200).send('Admin logged in')
        }else{
            res.status(401).send('Invalid password')
        }
    }else{
        res.status(400).send("Not a valid username!")
    }
}

module.exports = {adminLogin}