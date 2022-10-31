FROM neo4j:4.4.12-enterprise

RUN echo 'Installing megatools for download the DB dump'
RUN apt-get update && apt-get install megatools -y
RUN echo 'Download the DB dump'
RUN megadl https://mega.nz/file/KldjhRaY#VjGtdMfymUvYpgBSw75es7AG8LH4Ns_VnpWuz5VbAJs
RUN echo 'Import the DB dump into neo4j'
RUN neo4j-admin load --from=./dblp.dump --database=neo4j --force