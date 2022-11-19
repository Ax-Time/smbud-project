up-data-vis:
	docker run -dit --name data-vis -p 8080:80 -v $(shell pwd)/data_visualization/heatmap/:/usr/local/apache2/htdocs/ httpd:2.4

up-db:
	docker run -it --rm --name neo4j-dblp -p7474:7474 -p7687:7687 -e NEO4J_AUTH=neo4j/s3cr3t --env=NEO4J_ACCEPT_LICENSE_AGREEMENT=yes neo4j-dblp

up: up-data-vis up-db	

init:
	docker build -t neo4j-dblp .
