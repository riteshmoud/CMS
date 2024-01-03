const express = require('express')
const cors = require('cors')
// const mysql = require('mysql2')
const sessions = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const app = express()

const {userSignIn,userRegistration,logout} = require('./api/user/account')
const { userUpdate, userUpdatePassword } = require('./api/user/updates')
const { userComplaints, lodgeComplaint } = require('./api/user/complaints')
const { authSession } = require('./api/auth')
const { fetchRemarks } = require('./api/common')
const { adminLogin } = require('./api/admin/account')
const { postRemarks, adminUpdatePassword } = require('./api/admin/updates')
const { changeStatus, fetchAdminComplaints } = require('./api/admin/complaints')
const { getDetails, postDetails } = require('./api/admin/details')
const { getUsers, deleteUser } = require('./api/admin/user')

// used in bcrypt function
const saltRounds = 10

const PORT = process.env.PORT || 3500

// const pool = mysql.createPool({
//         host: 'localhost',
//         user: 'admin',
//         password: 'admin@123',
//         database: 'cms'
// })

// const db = pool.promise()

// middlewares
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}))

//session middleware
const oneDay = 1000*60*60*24
app.use(sessions({
    key: 'userLogin',
    secret: "cms",
    saveUninitialized: true,
    cookie: {expires: oneDay},
    resave: false
}))

// let authorizedUser,adminSession = {}


// check if email already exists
// const userExists = async (email) => {
//     const searchQuery = 'SELECT users.email FROM users WHERE users.email = ?'
//     const [results] = await db.execute(
//         searchQuery,
//         [email]
//     );
//     return (results.length !== 0)
// }

// const validatePassword = async (email,pass) => {
//     const validateQuery = 'SELECT * FROM users WHERE users.email = ?'
//     const [results] = await db.execute(
//         validateQuery,
//         [email]
//     )
//     // authorizedUser = results[0]
//     return bcrypt.compareSync(pass,results[0].password)
// }

// const detailsExist = async (data,type) => {
//     const col = `${type}_name`
//     const searchQuery = `SELECT * FROM ${type} WHERE ${col} = '${data}'`
//     const [results] = await db.execute(
//         searchQuery,
//         []
//     );
//     return results.length !== 0 
// }

// handles user registration
app.post('/api/user_registration',userRegistration)
app.post('/api/user_signin',userSignIn)

// handles user updation
app.post('/api/user_update',userUpdate)

// handles user password update
app.post('/api/user_update_password',userUpdatePassword)
app.get('/api/get_user',(req,res)=>req.session.user ? res.status(200).send(req.session.user) : res.status(401).send('Unauthorized user'))
app.get('/api/auth_session',authSession)
app.get('/logout',logout);
app.post('/lodge_complaint',lodgeComplaint)
app.get('/fetch_complaints',userComplaints)
app.get('/fetch_complaints/admin',fetchAdminComplaints)
app.post('/api/admin_login',adminLogin)
app.post('/api/change_status', changeStatus)
app.get('/api/fetch_remarks',fetchRemarks)
app.post('/api/post_remarks', postRemarks)
app.get('/api/get_users',getUsers)
app.delete('/api/delete_user/:id',deleteUser)
app.post('/api/post_details', postDetails)
app.get('/api/get_details', getDetails)

// handles admin password update
app.post('/api/admin_update_password',adminUpdatePassword)

app.listen(PORT,()=>{
    console.log(`Server is listening at port ${PORT}`);
})