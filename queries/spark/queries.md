## 1. Articles that talk about a certain topic

``` python

def query(topic: str):
    regex = '.* ' + topic + ' .*'
    articles.join(authored_by, articles.ID == authored_by.START_ID, 'inner') \
        .select(articles.title, authored_by.END_ID) \
        .join(authors, authors.ID == authored_by.END_ID, 'inner') \
        .select(articles.title, authors.author) \
        .filter(articles.title.rlike(regex)) \
        .show(truncate=False)
    
query('AI')
```

## 2. Find the articles written by Marco Brambilla that cites another article written by Marco Brambilla

``` python
brambi_id = authors.filter(authors.author == 'Marco Brambilla 0001').select(authors.ID)
brambi_arts = authored_by.join(brambi_id, brambi_id.ID == authored_by.END_ID, "inner")
brambi_arts = brambi_arts.join(articles, articles.ID == brambi_arts.START_ID, 'inner') \
    .select(articles.ID, articles.title, articles.key)

brambi_arts.show()

cited_by_brambi_arts = brambi_arts.join(has_citation, brambi_arts.ID == has_citation.START_ID, 'inner')
cited_by_brambi_arts = cited_by_brambi_arts.join(cites, cites.ID == cited_by_brambi_arts.START_ID, 'inner') \
    .select(cited_by_brambi_arts.ID, cited_by_brambi_arts.title, cites.cite)

self_cited = cited_by_brambi_arts \
    .join(brambi_arts.select(brambi_arts.key), brambi_arts.key == cited_by_brambi_arts.cite)
self_cited.select('title')

self_cited.show()
```

## 3. This query finds articles whose title contains the word 'Cancer'/'cancer', selects the ID and title columns, and shows the first 10 results.

```python
articles \
    .filter(col("title") \
    .rlike("[A-z ]*[Cc]ancer[A-z ]*")) \
    .select("ID", "title") \
    .limit(10) \
    .show(truncate=False)
```

## 4. Find top 3 journals by number of publications

```python
top_3_journals = journal_published_in \
                        .groupBy(journal_published_in.END_ID) \
                        .count() \
                        .withColumnRenamed('count', 'n_publications') \
                        .sort(col('n_publications').desc()) \
                        .limit(3) \
                        .join(journals, journals.ID == journal_published_in.END_ID) \
                        .sort(col('n_publications').desc()) \
                        .select(col('ID'), col('journal'), col('n_publications')) \
                        .sort(col('n_publications').desc())

top_3_journals.show()
```

## 5. Authors that have name starting by 'M' published in the most important journals (3)

```python
temp = journal_published_in.select(col('START_ID'), col('END_ID'))

authors \
    .filter(authors.author.rlike('M.*')) \
    .filter(authors.author.isin( \
        list(journal_published_in \
            .groupBy(journal_published_in.END_ID) \
            .count() \
            .withColumnRenamed('count', 'n_publications') \
            .sort(col('n_publications').desc()) \
            .limit(3) \
            .join(temp, temp.END_ID == journal_published_in.END_ID) \
            .join(articles, articles.ID == temp.START_ID) \
            .select(explode(articles.author).alias('author')) \
            .toPandas()['author']) \
    )).show(truncate=False)
```

## 6. Biggest series

```python
books.join(series_is_part_of, books.ID == series_is_part_of.START_ID, 'inner') \
    .select(books.ID, books.author, books.title, series_is_part_of.END_ID) \
    .groupBy(series_is_part_of.END_ID) \
    .count() \
    .withColumnRenamed('count', 'n_books') \
    .join(series, series_is_part_of.END_ID == series.ID, 'inner') \
    .select(series.series, col('n_books')) \
    .orderBy(col('n_books').desc()) \
    .show(truncate=False)
```

## 7. This query counts the number of articles written by any 'Daniel' or 'Daniele' between 2018 and 2021, sorting them in descending order.

```python
exploded_articles = articles.filter((col("year") >= 2018) & (col("year") <= 2021)).select("ID", explode("author"), "year")
exploded_articles = exploded_articles.withColumnRenamed("col", "author")
exploded_articles.filter(col("author").rlike("[A-z ]*Daniel[e ][A-z ]*")).groupBy("author") \
    .count().sort(col("count").desc()).show(truncate=False)
```

## 8. This query returns the authors that have written at least 11 articles

```python
articles \
    .select("ID", explode("author")) \
    .withColumnRenamed("col", "author") \
    .groupBy("author") \
    .agg(count(col("author")) \
    .alias("articles_written")) \
    .where(col("articles_written") > 10) \
    .show(truncate=False)
```

## 9. This query returns number of articles written each year about cancer

```python
from pyspark.sql.functions import year, count
 
articles.where(col("title").rlike("[A-z ]*[Cc]ancer[A-z ]*")) \
    .limit(200) \
    .groupBy(year(col('mdate'))) \
    .agg(count("year").alias("year_publications")) \
    .where(col('year_publications') > 20) \
    .show(truncate=False)
```

## 10. Articles written by the author of the most cited PhD Thesis

```python
from pyspark.sql.functions import count, array_contains


most_cited_phd_thesis = cites \
                            .join(phd_thesis, phd_thesis.key == cites.cite, "inner") \
                            .select(cites.ID, phd_thesis.title, phd_thesis.author) \
                            .join(has_citation, has_citation.END_ID == cites.ID) \
                            .groupBy(phd_thesis.title, phd_thesis.author) \
                            .agg(count(phd_thesis.title).alias("citations")) \
                            .sort(col("citations").desc()) \
                            .limit(1) \
                            .select("title", explode("author").alias("author"))

most_cited_author = most_cited_phd_thesis.collect()[0]['author']

articles \
    .where(array_contains(articles.author, most_cited_author)) \
    .select(articles.title) \
    .show(truncate=False)
```

## 11.

```python
has_citation \
    .groupBy(has_citation.END_ID) \
    .count() \
    .sort(col("count").desc()) \
    .limit(15) \
    .join(cites, cites.ID == has_citation.END_ID) \
    .join(articles, articles.key == cites.cite) \
    .select("title", "author") \
    .show(truncate=False)
```

## 12. PhD thesis that are cited more than 10 times, ordered in descending order
```python
cites \
    .join(phd_thesis, phd_thesis.key == cites.cite, "inner") \
    .select(cites.ID, phd_thesis.title) \
    .join(has_citation, has_citation.END_ID == cites.ID) \
    .groupBy(phd_thesis.title) \
    .agg(count(phd_thesis.title).alias("citations")) \
    .sort(col("citations").desc()) \
    .where(col("citations") > 10) \
    .show(truncate=False)
```