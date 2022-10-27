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