# Hacking-Lab Challenge Generator
This generator uses [Yeoman](https://yeoman.io/) to generate new [Hacking-Lab](https://www.compass-security.com/en/products/hacking-lab/) Challenge Docker containers.

## Installation
1. Install NodeJS and NPM (Live CD: `sudo apt install nodejs npm`)
2. Install yo and our generator: `sudo npm install -g generator-hl-challenge yo`
3. Linking packages: `sudo npm link`

## Create a CTF docker (not as user root)
1. `mkdir my-awesome-challenge`
2. `yo hl-challenge`
3. `cd ./my-awesome-challenge`
4. `docker-compose up --build`
5. `testing`

## Issues
Please leave [feedback](https://github.com/Hacking-Lab/generator-hl-challenge/issues) if you run into any problems.


## Adding New Image Type
To add support for a new base image, you will have to:

1. Add it to the base images in `generator/app/index.js`
2. Add `generators/app/templates/{image}.md` with the customization instructions
3. Add `generators/app/templates/{image}/*` with a tiny sample application (optional, don't add root/ to the path)
4. OPTIONAL ADD `generators/app/templates/docker-compose.yml.{image}


