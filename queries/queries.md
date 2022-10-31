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

## Major players
### Shortest path between Ferruccio Resta and Antonio Capone

```cypher
match (Ferruccio:author), (AC:author),
        p = shortestPath((Ferruccio)-[r*]-(AC))
where none(rel in r where type(rel)="published_in")  and Ferruccio.author =~ ".*Ferruccio Resta.*" and AC.author = "Antonio Capone"
return p
```

### Shortest path between the actual rector and all the candidates

```cypher
match (candidate:author)
with ['Antonio Capone', 'Donatella Sciuto', 'Giulio Magli'] as candidates, candidate
where candidate.author in candidates
with candidate

match p = shortestpath((candidate) - [*] - (rector:author {author: 'Ferruccio Resta'}))
return candidate, size(nodes(p)) as distance
order by distance
```

## Most cited phd-thesist
### The author of the thesis that has been cited the most

```cypher
match(sub)-[:submitted_at]->(sch:school)
with collect(sub.`key`) as keyFromSc

match(cit:cite)<-[r:has_citation]-(any)
where cit.cite in keyFromSc
with count(r) as c, cit
order by c desc 
limit 1

match(n)-[:authored_by]->(auth:author)
where n.`key` = cit.cite
return n, cit, auth, c
```

## UniBros
### Find two authors that are affiliates with the same university and have done an inproceedings together

```cypher
match p = (pr:inproceedings)-[:authored_by]->(a1:author)<-[:authored_by]-(thesis1)-[:submitted_at]->(sch:school)<-[:submitted_at]-(thesis2)-[:authored_by]->(a2:author)<-[:authored_by]-(pr:inproceedings)
return p
limit 50
```

## Journals and Polimi
### Find the journals with the most articles written by people affiliate with PoliMi

```cypher
match (j: journal)[: published_in]-(art:article)-[:authored by]-›(auth:author)<-[:authored_by]-()-[:submitted at] ->(s:school)
where s. school =~ '.*Polytechnic.*Milan.*'
with count (distinct (art)) as narticles, j
order by narticles desc
return j, narticles
limit 5
```
## GG Authors
### Authors who wrote at least 10 books (total) in series in the top 10 for most books

```cypher
match (s:series)<-[:is_part_of]-(b:book)
with count(b) as nbooks, s
order by nbooks desc
limit 10
with collect(s) as topSeries

match (ts:series)<-[:is_part_of]-(b:book)-[:authored_by]->(author:author)
where ts in topSeries
with count(b) as nbooks, author
where nbooks >= 10
return author, nbooks
```

