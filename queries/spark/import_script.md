# Script used to import data from CSV

Map type used in Neo4j to Spark types
Since we cannot map the string[] directly to an ArrayType(StringType()) we have to perform the split after we have created the dataframe.

```python

types = {   "int" : IntegerType(),
            "string[]" : StringType(),
             "string" : StringType(),
             "date" : DateType(),
             "ID" : StringType(),
             "int[]" : StringType()
        }
```

``` python
def createDF(filename):
    """
    Function used to create a dataframe starting from a csv file
    It searches for an externalHeader in 'filename_header.csv', if the file does not exist it uses the header in the source file
    The function performs the split for the array elements that were flattened into a string due to the csv array limitation
    """
    my_path = "csv/output_"
    extension = ".csv"
    
    possible_header = my_path + filename + "_header" + extension
    
    to_split = []
    
    if path.exists(possible_header):
        df_header = spark.read.option("header", True).option("delimiter", ";").csv(possible_header)
        schema = StructType()
        for x in df_header.columns:
            name, typ = x.split(":")
            if typ == "ID":
                name = typ
            if typ == "string[]" or typ == "int[]":
                to_split.append(name)
            schema.add(StructField(name, types[typ], True))
        df = spark.read.option("header", False).option("delimiter", ";").schema(schema).csv(my_path + filename + extension)
    
    else:
        df = spark.read.option("header", True).option("delimiter", ";").csv(my_path + filename + extension)
        for column in df.columns:
            a, b = column.split(':')
            if len(a) != 0:
                new_column = a
            else:
                new_column = b
            df = df.withColumnRenamed(column, new_column)
        
    for column in to_split:
        df = df.withColumn(column,
                           
                    functions.split(
                    functions.regexp_replace(
                    functions.col(column),"\\[|\\]",""),'\\|'))
        
    return df
```

Dataframes creation:

``` python
articles = createDF("article")
authors = createDF("author")
schools = createDF("school")
phd_thesis = createDF("phdthesis")
cites = createDF("cite")
books = createDF("book")
series = createDF("series")
journals = createDF("journal")

authored_by = createDF("author_authored_by")
has_citation = createDF("cite_has_citation")
series_is_part_of = createDF("series_is_part_of")
journal_published_in = createDF("journal_published_in")
```