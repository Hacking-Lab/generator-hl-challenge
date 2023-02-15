# <%= name %> (<%= uuid %>)
This docker is based on the Alpine Python Flask image of the Hacking-Lab CTF system.  
This docker provides a python flask app.

## Customizing
- Place your web application in `./root/app/app.py`
- Put dependencies in `./root/app/requirements.txt` to install them during build

## GitHub
See [hacking-lab/<%= image %>](https://github.com/Hacking-Lab/<%= image %>/) for full information information.

## Adding Challenge Description
- Navigate to challenge-description folder
- Edit all the `.md` files except `_howto` and `Readme` 

## Building & testing
- Build and run: `docker-compose up --build`, then navigate to [http://localhost:8000](http://localhost:8000)
- Deploy: `./prepare.sh`, then upload `dockerfiles.tar.gz`
