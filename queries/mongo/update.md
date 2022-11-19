```
db.articles.updateOne({
        docId: "S0000000000000000"
    },
    {
        $set: {
            abstract: "this article has been updated",
            "metadata.pub_year": 2022
        },
        $push: {
            "metadata.keywords": "update"
        }
    }
)
```
