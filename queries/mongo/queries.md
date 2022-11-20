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
{$match: {_id: {$ne: null}}},
{$sort : { "count" : -1}}
])
```

## Query 3
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

## Query 4
### Find the title of articles with open access about protein folding published from 2020
```
db.articles.find({
    "metadata.keywords": {$regex: /^.*[Pp]rotein [Ff]olding.*$/},
    "metadata.pub_year": {$gte: 2020},
    "metadata.openaccess": {$eq: 'Full'}
},
{
    title: "$metadata.title",
    "_id": 0
})
```

## Query 5
### Find the number of articles about cancer published between 2014 and 2018 (included), ordered by year
```
db.articles.aggregate([
{$match: {$and: [{"metadata.title": {$regex: /[Cc]ancer/}}, {"metadata.pub_year": {"$gte": 2014}, "metadata.pub_year": {"$lte": 2018}}]}},
{$project: {"_id": 0, "metadata.pub_year": 1, "metadata.title": 1}},
{$group: {
        "_id": "$metadata.pub_year",
        count: {$sum: 1},
        titles: {
            $push: {
                title: "$metadata.title"
            }
        }
    }
},
{$sort: {"_id": 1}},
{$project: {"pub_year": "$_id", "count": 1, "titles": 1, "_id": 0}}
])
```

## Query 6
### Find the articles that reference cancer-related articles
```
db.articles.aggregate([
{$project: {"metadata.pub_year": 1, "metadata.title": 1, "bib_entries": {$objectToArray: "$bib_entries"}}},
{$unwind: {path: "$bib_entries"}},
{$match: {"bib_entries.v.title": {$regex: /[Cc]ancer/}}},
{$group: {
    "_id": "$_id",
    title: {$first: "$metadata.title"},
    num_refs: {$sum: 1},
    pub_year: {$first: "$metadata.pub_year"}
}},
{$sort: {"num_refs": -1}}
])
```

## Query 7
### Find the articles that were cited the most, ordered by the most citations
```
db.articles.aggregate([
{$project: {"metadata.pub_year": 1, "metadata.title": 1, "bib_entries": {$objectToArray: "$bib_entries"}}},
{$unwind: {path: "$bib_entries"}},
{$match: {$and: [{"bib_entries.v": {$ne: null}}, {"bib_entries.v.doi": {$ne: null}}]}},
{$group: {
    "_id": "$bib_entries.v.doi",
    title: {$first: "$bib_entries.v.title"},
    num_refs: {$sum: 1},
    pub_year: {$first: "$bib_entries.v.pub_year"}
}},
{$sort: {"num_refs": -1}},
{$project: {"doi": "$_id", "title": 1, "num_refs": 1, "pub_year": 1, "_id": 0}}
])
```

## Query 8
### Retrieve all keywords

```
db.articles.aggregate([
    {
        $unwind: "$metadata.keywords"
    },
    {
        $project: {
            "_id": 0,
            "keywords": "$metadata.keywords"
        }
    },
    {
        $sort: {
            "keywords": 1
        }
    }
])
```

## Query 9
### Authors that wrote about protein folding year by year ordered from the ones that wrote more recently about it

```
db.articles.aggregate([
    {
        $unwind: "$metadata.authors"
    },
    {
        $match: {
            "metadata.keywords": {
                $regex: /^.*[Pp]rotein [Ff]olding.*$/
            }
        }
    },
    {
        $group: {
            "_id": {
                $concat: ["$metadata.authors.first", " ", "$metadata.authors.last"]
            },
            year: {
                $first: "$metadata.pub_year"
            },
            author: {
                $first: {
                    $concat: ["$metadata.authors.first", " ", "$metadata.authors.last"]
                }
            }
        }
    },
    {
        $project: {
            "_id": 0,
            "year": 1,
            "author": 1
        }
    },
    {
        $sort: {
            "year": -1
        }
    }
])
```

## Query 10
### Articles with the longest titles that have been published recently and are at least 4 pages long
```
db.articles.aggregate([
    {
        $addFields: {
            "pages": "metadata.lastpage" - "metadata.firstpage"
        }
    },
    {
        $match: {
            $and: [
                {
                    "metadata.pub_year": {
                        "$geq": 2018
                    }
                },
                {
                    "pages": {
                        "$geq": 4
                    }
                }
            ]
        }
    },
    {
        $addFields: {
            "title_length": {
                $strLenCP: "$metadata.title"
            }
        }
    },
    {
        $sort: {
            "title_length": -1
        }
    },
    {
        $limit: 10
    }
])
```