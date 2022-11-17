## Query 1
### Find the number and titles of all neuroscience-related articles, grouped by year.
```
db.articles.aggregate([
  {
    $match: {$or: [{"metadata.keywords": {$regex: /^.*[Nn]euro.*$/}}, {"metadata.title": {$regex: /^.*[Nn]euro.*$/}}]}
  },
  {
    $group: {
      _id: {"metadata᎐pub_year": "$metadata.pub_year"},
      "count(*)": {$sum: 1},
      title: {
        $push: {
            "title": "$metadata.title"
        }
      }
    }
  },
  {
    $addFields: {"n": "$count(*)"}
  },
  {
    $sort: {"_id.metadata᎐pub_year": 1}
  },
  {
    $project: {"pub_year": "$_id.metadata᎐pub_year", "n": 1, "titles": "$title", "_id": 0}
  }
])
```


## Query 2
### Find the number of articles written by each author
```
db.articles.aggregate([
{$unwind : {path : "$metadata.authors"}},
{$addFields : {
    full_name : {$concat : ["$metadata.authors.first", " ","$metadata.authors.last"]}
}},
{$project : {
    "full_name" : 1,
     "_id" : 0}},
{$group : {
   _id : "$full_name",
   count : { $sum : 1}
}},
{$sort : { "count" : -1}}
])
```

## Query 
### Reconstruct the paper 
```
db.articles.aggregate(
[{$match: {docId: "S0197018615000054"}},
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
)
```