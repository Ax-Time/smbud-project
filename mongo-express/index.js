const express = require('express')
const {MongoClient} = require('mongodb')
const app = express()
const port = 3000
const cors = require('cors')

app.use(cors())

// Connection URL
const url = "mongodb://admin:pndKFiW%24%5EcvWDnTl9%24@20.160.120.145:27017";
const client = new MongoClient(url);
// Database Name
const dbName = "elsevier";


app.get('/articles/:articleID', async (req, res) => {
    // Use connect method to connect to the server
    await client.connect()
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection("articles");

    const articleID = req.params.articleID;
    //mongodb://admin:pndKFiW%24%5EcvWDnTl9%24@20.160.120.145:27017/?authMechanism=DEFAULT


    const result = await collection.aggregate(
        [{$match: {docId: articleID}},
            {$project: {body_text: 1}},
            {$unwind: {path: '$body_text'}},
            {$sort: {'body_text.startOffset': 1}},
            {$project: {
                    title : '$body_text.title',
                    sentence: '$body_text.sentence',
                    offset : '$body_text.startOffset',
                    parent : '$body_text.parents.title',
                    _id: 0}
            },
            {$group : {
                    _id : "$title",
                    text : { $push : "$sentence"},
                    offset : { $min : "$offset"},
                    parent : { $first : "$parent"}
                }},
            {$addFields: {
                    full_text : {
                        "$reduce" : {
                            "input" : "$text",
                            "initialValue" : "",
                            "in" : {
                                "$cond" : {
                                    "if" : { "$eq" : [{"$indexOfArray": [ "$text", "$$this"]}, 0]},
                                    "then" : { "$concat" : [ "$$value", "$$this"]},
                                    "else" : { "$concat" : [ "$$value", "\n" ,"$$this"]}
                                }
                            }
                        }
                    }
                }},
            {$project : {
                    chapter : "$parent",
                    title : "$_id",
                    full_text : "$full_text",
                    offset : "$offset",
                    _id : 0
                }},
            {$sort: {'offset': 1}}]
    ).toArray();

    res.send(result);
})

app.get('/articles', async (req, res) => {
    // Use connect method to connect to the server
    await client.connect()
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection("articles");


    const pageNumber = Number(req.query.pageNumber)
    const nPerPage = Number(req.query.nPerPage)


    console.log(nPerPage);

    const result = await collection
        .find()
        .skip((pageNumber-1)*nPerPage)
        .limit(nPerPage)
        .project({
            metadata: 1,
            docId: 1
        })
        .toArray();

    res.send(result);
})

function printStudents(pageNumber, nPerPage) {

    collection.find().skip((pageNumber-1)*nPerPage).limit(nPerPage).forEach( function(student) { print(student.name + "<p>"); } );
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})