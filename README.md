# Hacking-Lab Challenge Generator
This generator uses [Yeoman](https://yeoman.io/) to generate new [Hacking-Lab](https://www.compass-security.com/en/products/hacking-lab/) Challenge Docker containers.

## Installation NPM package
Please install the HL challenge generator with the commands below

```bash
sudo apt install nodejs npm
sudo npm install -g generator-hl-challenge yo
```

## Create a CTF docker (not as user root)
Generate a temporary uuid using `uuidgen`. If you are going to create a docker for Hacking-Lab, the docker resource editor will return a `uuid` you must use. If you do not have access to the HL resource editor, ask for a `uuid` from them. 

1. `mkdir my-awesome-challenge`
2. `yo hl-challenge`
3. `cd ./my-awesome-challenge`
4. `docker-compose up --build`
5. `testing`


## Delivery to Hacking-Lab
Hacking-Lab is expecting a `dockerfiles.tar.gz`. Thus, if you execute the `prepare.sh`, this will create the file needed by Hacking-Lab. This is the file you must upload into the HL resource editor. Ignore your local `docker-compose.yml` and configure the HL `docker-compose.yml` within the HL resource editor. 


## Video
* https://youtu.be/eRh3fx_umSI


## Issues
Please leave [feedback](https://github.com/Hacking-Lab/generator-hl-challenge/issues) if you run into any problems.


## Adding New Image Type
To add support for a new base image, you will have to:

1. Add it to the base images in `generator/app/index.js`
2. Add `generators/app/templates/{image}.md` with the customization instructions
3. Add `generators/app/templates/{image}/*` with a tiny sample application (optional, don't add root/ to the path)
4. OPTIONAL ADD `generators/app/templates/docker-compose.yml.{image}


## DEV CORNER (deveoper of generator-hl-challenge package)
* cd /opt/generator-hl-challenge
* npm version patch (or minor or major)
* npm login
* npm publish
* sudo npm link


