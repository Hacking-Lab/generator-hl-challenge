# nnn (52671912-81c0-4a5b-9751-def4a20cfdd4)
This docker is based on the Alpine Binary C app with compiled image of the Hacking-Lab CTF system.  
This docker provides a executable Binary C app with compiled flag.
Flag is compiled with Binary

## Customizing
- Place your binary/c file in `./root/src/binary.c`
- Change if required listening port in `./root/etc/services.d/run`
  example - `exec socat TCP-LISTEN:1234,fork,reuseaddr EXEC:/web/binary`

## GitHub
See [hacking-lab/alpine-binary-c](https://github.com/Hacking-Lab/alpine-binary-c/) for full information information.

## Adding Challenge Description
- Navigate to challenge-description folder
- Edit all the `.md` files except `_howto` and `Readme` 

## Building & testing
- Build and run: `docker-compose up --build`, then navigate to [http://localhost:80](http://localhost:80)
- Deploy: `./prepare.sh`, then upload `dockerfiles.tar.gz`