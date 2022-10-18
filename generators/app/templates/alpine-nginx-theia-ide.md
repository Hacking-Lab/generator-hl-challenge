# <%= name %> (<%= uuid %>)
This docker is based on the Alpine Linux, s6 startup, NGINX and static web site, theia web ide image of the Hacking-Lab CTF system.  

## Customizing
- Replace your php web app inside /opt/www/

## GitHub
See [hacking-lab](https://github.com/Hacking-Lab/alpine-nginx-with-theia-web-ide) for full information information.

## Building & testing
- Build and run: `docker-compose up --build`, then navigate to [http://localhost:80](http://localhost:80)

- Deploy: `./prepare.sh`, then upload `dockerfiles.tar.gz`