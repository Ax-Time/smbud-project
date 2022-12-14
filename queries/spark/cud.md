# Create queries

## Add a new author

``` python
author_name = 'Giorno Giovanna'
authors = authors.union(spark.createDataFrame([(str(uuid.uuid4()), author_name)]))

authors.filter(col('author') == 'Giorno Giovanna').show()
```

## Add new school

``` python
school_name = 'My Hero Academy'
schools = schools.union(spark.createDataFrame([(str(uuid.uuid4()), school_name)]))

schools.filter(col('school') == school_name).show()
```

## Add an author to an existing article

``` python
article_name = 'Thus Spoke Rohan Kishibe'
author_name = 'Rohan Kishibe'

filtered = articles.filter(col('title') == article_name)

occurrences = filtered.count()
if occurrences == 1:
    articles.withColumn('author', functions.when(
            col('title') == article_name, filtered.collect()[0]['author'] + [author_name]
        ).otherwise(col('author'))
    )
elif occurrences == 0:
    print('There is no article with that name')
else:
    print('There is an ambiguity since there are 2 ore more articles with that name')
```

# Update queries

## Update article title

``` python
article_name = 'A New Hope'
new_article_name = 'A New Hope (updated)'

articles = articles.withColumn('title', functions.when(col('title') == article_name, new_article_name).otherwise(col('title')))
articles.filter(col('title') == new_article_name).show(truncate=True)
```

# Delete queries

## Delete an author

``` python
author_name = 'Giorno Giovanna'
authors = authors.filter(col('author') != author_name)

authors.filter(col('author') == 'Giorno Giovanna').show()
```