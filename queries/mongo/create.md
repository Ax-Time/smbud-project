## Insert 1
### Insert a dummy article
```
db.articles.insertOne({
    abstract: "this is an example of an insert",
    body_text: [
        {
            startOffset: 0,
            endOffset: 14,
            sentence: "first sentence",
        },
        {
            startOffset: 15,
            endOffset: 29,
            sentence: "second sentence",
        }
    ],
    docId: "S0000000000000000",
    metadata: {
        authors: [
        {
            email: null,
            first: "firstName1",
            last: "lastName1",
            initial: "fl1"
        },
        {
            email: "email2",
            first: "firstName2",
            last: "lastName2",
            initial: "fl2"
        }],
        keywords: ["dummy", "article", "insert", "smbud"],
        title: "dummy article",
    }
})
```
