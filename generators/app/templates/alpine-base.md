# <%= name %> (<%= uuid %>)
This challenge is based on the Alpine Base image of the Hacking-Lab CTF system.

## Customizing
- Put your application somewhere in the ./root/ folder
- Write a s6 startup script and put it into ./root/etc/services.d/{YOUR_SERVICE}/run

See [hacking-lab/<%= image %>](https://github.com/Hacking-Lab/<%= image %>/) for full information information.

## Building & testing
- Build and run: `docker-compose up --build`
- Deploy: `./prepare.sh`, then upload `dockerfiles.tar.gz`
