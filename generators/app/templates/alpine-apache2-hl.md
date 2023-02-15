# Alpine Apache2 Web Server
## Introduction
This is the template alpine apache2 web server image of the Hacking-Lab CTF system

## Base
* hackinglab/alpine-base-hl:latest

## Specifications
* with s6 startup handling
* with dynamic user creation
* with or without known passwords for root and non-root user
* with `env` based dynamic ctf flag handling
* with `file` based dynamic ctf flag handling
* serving files by apache2 in /opt/www


## Build & Test
1 `docker-compse -f docker-compose.yml up`
2. browse to http://localhost:80/

## Adding Challenge Description
- Navigate to challenge-description folder
- Edit all the `.md` files except `_howto` and `Readme` 

## Testing only (without building)
1. `docker pull hackinglab/alpine-apache2-hl:latest`
2. `docker-compose -f docker-compose.yml up`
3. browse to http://localhost:80/


