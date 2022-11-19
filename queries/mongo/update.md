## Update 1
### Update a dummy article
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

## Update 2
### Add bio and affiliation fields to the articles' authors
```
db.articles.updateMany({},
{
    $set: {"metadata.authors.$[].bio" : "This is bio",
           "metadata.authors.$[].affiliation" : "Author's affiliation"}
})
```

## Update 3
### Add image subdocument to every article, with url and caption for each image
```
db.articles.updateMany({},
{
    $set: {"figures" : [{
        "url" : "sample_url 1",
        "caption" : "this is a caption 1",
        "fig_number" : "1.1"
    },
    {
        "url" : "sample_url 2",
        "caption" : "this is a caption 2",
        "fig_number" : "1.2"
    },
    {
        "url" : "sample_url 3",
        "caption" : "this is a caption 3",
        "fig_number" : "1.3"
    }]}
})
```

## Update 4
### Add a field indicating that an article is old if it was published before 2016
```
db.articles.updateMany(
{"metadata.pub_year": {$lte: 2015}},
{$set: {"old_publication (>5 yrs)": true}}
)
```
