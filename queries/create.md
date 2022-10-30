# CREATE QUERIES

## Create simple query
```cypher
create (a: article {
    article:	123123123123,
    author:	["Mock Author"],
    journal	:"GTE Laboratories Incorporated",
    mdate	:"2022-10-25",
    month	:"October",
    publtype	:"informal",
    title	:"Trying to create smt",
    url	:["db/journals/gtelab/index.html#TM-0014-06-88-165"],
    volume	:"TM-0014-06-88-165",
    year	:2022
}) - [:authored_by] -> (au: author {
    author: "Dummy student MOCK"
})

create (a) - [:published_in] -> (j: journal {
    journal: "Fantastic dummy Journal"
})

return a, au, j
```
<img src="/queries/assets/graph1.svg" />

## Add Author to an already inserted book, and change its author

```cypher
match (b:book {booktitle: "Encyclopedia of Information Ethics and Security"})

match (b) - [:edited_by] -> (e: editor)
set e.editor = "Changed editor" 

create (b) - [:authored_by] -> (au: author {
    author: "Dummy student MOCK"
})

return b, au, e
```
<img src="/queries/assets/graph2.svg" />

## Create new relation between authors

All the authors that have written a thesis in Milan probably knows each other. 
```cypher
MATCH (s:school) <- [:submitted_at] - (phdt: phdthesis) - [:authored_by] -> (author: author)
where s.school =~ '.*Milan.*' and 2020 in phdt.year
with collect (author) as milanAuthors
foreach (au1 in milanAuthors | 
    foreach(au2 in milanAuthors |
        merge (au1) - [:probably_knows] -> (au2)
    )
)

// Removes reflective property
with milanAuthors as MA
match (au: author) - [r: probably_knows] -> (au: author)
delete r

return MA
```

<img src="/queries/assets/graph3.svg" />