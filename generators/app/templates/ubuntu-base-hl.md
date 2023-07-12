# <%= name %> (<%= uuid %>)
This docker is based on the Ubuntu <%= versionTag %> Base image of the Hacking-Lab CTF system.
This docker provides nothing (only base for other images).

## Customizing
- Put your application somewhere in the ./root/ folder
- Write a s6 startup script and put it into ./root/etc/services.d/{YOUR_SERVICE}/run

## GitHub
See [hacking-lab/<%= image %>:<%= versionTag  %>](https://github.com/Hacking-Lab/<%= image %>-<%= versionTag  %>) for full information information.
## Adding Challenge Description
- Navigate to challenge-description folder
- Edit all the `.md` files except `_howto` and `Readme` 

## Building & testing
- Build and run: `docker-compose up --build`
- Deploy: `./prepare.sh`, then upload `dockerfiles.tar.gz`
