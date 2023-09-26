// check if email already exists
const userExists = async (email) => {
    const searchQuery = 'SELECT users.email FROM users WHERE users.email = ?'
    const [results] = await db.execute(
        searchQuery,
        [email]
    );
    return (results.length !== 0)
}

const validatePassword = async (email,pass) => {
    const validateQuery = 'SELECT * FROM users WHERE users.email = ?'
    const [results] = await db.execute(
        validateQuery,
        [email]
    )
    authorizedUser = results[0]
    return bcrypt.compareSync(pass,results[0].password)
}

const detailsExist = async (data,type) => {
    const col = `${type}_name`
    const searchQuery = `SELECT * FROM ${type} WHERE ${col} = '${data}'`
    const [results] = await db.execute(
        searchQuery,
        []
    );
    return results.length !== 0 
}

module.exports = {userExists,validatePassword,detailsExist}