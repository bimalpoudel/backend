#!/bin/bash

git -c core.filemode=false diff
git config --global core.filemode false
git config --global core.autocrlf true


touch public_html/install/sql-scripts 
chmod -R 777 public_html/install/sql-scripts 
touch services 
chmod -R 777 services 
touch tmp 
chmod -R 777 tmp
echo >  public_html/install/license.ini
touch public_html/install/license.ini


cd /home/HTDOCS/
mkdir live
cd live
git clone https://github.com/bimalpoudel/backend.git backend
mkdir -p subdomains/www.example.com
	REM mkdir subdomains/www.example.com

mklink /d public_html backend\public_html

edit: public_html/inc.bootstrap.php

Browse:
http://localhost/backend/live/public_html/

Login Username: USERNAME
Login Password: PASSWORD

Create Subdomain
Give paths
Install

First CRUD



# basic chmod
chmod -R 777 library/services 
chmod -R 777 library/tmp/cache-menus 
chmod -R 777 library/tmp/curl-cookies 
chmod -R 777 library/tmp/errors 
chmod -R 777 library/tmp/smarty_cache 
chmod -R 777 library/tmp/smarty_compiles 
chmod -R 777 library/tmp/superfish 
chmod -R 777 install/sql-scripts 
chmod -R 777 library/classes/common/config.mysql.inc.php 
chmod -R 777 library/services/backend/config.mysql.inc.php

# License permission file
touch install/license.txt
chmod 777 install/license.txt

# Edit the mysql configuration file
vi library/classes/common/config.mysql.inc.php