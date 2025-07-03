#Note from the author:
#---------------------
#Hello this is the creator, if are reading this code im glad you made it this far.
#This application is nothing short of awesome so i hope you enjoy it. An expert im
#not but with passion i write, will the code be clean? sure as much as i can, will
#it be functional, thats my goal. In any case, any questions, dont ask, kidding :)
#Cheers 

#Technical:
#----------
#This app is built with python eel https://github.com/python-eel/Eel a very nifty library
#that allows non C++ programers like me do simple but pretty built desktop applications that
#rely on good old HTML5/CSS3/Javascript/Python3.

#Running the app
#---------------
#- Make sure to create an virtual enviroment and use the requirements.txt for dependencies
#- Tested with Python 3.13.0
#- This app runs best in Google Chrome(chromium)
#- Only tested on a Windows 11 enviroment

#Critical
#--------
#App requires existing printers in the enviroment, even if virtual like "Print to PDF" ones,
#otherwise it will not launch, this is by design, if no printers are detected there is an
#issue somewhere bigger than this app.

import os
import sys
import time
import eel
import glob
import logging
import sqlite3
import traceback
import simplejson as json
from contextlib import closing
from pandas import *
from zebra import Zebra
from zplgrf import GRF

#Initialize the Zebra object
z = Zebra()

#Get current script directory
current_dir = os.getcwd()

##################### 
# Utility Functions #
#####################

#Get a list of all printers in the current machine
@eel.expose
def get_printers(): 
    return z.getqueues()

#Set selected printed as default and end raw zpl, created at the front end to the selected printer
@eel.expose
def send_label(zpl, printer, quantity):
    z.setqueue(printer)
    try:
        for _ in range(int(quantity)):
            z.output(zpl)   
    except Exception as e:
        print(e)
        logging.error(traceback.format_exc())

#Get all data out of database excel and send to front end
@eel.expose
def get_database():
    database = glob.glob('**/*.xlsx', recursive=True)

    if database:
        if len(database) > 1:
            return [1, database]
        else:
            excel = ExcelFile(database[0])
            raw = excel.parse(excel.sheet_names[1]).to_dict()
            autocomplete = list(raw['Item'].values())
            return [json.dumps(raw, ignore_nan=True), autocomplete]
    else:
        return 0

#Open a given folder
@eel.expose
def open_folder(path=current_dir):
    path = os.path.realpath(path)
    os.startfile(path)

#Convert image to ZPL
@eel.expose
def image_to_zpl(filename):

    #Check for the image in the current script directories
    image = glob.glob(f'{os.getcwd()}/web/assets/custom/{filename}', recursive=True)

    if image:
        with open(image[0], 'rb') as img:
            grf = GRF.from_image(img.read(), 'LABEL')
            grf.optimise_barcodes()
            zpl = grf.to_zpl()
            return zpl
    else:
        return 0

#Close app by killing system processes
@eel.expose
def close_app():
    time.sleep(8)
    try:
        os.system("taskkill /F /IM chrome.exe /T")
        os.system("taskkill /F /IM cmd.exe /T")
        sys.exit()
    except:
        pass

###############
# Application #
###############

# Fetch application configuration from DB
try:
    with closing(sqlite3.connect("web/db/config.db")) as connection:
        print(f"Opened SQLite database with version {sqlite3.sqlite_version} successfully.")
        with closing(connection.cursor()) as cursor:
            config = cursor.execute("SELECT * FROM config").fetchone()
            print(config)

except sqlite3.OperationalError as e:
    print("Failed to open database:", e)

# Application initialization
if __name__ == "__main__":
    eel.init('web')
    eel.start(
        config[0], #label.html
        cmd = json.loads(config[1]),
        mode = config[2],
        port = config[3],
        position = eval(config[4]),
        size = eval(config[5]),
    )