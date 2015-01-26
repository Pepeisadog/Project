# -*- coding: utf-8 -*-
"""
Created on Mon Jan 12 11:36:25 2015

@author: Sofia
"""

import csv
import json
import os
import random
from random import randrange
from datetime import datetime
from datetime import timedelta

sourceEncoding = "iso-8859-1"
targetEncoding = "utf-8"

# encode files to utf8 (source: http://stackoverflow.com/questions/191359/how-to-convert-a-file-to-utf-8-in-python)
csvfile = open('..\Data\AMFI.csv',"r")
csvfile_encoded = open("..\Data\AMFI_encoded.csv", "w")
csvfile_encoded.write(unicode(csvfile.read(), sourceEncoding).encode(targetEncoding))
csvfile_encoded.close()
#==============================================================================
# 
# csvfile = open('Data\DML.csv',"r")
# csvfile_encoded = open("Data\DML_encoded.csv", "w")
# csvfile_encoded.write(unicode(csvfile.read(), sourceEncoding).encode(targetEncoding))
# csvfile_encoded.close()
# 
# csvfile = open('Data\FB.csv',"r")
# csvfile_encoded = open("Data\FB_encoded.csv", "w")
# csvfile_encoded.write(unicode(csvfile.read(), sourceEncoding).encode(targetEncoding))
# csvfile_encoded.close()
# 
# csvfile = open('Data\KSH.csv',"r")
# csvfile_encoded = open("Data\KSH_encoded.csv", "w")
# csvfile_encoded.write(unicode(csvfile.read(), sourceEncoding).encode(targetEncoding))
# csvfile_encoded.close()
# 
# csvfile = open('Data\LWB.csv',"r")
# csvfile_encoded = open("Data\LWB_encoded.csv", "w")
# csvfile_encoded.write(unicode(csvfile.read(), sourceEncoding).encode(targetEncoding))
# csvfile_encoded.close()
# 
# csvfile = open('Data\TBW.csv',"r")
# csvfile_encoded = open("Data\TBW_encoded.csv", "w")
# csvfile_encoded.write(unicode(csvfile.read(), sourceEncoding).encode(targetEncoding))
# csvfile_encoded.close()
#==============================================================================


# open files 
csvfile = open("..\Data\AMFI_encoded.csv","r")
#==============================================================================
# csvfile2 = open("Data\DML_encoded.csv","r")
# csvfile3 = open("Data\FB_encoded.csv","r")
# csvfile4 = open("Data\KSH_encoded.csv","r")
# csvfile5 = open("Data\LWB_encoded.csv","r")
# csvfile6 = open("Data\TBW_encoded.csv","r")
#==============================================================================

# define fieldnames
fieldnames = ("Callnumber","Barcode","Title","Year","Location")

# create readerlist
readerlist=[]

reader = csv.DictReader(csvfile, fieldnames, delimiter=';')

#readerlist.append(reader)

#==============================================================================
# 
# reader2 = csv.reader(csvfile2, fieldnames, delimiter=';')
# next(reader2)
# readerlist.append(reader2)
# 
# reader3 = csv.reader(csvfile3, fieldnames, delimiter=';')
# next(reader3)
# readerlist.append(reader3)
# 
# reader4 = csv.reader(csvfile4, fieldnames, delimiter=';')
# next(reader4)
# readerlist.append(reader4)
# 
# reader5 = csv.reader(csvfile5, fieldnames, delimiter=';')
# next(reader5)
# readerlist.append(reader5)
# 
# reader6 = csv.reader(csvfile6, fieldnames, delimiter=';')
# next(reader6)
# readerlist.append(reader6)
#==============================================================================

def random_date():
    
    start = datetime.strptime('1/1/2014', '%m/%d/%Y')
    end = datetime.strptime('1/1/2015', '%m/%d/%Y')
    
    delta = end - start
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    random_seconds = randrange(int_delta)
    
    return start + timedelta(seconds = random_seconds)


fields = ["User", "Date", "Title", "Barcode", "Action", "Location"]
Users = ["CIRCAMFI", "CIRCDML", "CIRCFB", "CIRCKSH", "CIRCTBW", "CIRCLWB", "Student"]
Action = ["Return", "Loan", "Renewal", "IntIBL"]
Location = ["AMFI", "DML", "FB", "KSH", "TBW", "LWB"]

# iterate over readerlist
for row in reader:
    print row
#==============================================================================
#     # create filename
#     filename = row[1] +'.json'     
#     sub_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "Histories")    
#     directory1 = str(os.path.join(sub_dir, filename))       
#     
#     # open file
#     jsonfile = open(directory1,"w")
#==============================================================================
    
    print random_date()
#==============================================================================
#     # create ouput dictionaries    
#     out = {}
#     for j in range(0,len(fields),1):
#         out[fields[0]] = random.choice(Users)
#         out[fields[1]] = random_date()
#         
#         if out[field[j]] == 
#==============================================================================
    
    # write to jsonfile  
#    json.dump(out, jsonfile)

            