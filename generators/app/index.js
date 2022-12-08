const Generator = require('yeoman-generator');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');


module.exports = class extends Generator {
    async prompting() {
        this.log("Before we start, we'll need a bit of information about this new challenge.");
        this.log("Make sure you have created a resource in the editor and have the UUID ready.");

        this.answers = await this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Resource name (use-kebab-case; must match the name given in the resource editor)',
                default: this.appname.replace(/[^a-z0-9-]/ig, '-').toLowerCase(),
                validate: x => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(x),
            },
            //Ask the user for the resource UUID from resource editor if not provided generate a random UUID
            
            {
                type: 'input',
                name: 'uuid',
                message: 'Resource UUID (fetch it from the resource editor or leave blank to generate a random one)',
                default: uuidv4(),
                validate: x => /^\s*[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{12}\s*$/i.test(x),
                filter: x => x.toLowerCase().trim(),
            },
            {
                type: 'list',
                name: 'image',
                message: 'Select base image',
                choices: [
                    {
                        name:  'alpine-base-hl: empty base alpine image with flag and user handling, for your own custom service',
                        short: 'alpine-base-hl',
                        value: 'alpine-base-hl'
                    },
                    {
                        name:  'alpine-nginx-hl: NGINX web server for static web sites',
                        short: 'alpine-nginx-hl',
                        value: 'alpine-nginx-hl'
                    },
                    {
                        name:  'alpine-nginx-php-hl: NGINX-PHP web server for static and dynamic web sites',
                        short: 'alpine-nginx-php-hl',
                        value: 'alpine-nginx-php-hl'
                    },
                    {
                        name:  'alpine-python-flask-hl: PYTHON-FLASK web application',
                        short: 'alpine-python-flask-hl',
                        value: 'alpine-python-flask-hl'
                    },
                    {
                        name:  'alpine-ttyd-hl: WEB-SHELL based on ttyd (without authentication)',
                        short: 'alpine-ttyd-hl',
                        value: 'alpine-ttyd-hl'
                    },
                    {
                        name:  'alpine-siab-hl: WEB-SHELL based on shell in a box (with authentication)',
                        short: 'alpine-siab-hl',
                        value: 'alpine-siab-hl'
                    },
                    {
                        name:  'alpine-tinyproxy-hl: HTTP/HTTPS Proxy based on tinyproxy',
                        short: 'alpine-tinyproxy-hl',
                        value: 'alpine-tinyproxy-hl'
                    },
                    {
                        name:  'alpine-openssh-server-hl: SSH docker server',
                        short: 'alpine-openssh-server-hl',
                        value: 'alpine-openssh-server-hl'
                    },
                    {
                        name:  'alpine-nginx-nodejs-hl: NODEJS node app.js (Hello World)',
                        short: 'alpine-nginx-nodejs-hl',
                        value: 'alpine-nginx-nodejs-hl'
                    },
                    {
                        name:  'alpine-nginx-nodejs-websocketd-hl: NODEJS npm start (Node and Websocket Service)',
                        short: 'alpine-nginx-nodejs-websocketd-hl',
                        value: 'alpine-nginx-nodejs-websocketd-hl'
                    },
                    {
                        name:  'alpine-binary-c-dynamic-hl: Execuable C with compiled flag',
                        short: 'alpine-binary-c-dynamic-hl',
                        value: 'alpine-binary-c-dynamic-hl'
                    },

                    {
                        name:  'alpine-binary-c-hl: Execuable C binary',
                        short: 'alpine-binary-c-hl',
                        value: 'alpine-binary-c-hl'
                    },

                    {
                        name:  'alpine-unitd-hl: Unitd web server : Small unitd web service (static page)',
                        short: 'alpine-unitd-hl',
                        value: 'alpine-unitd-hl'
                    },

                    {
                        name:  'alpine-nginx-theia-ide: Alpine Linux, s6 startup, NGINX and static web site, Theia web IDE',
                        short: 'alpine-nginx-theia-ide',
                        value: 'alpine-nginx-theia-ide'
                    },
                    {
                        name:  'alpine-apache2-hl: Alpine apache2 web server',
                        short: 'alpine-apache2-hl',
                        value: 'alpine-apache2-hl'
                    }

                ],
                filter: x => x.split(':')[0],
            },
            // Not needed at the moment
            // {
            //     type: 'list',
            //     name: 'rdocker',
            //     message: 'What type of container are you developing?',
            //     choices: [
            //         {
            //             name: 'A normal web application, hosted through a reverse proxy with HTTPS (idocker)',
            //             short: 'idocker',
            //             value: false,
            //         },
            //         {
            //             name: 'Any other type of network service (rdocker)',
            //             short: 'rdocker',
            //             value: true,
            //         }
            //     ],
            //     default: false,
            // },
            {
                type: 'confirm',
                name: 'goldnugget',
                message: 'Add support for dynamic goldnugget?',
                default: true,
            },
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
        const tplFiles = [
            'docker-compose.yml',
            'Dockerfile',
            'gitignore:.gitignore',
            `${this.answers.image}.md:README.md`,
            `default.env:${this.answers.uuid}.env`,
            'prepare.sh',
        ];

        for (const tpl of tplFiles.map(x => x.split(':'))) {
            if (fs.existsSync(this.templatePath(tpl[0]) + '.' + this.answers.image)){
                tpl[1] = tpl[0];
                tpl[0]+= '.' + this.answers.image;
            }
            this.fs.copyTpl(
                this.templatePath(tpl[0]),
                this.destinationPath(tpl.length > 1 ? tpl[1] : tpl[0]),
                this.answers
            );
        }

        if (this.answers.goldnugget && this.answers.uuid) {
            this.fs.write(
                this.destinationPath(this.answers.uuid + '.gn'),
                'GOLDNUGGET=SED_GOLDNUGGET'
            );
            this.fs.write(
                this.destinationPath(this.answers.uuid + '.env'),
                'GOLDNUGGET=SED_GOLDNUGGET'
            );
            this.fs.copyTpl(
                this.templatePath('flag-deploy-scripts'),
                this.destinationPath('root/flag-deploy-scripts'),
                this.answers
            );
        }

        if (!this.answers.goldnugget) {
            this.fs.write(
                this.destinationPath('root/no_gn_flag.md'),
                'This challenge does not support goldnugget as you have chosen not to use it.'
            );
        }

        if (fs.existsSync(this.templatePath(this.answers.image))) {
            this.fs.copyTpl(
                this.templatePath(this.answers.image),
                this.destinationPath('root'),
                this.answers
            );
        }
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
