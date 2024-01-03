const {db} = require('../../db')

const lodgeComplaint = async (req,res)=>{
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
}

const userComplaints = async (req,res)=>{
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
}

module.exports = {lodgeComplaint,userComplaints}