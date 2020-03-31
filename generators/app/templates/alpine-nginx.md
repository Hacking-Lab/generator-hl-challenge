# <%= name %> (<%= uuid %>)
This challenge is based on the Alpine nginx image of the Hacking-Lab CTF system.

## Customizing
- Place your web application in `./root/opt/www`
- Put your site configuration in `./root/configs/default`

See [hacking-lab/<%= image %>](https://github.com/Hacking-Lab/<%= image %>/) for full information information.

## Building & testing
- Build and run: `docker-compose up --build`, then navigate to [http://localhost:8000](http://localhost:8000)
- Deploy: `./prepare.sh`, then upload `dockerfiles.tar.gz`
