# <%= name %> (<%= uuid %>)
This docker is based on the Alpine nginx image of the Hacking-Lab CTF system with Tinyproxy.
This docker provides a static web server based on nginx.

## Customizing
- Place your tinyproxy config in `/tinyproxy/tinyproxy.conf`
- Place your tinyproxy domain filter in `/tinyproxy/filter`

## GitHub
See [hacking-lab/<%= image %>](https://github.com/Hacking-Lab/<%= image %>/) for full information information.

## Building & testing
- Build and run: `docker-compose up --build`, then navigate to [http://localhost:8000](http://localhost:8000)
- Deploy: `./prepare.sh`, then upload `dockerfiles.tar.gz`


## Server Setup
```bash
$ docker-compose up -d
```

## Client Setup

```bash
$ http_proxy=localhost:8888 curl compass-security.com           
```
