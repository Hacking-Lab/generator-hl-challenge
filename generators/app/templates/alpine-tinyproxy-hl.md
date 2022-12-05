# <%= name %> (<%= uuid %>)
This docker is based on the Alpine nginx image of the Hacking-Lab CTF system.
This docker provides a static web server based on nginx.

## Customizing
- Place your tinyproxy config in `./root/etc/tinyproxy/tinyproxy.conf`
- Place your tinyproxy domain filter in `./root/etc/tinyproxy/filters`

## GitHub
See [hacking-lab/<%= image %>](https://github.com/Hacking-Lab/<%= image %>/) for full information information.

## Building & testing
- Build and run: `docker-compose up --build`, then navigate to [http://localhost:8000](http://localhost:8000)
- Deploy: `./prepare.sh`, then upload `dockerfiles.tar.gz`
