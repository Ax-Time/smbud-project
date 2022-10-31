# How to run Database Neo4js

### Requirements
 - Make
 - Docker

Build the Docker image running:
```shell
make init
```

Run the Docker image
```shell
make up-db
```


### Run the DataVisualiztion HeatMap
The HeatMap requires a neo4j instance
```shell
make up-heatmap
```

### Run DB and HeatMap
```shell
make init #if you haven't run it before
make up
```
