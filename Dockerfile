FROM neo4j:4.4.12-enterprise

COPY ./dblp.dump ./
# RUN apt-get update && apt-get install megatools -y
# RUN megadl https://mega.nz/file/KldjhRaY#VjGtdMfymUvYpgBSw75es7AG8LH4Ns_VnpWuz5VbAJs
RUN neo4j-admin load --from=./dblp.dump --database=neo4j --force
