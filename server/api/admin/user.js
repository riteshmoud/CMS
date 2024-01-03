const {db} = require('../../db')

const getUsers = async (req,res)=>{
    const getUsers = 'SELECT user_id,email,fullname,contact,state,registered_on FROM users'
    const [results] = await db.execute(
        getUsers,
        []
    );
    if(results.length === 0){
        res.status(200).send([])
    }else{
        res.status(200).send(results)
    }
}

const deleteUser = async (req,res)=>{
    const delUsers = 'DELETE FROM users WHERE user_id = ?'
    const [results] = await db.execute(
        delUsers,
        [req.params.id]
    );
    res.status(200).send("User deleted")
}

module.exports = {getUsers,deleteUser}