# -*- coding: utf-8 -*-
"""
Created on Mon Jan 12 11:36:25 2015

@author: Sofia
"""

import csv
import json
import os

sourceEncoding = "iso-8859-1"
targetEncoding = "utf-8"

# encode files to utf8 (source: http://stackoverflow.com/questions/191359/how-to-convert-a-file-to-utf-8-in-python)
csvfile = open('Data\AMFI.csv',"r")
csvfile_encoded = open("Data\AMFI_encoded.csv", "w")
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
csvfile = open("Data\AMFI_encoded.csv","r")
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

reader = csv.reader(csvfile, fieldnames, delimiter=';')
next(reader)
readerlist.append(reader)
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
 
# iterate over readerlist
for row in reader:
                 
    # create filename
    filename = row[1] +'.json'     
    sub_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "Books2")    
    directory1 = str(os.path.join(sub_dir, filename))       
    
    # open file
    jsonfile = open(directory1,"w")
    
    # create ouput dictionaries    
    out = {}
    for j in range(0,len(row),1):
        out[fieldnames[j]]=row[j]
    
    # write to jsonfile  
    json.dump(out, jsonfile)


out2[fieldnames[1]]=row[1]
out2[fieldnames[2]]=row[2]
print out2 
# create filename
filename2 = "results.json"
sub_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "Results")    
directory2 = str(os.path.join(sub_dir, filename)) 
 
#open file
jsonfile2 = open(directory2,"w")
    
# write to jsonfile
json.dump(out2, jsonfile2)  
        
    
        
        
    

            