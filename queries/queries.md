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

