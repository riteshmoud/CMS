const {db} = require('../db')

const fetchRemarks = async (req,res)=>{
    console.log(req.query.comp_id);
    const fetch = 'SELECT remarks FROM complaints WHERE comp_id = ?'
        const [results] = await db.execute(
            fetch,
            [req.query.comp_id]
        );
        res.status(200).send({remarks: results[0].remarks})
}

module.exports = {fetchRemarks}