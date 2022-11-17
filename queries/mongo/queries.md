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