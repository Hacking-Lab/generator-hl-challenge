# Hacking-Lab Challenge Generator
This generator uses [yo](https://yeoman.io/) to generate new Hacking-Lab Challenge Docker containers.

## Installation and Usage
1. Run `npm install -g generator-hl-challenge` to install the generator
2. Create an empty directory: `git init my-awesome-challenge && cd my-awesome-challenge`
3. Run the generator and answer all questions: `yo hl-challenge`
4. Read the `README.md` file in your new challenge for customization and build instructions

Please leave [feedback](https://github.com/hacking-lab/generator-hl2-challenge/issues) if you run into any problems.

## Development
To test locally, run `npm link` in this directory (requires sudo).

### Adding support for a new image
To add support for a new base image, you will have to:

1. Add it to the base images in `index.js`
2. Add `generators/app/templates/{image}.md` with the customization instructions
3. Add `generators/app/templates/{image}/*` with a tiny sample application (optional, don't add root/ to the path)
