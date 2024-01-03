const {db} = require('../../db')

const getDetails = async (req,res)=>{
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
}

const postDetails = async (req,res)=>{
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
}

module.exports = {getDetails,postDetails}