const {db} = require('../../db')

const changeStatus = async (req,res)=>{
    const {comp_id,status} = req.body
    const updateStatus = 'UPDATE complaints SET status = ? WHERE comp_id = ?'
    const [results] = await db.execute(
        updateStatus,
        [status,comp_id]
    );
    res.status(200).send('Status Changed')
}

const fetchAdminComplaints = async (req,res)=>{
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
}

module.exports = {changeStatus,fetchAdminComplaints}