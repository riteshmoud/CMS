const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
const sessions = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')

const app = express()

// used in bcrypt function
const saltRounds = 10

const PORT = process.env.PORT || 3500

const pool = mysql.createPool({
        host: 'localhost',
        user: 'admin',
        password: 'admin@123',
        database: 'cms'
})

const db = pool.promise()

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

let authorizedUser,adminSession = {}


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

// handles user registration
app.post('/api/user_registration',async (req,res)=>{
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
})

app.post('/api/user_signin',async (req,res)=>{
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
})

// handles user updation
app.post('/api/user_update',async (req,res)=>{
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
})

// handles user password update
app.post('/api/user_update_password',async (req,res)=>{
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
)

app.get('/api/get_user',(req,res)=>{
    req.session.user ? res.status(200).send(req.session.user) : res.status(401).send('Unauthorized user')
})

app.get('/api/auth_session',(req,res)=>{
    console.log(req.session.user);
    if(req.session.user === 'admin'){
        res.status(200).send('admin')
    }else if(req.session.user && req.session.user !== 'admin'){
        res.status(200).send('user')
    }else{
        res.status(401).send('unauthorized user')
    }
})

app.get('/logout',(req,res) => {
    req.session.destroy();
    res.status(200).send('User logged out')
});

app.post('/lodge_complaint',async (req,res)=>{
    const {category,sub_category,state,nature,details} = req.body.formData
    if(req.session.user){
        let date = (new Date()).toLocaleDateString() + '  ' + (new Date()).toLocaleTimeString()
        console.log(date);
        const sqlInsert = 'INSERT INTO complaints (user,category,sub_category,state,nature,details,status,date_time) VALUES(?,?,?,?,?,?,?,?)'
        const [results] = await db.execute(
            sqlInsert,
            [req.session.user.email,category,sub_category,state,nature,details,'Pending',date],
        );
        console.log(results);
        res.status(200).send('Complaint registered')
    }else{
        res.status(401).send('User need to be logged in')
    }
})

app.get('/fetch_complaints',async (req,res)=>{
    if(req.session.user){
        const complaints = {}
        // const query = 'SELECT COUNT(user) FROM complaints WHERE complaints.user = ? AND complaints.status = ?'
        const query = 'SELECT * FROM complaints WHERE complaints.user = ? AND complaints.status = ?'

        // pending query
        const pendingResults = await db.execute(
            query,
            [req.session.user.email,'Pending'],
        );
        complaints.pending = pendingResults[0]
        // status.pending = results[0][0]['COUNT(user)']

        // complete query
        const completedResults = await db.execute(
            query,
            [req.session.user.email,'Completed'],
        );
        complaints.completed = completedResults[0]
        // status.completed = results[0][0]['COUNT(user)']
        
        // total query
        const totalResults = await db.execute(
            'SELECT * FROM complaints WHERE complaints.user = ?',
            [req.session.user.email],
        );
        complaints.total = totalResults[0]
        // status.total = status.pending + status.completed
        // console.log(complaints);
        res.status(200).send(complaints)
    }else{
        res.status(401).send('Unauthorized user')
    }
})

app.get('/fetch_complaints/admin',async (req,res)=>{
    if(req.session.user){
        const complaints = {}
        // const query = 'SELECT COUNT(user) FROM complaints WHERE complaints.user = ? AND complaints.status = ?'
        const query = 'SELECT * FROM complaints WHERE complaints.status = ?'

        // pending query
        const pendingResults = await db.execute(
            query,
            ['Pending'],
        );
        complaints.pending = pendingResults[0]
        // status.pending = results[0][0]['COUNT(user)']

        // complete query
        const completedResults = await db.execute(
            query,
            ['Completed'],
        );
        complaints.completed = completedResults[0]
        // status.completed = results[0][0]['COUNT(user)']
        
        // total query
        const totalResults = await db.execute(
            'SELECT * FROM complaints',
            [],
        );
        complaints.total = totalResults[0]
        // status.total = status.pending + status.completed
        // console.log(complaints);
        res.status(200).send(complaints)
    }else{
        res.status(401).send('Unauthorized user')
    }
})

app.post('/api/admin_login',async (req,res)=>{
    const {username,password} = req.body.formData
    if(username === 'admin'){
        const findQuery = 'SELECT * FROM admin WHERE admin.username = ?'
        const [results] = await db.execute(
            findQuery,
            [username],
        );
        adminSession = results[0]
        if(bcrypt.compareSync(password,results[0].password)){
            req.session.user = 'admin'
            res.status(200).send('Admin logged in')
        }else{
            res.status(401).send('Invalid password')
        }
    }else{
        res.status(400).send("Not a valid username!")
    }
})

app.post('/api/change_status', async (req,res)=>{
        const {comp_id,status} = req.body
        const updateStatus = 'UPDATE complaints SET status = ? WHERE comp_id = ?'
        const [results] = await db.execute(
            updateStatus,
            [status,comp_id]
        );
        res.status(200).send('Status Changed')
})

app.get('/api/fetch_remarks',async (req,res)=>{
    console.log(req.query.comp_id);
    const fetch = 'SELECT remarks FROM complaints WHERE comp_id = ?'
        const [results] = await db.execute(
            fetch,
            [req.query.comp_id]
        );
        res.status(200).send({remarks: results[0].remarks})
})

app.post('/api/post_remarks', async (req,res)=>{
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
})

app.get('/api/get_users',async (req,res)=>{
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
})

app.delete('/api/delete_user/:id',async (req,res)=>{
    const delUsers = 'DELETE FROM users WHERE user_id = ?'
    const [results] = await db.execute(
        delUsers,
        [req.params.id]
    );
    res.status(200).send("User deleted")
})

app.post('/api/post_details', async (req,res)=>{
    if(await detailsExist(req.body.data,req.body.type)){
        res.status(400).send(`It already exists`)
    }else{
        const col = `${req.body.type}_name`
        const addQuery = `INSERT INTO ${req.body.type}(${col}) VALUES('${req.body.data}')`
        const [results] = await db.execute(
            addQuery,
            []
        );
        res.status(200).send('Detail Added')
    }
})

app.get('/api/get_details', async (req,res)=>{
        let details = {}
        const getCategory = 'SELECT category_name FROM category'
        let [cat] = await db.execute(
            getCategory,
            []
        );
        cat.length === 0 ? details.category = [] : details.category = cat

        const getSubCategory = 'SELECT sub_category_name FROM sub_category'
        let [sub_cat] = await db.execute(
            getSubCategory,
            []
        );
        sub_cat === 0 ? details.sub_category = [] : details.sub_category = sub_cat

        const getState = 'SELECT state_name FROM state'
        let [state] = await db.execute(
            getState,
            []
        );
        state === 0 ? details.state = [] : details.state = state
        res.status(200).send(details)
})

// handles admin password update
app.post('/api/admin_update_password',async (req,res)=>{
    const {old_password,new_password} = req.body.formData
    console.log(req.body.formData);
        if(!bcrypt.compareSync(old_password,adminSession.password)){
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
)

app.listen(PORT,()=>{
    console.log(`Server is listening at port ${PORT}`);
})