# Alpine Linux Apache2 PHP Web Server
## Introduction
This content ist provided by a `docker service` based on Alpine Linux apache2 php web server from the Hacking-Lab CTF system. 

## Base Image
* hackinglab/alpine-base-hl

## PrintHeaders

If you want to see the http headers sent by your browser to this server, please click on the <a href="printheader.php">printheaders.php</a> 



## Specifications
* with s6 startup handling in `/etc/cont-init.d/` and `/etc/services.d/<service>/run`
* with dynamic user creation  in `/etc/cont-init-d/10-adduser`
* with or without known passwords for root and non-root user in `/etc/cont-init-d/10-adduser`
* with apache2 config script in `/etc/cont-init-d/21-apache2`
* with `environment` based dynamic ctf flag handling in `/etc/cont-init-d/99-add-flag.sh`
* with `file` based dynamic ctf flag handling in `/etc/cont-init-d/99-add-flag.sh`
* with apache2 service, started by `/etc/services.d/apache2/run`

## DocumentRoot
* /opt/www

## PHP Support
* enabled

## Apache2 configuration
* /etc/apache2/httpd.conf




