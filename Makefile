data-vis:
	docker run -dit --name data-vis -p 8080:80 -v $(shell pwd)/data_visualization/heatmap/:/usr/local/apache2/htdocs/ httpd:2.4
