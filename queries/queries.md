## Poly-bros
### Authors that submitted a PhD thesis at PoliMi and then also co-wrote articles with authors that submitted a PhD thesis at other Polytechnical universities around the world

```cypher
match 
p = (poly:school)<-[:submitted_at]-(:phdthesis)-[:authored_by]->(:author)<-[:authored_by]-(:article)-[:authored_by]->(poly_author:author)<-[:authored_by]-(:phdthesis)-[:submitted_at]->(polimi:school)
where 
    poly.school =~ '.*Polytechnic.*' and 
    not(poly.school =~ '.*Polytechnic.*Milan.*') and
    polimi.school =~ '.*Polytechnic.*Milan.*'
return poly_author, p
```

## Serial writers
### Top 10 of the authors that have written the most books belonging to a series

```cypher
match p = (a:author)<-[:authored_by]-(b:book)-[:is_part_of]->(s:series)
with a, count(b) as n_books
order by n_books descending
return a, n_books
limit 10
```

## AI specialists
### AI-related articles written by authors related to Marco Brambilla

```cypher
match p = (pt:article)-[:authored_by]->(a:author)-[r*1..3]-(mb:author)
where 
    (
        none(rel in r where type(rel)="published_in") and
        mb.author = 'Marco Brambilla 0001'
    ) and
    (
        pt.title =~ '.* (?i)A(?i)I .*'or 
        pt.title =~ '.*(?i)Artificial (?i)Intelligence.*' or
        pt.title =~ '.*(?i)Learning.*' or
        pt.title =~ '.*(?i)Agent.*' or
        pt.title =~ '.*(?i)Neural.*'
    )
return pt, p
limit 1000
```