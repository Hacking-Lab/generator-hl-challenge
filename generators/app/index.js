// Import necessary dependencies
const Generator = require('yeoman-generator');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Export a class that extends the Yeoman Generator
module.exports = class extends Generator {

    // Use the async/await pattern to prompt the user for information
    async prompting() {

        // Log a message to the console to guide the user through the process
        this.log("Before we start, we'll need a bit of information about this new challenge.");
        this.log("Make sure you have created a resource in the editor and have the UUID ready.");

        // Use the this.prompt() method to ask the user for information and store the answers in this.answers
        this.answers = await this.prompt([

            // Ask for the resource name in kebab-case and validate it
            {
                type: 'input',
                name: 'name',
                message: 'Resource name (use-kebab-case; must match the name given in the resource editor)',
                default: this.appname.replace(/[^a-z0-9-]/ig, '-').toLowerCase(),
                validate: x => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(x),
            },

            // Ask the user for the resource UUID from resource editor if not provided generate a random UUID
            {
                type: 'input',
                name: 'uuid',
                message: 'Resource UUID (fetch it from the resource editor or leave blank to generate a random one)',
                default: uuidv4(),
                validate: x => /^\s*[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{12}\s*$/i.test(x),
                filter: x => x.toLowerCase().trim(),
            },

            // Ask the user if they want to create multi or single service docker
            {
                type: 'list',
                name: 'multiDocker',
                message: 'Do you want to create multi service docker or single service docker?',
                choices: [
                    {
                        name: 'Single-service Docker',
                        value: 'single'
                    },
                    {
                        name: 'Multi-service Docker',
                        value: 'multi'
                    }
                ],
                default: 'single'
            },

            // If user selected multi-service docker, ask for the type of multi-service docker to create
            {
                when: answers => answers.multiDocker === 'multi',
                type: 'list',
                name: 'multiService',
                message: 'Select an option',
                choices: [
                    {
                        name: 'Exposed nginx server with multiple services',
                        value: 'multidocker-nginx'
                    },
                    {
                        name: 'One service exposed',
                        value: 'multidocker-one-service'
                    },
                ],
                default: false,
            },

            // If user selected single or multidocker-one-service, ask for the type of container they are developing
            {
                when: answers => answers.multiDocker === 'single',
                type: 'list',
                name: 'dockerType',
                message: 'What type of container are you developing?',
                choices: [
                    {
                        name: 'A normal web application, hosted through a reverse proxy with HTTPS (idocker)',
                        short: 'idocker',
                        value: 'idocker',
                    },
                    {
                        name: 'Any other type of network service (rdocker)',
                        short: 'rdocker',
                        value: 'rdocker',
                    }
                ],
                default: false,
            },
            {
                // This question is displayed only if the user is not developing a single service in a multi-container Docker setup.

                when: answers => answers.multiService !== 'multidocker-one-service',
                type: 'list',
                name: 'image',
                message: 'Select base image',
                choices: [
                    // These are the available base images that the user can choose from.
                    // Each choice has a name (displayed to the user), short (a shorter version of the name), and a value (used in the code).
                    // The `filter` property is used to extract only the image name (without the tag) from the value.

                    {
                        name: 'alpine-base-hl: empty base alpine image with flag and user handling, for your own custom service',
                        short: 'alpine-base-hl',
                        value: 'alpine-base-hl'
                    },
                    {
                        name: 'alpine-nginx-hl: NGINX web server for static web sites',
                        short: 'alpine-nginx-hl',
                        value: 'alpine-nginx-hl'
                    },
                    {
                        name: 'alpine-nginx-php-hl: NGINX-PHP web server for static and dynamic web sites',
                        short: 'alpine-nginx-php-hl',
                        value: 'alpine-nginx-php-hl'
                    },
                    {
                        name: 'alpine-python-flask-hl: PYTHON-FLASK web application',
                        short: 'alpine-python-flask-hl',
                        value: 'alpine-python-flask-hl'
                    },
                    {
                        name: 'alpine-ttyd-hl: WEB-SHELL based on ttyd (without authentication)',
                        short: 'alpine-ttyd-hl',
                        value: 'alpine-ttyd-hl'
                    },
                    {
                        name: 'alpine-siab-hl: WEB-SHELL based on shell in a box (with authentication)',
                        short: 'alpine-siab-hl',
                        value: 'alpine-siab-hl'
                    },
                    {
                        name: 'alpine-tinyproxy-hl: HTTP/HTTPS Proxy based on tinyproxy',
                        short: 'alpine-tinyproxy-hl',
                        value: 'alpine-tinyproxy-hl'
                    },
                    {
                        name: 'alpine-openssh-server-hl: SSH docker server',
                        short: 'alpine-openssh-server-hl',
                        value: 'alpine-openssh-server-hl'
                    },
                    {
                        name: 'alpine-nginx-nodejs-hl: NODEJS node app.js (Hello World)',
                        short: 'alpine-nginx-nodejs-hl',
                        value: 'alpine-nginx-nodejs-hl'
                    },
                    {
                        name: 'alpine-nginx-nodejs-websocketd-hl: NODEJS npm start (Node and Websocket Service)',
                        short: 'alpine-nginx-nodejs-websocketd-hl',
                        value: 'alpine-nginx-nodejs-websocketd-hl'
                    },
                    {
                        name: 'alpine-binary-c-dynamic-hl: Execuable C with compiled flag',
                        short: 'alpine-binary-c-dynamic-hl',
                        value: 'alpine-binary-c-dynamic-hl'
                    },

                    {
                        name: 'alpine-binary-c-hl: Execuable C binary',
                        short: 'alpine-binary-c-hl',
                        value: 'alpine-binary-c-hl'
                    },

                    {
                        name: 'alpine-unitd-hl: Unitd web server : Small unitd web service (static page)',
                        short: 'alpine-unitd-hl',
                        value: 'alpine-unitd-hl'
                    },

                    {
                        name: 'alpine-nginx-theia-ide: Alpine Linux, s6 startup, NGINX and static web site, Theia web IDE',
                        short: 'alpine-nginx-theia-ide',
                        value: 'alpine-nginx-theia-ide'
                    },
                    {
                        name: 'alpine-apache2-hl: Alpine apache2 web server',
                        short: 'alpine-apache2-hl',
                        value: 'alpine-apache2-hl'
                    }

                ],
                filter: x => x.split(':')[0], // Extract only the image name (without the tag) from the value.
            },
            {
                type: 'confirm',
                name: 'goldnugget',
                message: 'Add support for dynamic goldnugget?',
                default: true,
            },
            // If user wants to add support for goldnugget, ask for the type of flag

            {
                when: (answers) => answers.goldnugget,
                type: 'list',
                name: 'flagType',
                message: 'What type of flag do you want to use?',
                choices: [
                    {
                        name: 'A flag in a file (file flag)',
                        short: 'file flag',
                        value: 'file',
                    },
                    {
                        name: 'A flag in an environment variable (env flag)',
                        short: 'env flag',
                        value: 'env',
                    }
                ],
                default: false
            },

            // Ask user for their name and email

            {
                type: 'input',
                name: 'authorName',
                message: 'Your name',
                store: true
            },
            {
                type: 'input',
                name: 'authorEmail',
                message: 'Your e-mail',
                store: true
            }
        ]);
    }

    writing() {
        if (this.answers.multiService !== 'multidocker-one-service') {
            const tplFiles = ['gitignore:.gitignore'];
            tplFiles.push('Dockerfile');
            tplFiles.push(`${this.answers.image ? this.answers.image + '.md' : 'README.md'}:README.md`);
            tplFiles.push('docker-compose.yml');
            tplFiles.push('prepare.sh');
            tplFiles.push('challenge-description');
            tplFiles.push('challenge-tester');
                // Loop through the template files and copy them to the destination directory


            for (const tpl of tplFiles.map(x => x.split(':'))) {
                if (
                    fs.existsSync(
                        this.templatePath(tpl[0]) +
                        '.' +
                        (this.answers.image || '') // use image only if it's defined
                    )
                ) {
                    tpl[1] = tpl[0];
                    tpl[0] += '.' + (this.answers.image || '');
                }
                this.fs.copyTpl(
                    this.templatePath(tpl[0]),
                    this.destinationPath(tpl.length > 1 ? tpl[1] : tpl[0]),
                    this.answers
                );
            }
        }
        // If the project is a multi-container setup and the user wants to use a goldnugget flag

        if (this.answers.multiService !== 'multidocker-one-service') {
            if (this.answers.goldnugget && this.answers.uuid) {
                if (this.answers.flagType === 'env') {
                    this.fs.write(
                        this.destinationPath(this.answers.uuid + '.env'),
                        'GOLDNUGGET=SED_GOLDNUGGET'
                    );
                } else if (this.answers.flagType === 'file') {
                    this.fs.write(
                        this.destinationPath(this.answers.uuid + '.gn'),
                        'GOLDNUGGET=SED_GOLDNUGGET'
                    );
                }
                // Copy the flag-deploy-scripts folder to the destination directory
                // check for flag type and copy the correct flag deploy script
                if (this.answers.flagType === 'env') {
                    this.fs.copyTpl(
                        this.templatePath('flag-deploy-scripts'),
                        this.destinationPath('root/flag-deploy-scripts/deploy-env-flag.sh'),
                        this.answers
                    );
                }
                if (this.answers.flagType === 'file') {
                    this.fs.copyTpl(
                        this.templatePath('flag-deploy-scripts'),
                        this.destinationPath('root/flag-deploy-scripts/deploy-file-flag.sh'),
                        this.answers
                    );
                }
                // If the user doesn't want to use a goldnugget flag, create a placeholder file

            } else if (!this.answers.goldnugget) {
                this.fs.write(
                    this.destinationPath('root/no_gn_flag.md'),
                    'This challenge does not support goldnugget as you have chosen not to use it.'
                );
            }
            // If a template file with the same name as the selected image exists, copy it to the destination directory

            if (fs.existsSync(this.templatePath(this.answers.image))) {
                this.fs.copyTpl(
                    this.templatePath(this.answers.image),
                    this.destinationPath('root'),
                    this.answers
                );
            }
        }

        let configFolder;

        if (this.answers.multiService === 'multidocker-nginx') {
            configFolder = 'multidocker-nginx';
        } else if (this.answers.multiService === 'multidocker-one-service') {
            configFolder = 'multidocker-one-service'; // Use the appropriate folder name for this option
        } else {
            configFolder = this.answers.dockerType === 'idocker' ? 'idocker' : 'rdocker';
        }

        // Construct path for dockermanager_env_gn.json using the correct folder name

        const name = this.answers.name;
        const uuid = this.answers.uuid;

        let dockermanagerFile = 'dockermanager_no_gn.json';
        if (this.answers.goldnugget) {
            dockermanagerFile = `dockermanager_${this.answers.flagType}_gn.json`;
        }

        const composeFile = 'compose.yml';

        const filesToCopy = [dockermanagerFile, composeFile];
        if (this.answers.multiService) {
            filesToCopy.push('README.md');
        }

        filesToCopy.forEach((file) => {
            let fileContents = this.fs.read(this.templatePath(`configs/${configFolder}/${file}`));
            if (file === composeFile) {
                let lines = fileContents.split('\n');

                // Replace resname with the provided name
                lines = lines.map(line => line.replace(/resname/g, name));

                let newLines = [];
                let skipNextLine = false;

                lines.forEach(line => {
                    if (skipNextLine) {
                        // Skip the current line and reset the flag
                        skipNextLine = false;
                        return;
                    }

                    if (this.answers.flagType === 'file' && line.trim().startsWith('env_file:')) {
                        // Skip the line if it starts with env_file: and flag type is 'file'
                        skipNextLine = true;
                        return;
                    }

                    if (this.answers.flagType === 'env' && line.trim().startsWith('volumes:')) {
                        // Skip the line if it starts with volumes: and flag type is 'env'
                        skipNextLine = true;
                        return;
                    }
                    if (!this.answers.flagType && (line.trim().startsWith('env_file:') || line.trim().startsWith('volumes:'))) {
                        // Skip the line if flag type is empty and the line starts with env_file: or volumes:
                        skipNextLine = true;
                        return;
                    }

                    // Replace the UUID placeholder with the actual UUID
                    line = line.replace(/uuid_hl_unique/g, uuid);
                    line = line.replace(/uuid_hl_unique---hobo.gn/g, uuid + '---hobo.gn');

                    newLines.push(line);
                });

                if (this.answers.dockerType === 'rdocker') {
                    // Add rdocker networks configuration at the end
                    newLines.push(``);
                    newLines.push(`    networks:`);
                    newLines.push(`      - rdocker`);
                    newLines.push(``);
                    newLines.push(`networks:`);
                    newLines.push(`  rdocker:`);
                    newLines.push(`    external: true`);
                }

                // Join lines to form the new fileContents
                fileContents = newLines.join('\n');
            }


            // replace uuid with the provided uuid in dockermanager.json
            if (file === dockermanagerFile) {
                try {
                    const dockermanager = JSON.parse(fileContents);
                    dockermanager.name = name;
                    dockermanager.type = this.answers.uuid;
                    dockermanager.container = `REGISTRY_BASE_URL/${name}:stable`;
                    dockermanager.network = name;
                    dockermanager.containeryml = this.answers.uuid + '.yml';
                    fileContents = JSON.stringify(dockermanager, null, 2);
                } catch (err) {
                    console.error(`Error parsing JSON from ${file}:`, err);
                }
            }

            this.fs.write(this.destinationPath(`configs/${configFolder}/${file}`), fileContents);
        });



    }

    end() {
        this.log('Thank you for using the Hacking-Lab Challenge generator today!');
        this.log('Next steps:');
        this.log('- Read README.md file for more information about your base image');
        this.log('- Run docker-compose up --build to build and test your container');
        this.log('- By default web applications are exposed on http://localhost. You can change the port in your docker-compose.yml file');
        this.log('- Develop your challenge');
        if (this.answers.goldnugget) {
            this.log('- Customize root/flag-deploy-scripts/* to put your goldnugget in the correct place');
        }
        this.log('- Once everything is working, run ./prepare.sh and upload dockerfiles.tar.gz to the resource editor');
    }
};
