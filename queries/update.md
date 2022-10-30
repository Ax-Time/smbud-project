# UPDATE DATA QUERY

Thanks to the APOC plugin we've been able to enrich our database. 
Our goal was to add some geographical information about the schools of our dataset, this was achived by the geocoding API of GMaps

## Add latitude/longitude

```cypher
CALL apoc.periodic.iterate('MATCH (a:school) RETURN a',
'CALL apoc.spatial.geocodeOnce(a.school) YIELD location
  WITH a, location.latitude AS latitude, location.longitude AS longitude
SET a.latitude = latitude,
    a.longitude = longitude', {batchSize:100, parallel:true})
```

## Add country

```cypher
CALL apoc.periodic.iterate('MATCH (a:school) RETURN a',
'CALL apoc.spatial.geocodeOnce(a.school) YIELD data
  UNWIND data.address_components as x
  WITH x, a
  WHERE x.types[0] = "country"
SET a.country = x.long_name', {batchSize:100, parallel:true})
```

<img src="/queries/assets/node_properties.png" />
