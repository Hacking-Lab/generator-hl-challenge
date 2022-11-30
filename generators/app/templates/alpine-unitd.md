# <%= name %> (<%= uuid %>)
This docker is based on the Alpine Unitd image of the Hacking-Lab CTF system.
Alpine Image with small unitd web service (static page)

## Customizing
- Please put your files in /opt/www folder

## GitHub
See [hacking-lab/<%= image %>](https://github.com/Hacking-Lab/<%= image %>/) for full information information.

## Building & testing
- Build and run: `docker-compose up --build`
- Deploy: `./prepare.sh`, then upload `dockerfiles.tar.gz`
