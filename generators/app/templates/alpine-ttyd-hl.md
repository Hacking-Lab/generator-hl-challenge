# <%= name %> (<%= uuid %>)
This docker is based on the Alpine ttyd of the Hacking-Lab CTF system.  
This docker provides a web shell based on ttyd (without authentication).

## Customizing
- Please specify the ttyd user with the env variable: `HL_USER_USERNAME`
- Please specify the ttyd pass with the env variable: `HL_USER_PASSWORD`

## GitHub
See [hacking-lab/<%= image %>](https://github.com/Hacking-Lab/<%= image %>/) for full information information.

## Adding Challenge Description
- Navigate to challenge-description folder
- Edit all the `.md` files except `_howto` and `Readme` 

## Building & testing
- Build and run: `docker-compose up --build`, then navigate to [http://localhost:7681](http://localhost:7681)
- Deploy: `./prepare.sh`, then upload `dockerfiles.tar.gz`
