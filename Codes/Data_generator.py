# -*- coding: utf-8 -*-
"""
Created on Wed Jan 28 22:13:17 2015

@author: Sofia
"""
import json
import random
from random import randrange
from datetime import datetime
import datetime as dtime
from datetime import timedelta

Fieldnames = ("User", "Date", "Action", "Location")

Users = ("CIRCAMFI", "CIRCDML", "CIRCFB", "CIRCKSH", "CIRCLWB", "CIRCTBW")
Actions = ("Loan", "Renewal", "Return")
Locations = ("AMFI", "DML", "FB", "KSH", "LWB", "TBW")

def random_date():
    
    # This function generates a random date and time between 1/1/14 and 1/1/15    
    # It returns a sting containing date and time
    
    start = datetime.strptime('1/1/2014', '%m/%d/%Y')
    end = datetime.strptime('1/1/2015', '%m/%d/%Y')
    
    delta = end - start
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    random_seconds = randrange(int_delta)
    new_date = start + timedelta(seconds = random_seconds)
    date = new_date.strftime("%d-%m-%Y")
    
    return date
    
def sorting(L):
    splitup = L.split('-')
    return splitup[2], splitup[1], splitup[0]


for i in range(0,200,1):     
    # define empty lists
    date_list = [];
    action_list = [];
    user_list = [];
    location_list = [];
    
    random_int = randint(5,21)
    
    # get random data
    for k in range (0, random_int, 1):
        
        date_list.append(random_date()) 
        if k%3 == 0:
            action_list.append(Actions[0])
            user_list.append("Student")
            location_list.append("Student")
        elif k%3 == 1:
            action_list.append(Actions[1])
            user_list.append("Student")
            location_list.append("Student")
        elif k%3 == 2:
            action_list.append(Actions[2])
            user_list.append("Student")
            location_list.append(random.choice(Locations))     
        

    # sort date lists
    date_list.sort(key=sorting)
    
    # write data to file
    
    # create filename
    i_new = str(i)
    filename = "hist"+ i_new +'.json'     
    sub_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "../Histories")    
    directory1 = str(os.path.join(sub_dir, filename))
    
    # open file
    jsonfile = open(directory1,"w")
    
    # create ouput dictionary    
    out = {"Circulation History": []}
    for j in range(0,len(date_list),1):
        out["Circulation History"].append({
        "User": user_list[j],
        "Date": date_list[j],
        "Action": action_list[j],
        "Location": location_list[j]
        })

    # write to jsonfile
    json.dump(out, jsonfile, indent=True)

    
    