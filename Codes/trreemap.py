# -*- coding: utf-8 -*-
"""
Created on Sun Jan 25 15:48:52 2015

@author: Sofia
"""

import csv
import json
import os

sourceEncoding = "iso-8859-1"
targetEncoding = "utf-8"

# encode files to utf8 (source: http://stackoverflow.com/questions/191359/how-to-convert-a-file-to-utf-8-in-python)
csvfile = open('..\Data\AMFI.csv',"r")
csvfile_encoded = open("..\Data\AMFI_encoded.csv", "w")
csvfile_encoded.write(unicode(csvfile.read(), sourceEncoding).encode(targetEncoding))
csvfile_encoded.close()

csvfile = open('..\Data\AMFI_categories.csv',"r")
csvfile_encoded = open("..\Data\AMFIcategories_encoded.csv", "w")
csvfile_encoded.write(unicode(csvfile.read(), sourceEncoding).encode(targetEncoding))
csvfile_encoded.close()

csvfile = open('..\Data\AMFI_domains.csv',"r")
csvfile_encoded = open("..\Data\AMFIdomains_encoded.csv", "w")
csvfile_encoded.write(unicode(csvfile.read(), sourceEncoding).encode(targetEncoding))
csvfile_encoded.close()

# open files
AMFI_books = open("..\Data\AMFI_encoded.csv","r")
AMFI_categories = open("..\Data\AMFIcategories_encoded.csv","r")
AMFI_domains = open("..\Data\AMFIdomains_encoded.csv","r")

fieldnames_books = ("Callnumber","Barcode","Title","Year","Location")
fieldnames_categories = ("Barcode","Category")

reader_books = csv.DictReader(AMFI_books, fieldnames_books, delimiter=';')
reader_categories = csv.DictReader(AMFI_categories, fieldnames_categories, delimiter = ';')
reader_domains = csv.DictReader(AMFI_domains, delimiter = ';')

output = {"name": "Library of the University of Applied Sciences", "type":"parent", "total":5605, "value":50, "children": []}

# get data from reader_books
barcode_books = []
names_books = []                
tags_books = []
copies = []

for books in reader_books:
    barcode_books.append(books["Callnumber"])
    names_books.append(books["Title"])
    tags_books.append(books["Barcode"])

tags = []

size_books = len(barcode_books)
print size_books

# Modify data books
for k in range(0, len(names_books), 1):
    # count copies
    count = names_books.count(names_books[k])
    copies.append(count)
    # collect unique ids    
    indeces = [i for i, x in enumerate(names_books) if x == names_books[k]]  
    if len(indeces) == 1:
        tags.append(tags_books[indeces[0]])
    else:
        list_tags = []
        for w in range(0,len(indeces),1):
            tag = tags_books[indeces[w]]
            list_tags.append(tag)
        tags.append(list_tags)
        # set copies to NaN
        for t in range(1,len(indeces),1):
            names_books[indeces[t]] = "NaN"

# Enter domains
barcode_domain = []
for domain in reader_domains:
    output["children"].append({
        "type": "domain",
        "name": domain["Domain"],
        "barcode": domain["Barcode"],
        "value": 6,
        "children": []
        })
    barcode_domain.append(domain["Barcode"])

# get category data
barcode_category = []
names_category = []

for category in reader_categories:
    barcode_category.append(category["Barcode"])
    names_category.append(category["Category"])

# Enter categories
for i in range(0,len(barcode_domain),1):

    barcode_domain_values = output["children"][i]["barcode"]

    for j in range(0,len(barcode_category),1):
        if barcode_category[j] < barcode_domain_values:
            if names_category[j] != "NaN":
                output["children"][i]["children"].append({
                "type":"category",
                "barcode": barcode_category[j],
                "value": 5,
                "name": names_category[j],
                "children": []
                })
                names_category[j] = "NaN"

lengths = []
codes_categories =[]
# Enter books in output
for i in range(0,len(barcode_domain),1):
    lengths.append(len(output["children"][i]["children"]))
    for k in range(0, lengths[i], 1):
        #counter = 0
        codes_categories = output["children"][i]["children"][k]["barcode"]
        for j in range(0,len(names_books),1):
            if barcode_books[j] < codes_categories:
                if names_books[j] != "NaN":
                    output["children"][i]["children"][k]["children"].append({
                    "type":"book",
                    "barcode": barcode_books[j],
                    "tags": tags[j],
                    "value": 2,
                    "name": names_books[j],
                    "copies": copies[j]
                    })
                    names_books[j] = "NaN"
                    #counter = counter + 1
        #output["children"][i]["children"].append({
        #    "value": counter
        #})
        
with open('../Data/tree.json', 'w') as f:

    json.dump(output, f, indent=True)


