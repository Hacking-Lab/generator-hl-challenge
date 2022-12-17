# Alpine Linux NGINX Web Server
## Introduction
This content is provided by a Alpine Linux nginx php (docker) from the Hacking-Lab CTF system. 

## s6 Overlay Framework:
* version 3

## Service Specifications
* with s6 startup handling in `/etc/cont-init.d/` and `/etc/services.d/<service>/run`
* with dynamic user creation  in `/etc/cont-init-d/10-adduser`
* with or without known passwords for root and non-root user in `/etc/cont-init-d/10-adduser`
* with `environment` based dynamic ctf flag handling in `/etc/cont-init-d/99-add-flag.sh`
* with `file` based dynamic ctf flag handling in `/etc/cont-init-d/99-add-flag.sh`
* with nginx service, started by `/etc/services.d/nginx/run`
* with php service, started by `/etc/services.d/php-fpm/run`

## DocumentRoot
* /opt/www

## PHP Support
* Enabled

## NGINX configuration
* /config/nginx/nginx.conf

## FLAG
flag will be dynamic if this docker gets started from the HL docker manager
if you run this docker locally, the string is static

* flag = SED_GOLDNUGGET

## Base Image
* hackinglab/alpine-nginx-php-hl

