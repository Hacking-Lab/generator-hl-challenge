const Generator = require('yeoman-generator');
const fs = require('fs');

module.exports = class extends Generator {
    async prompting() {
        this.answers = await this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Resource name (use-snake-case)',
                default: this.appname.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase(),
            },
            {
                type: 'input',
                name: 'uuid',
                message: 'Resource UUID',
            },
            {
                type: 'list',
                name: 'image',
                message: 'Select base image',
                choices: [
                    'alpine-base',
                    'alpine-nginx',
                    'alpine-nginx-php',
                    'alpine-python-flask',
                ]
            },
            {
                type: 'confirm',
                name: 'rdocker',
                message: 'Does your challenge require a full public IP (rdocker)? [If in doubt, say NO]',
                default: false
            },
            {
                type: 'confirm',
                name: 'goldnugget',
                message: 'Add support for dynamic goldnugget?',
                default: true
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
        this.fs.copyTpl(this.templatePath('docker-compose.yml'), this.destinationPath('docker-compose.yml'), this.answers);
        this.fs.copyTpl(this.templatePath('Dockerfile'), this.destinationPath('Dockerfile'), this.answers);
        this.fs.copyTpl(this.templatePath('gitignore'), this.destinationPath('.gitignore'), this.answers);
        this.fs.copyTpl(this.templatePath(this.answers.image + '.md'), this.destinationPath('README.md'), this.answers);
        this.fs.copyTpl(this.templatePath('default.env'), this.destinationPath(this.answers.uuid + '.env'), this.answers);

        if (this.answers.goldnugget && this.answers.uuid) {
            this.fs.write(
                this.destinationPath(this.answers.uuid + '.gn'),
                'GOLDNUGGET=___THIS_IS_YOUR_DYNAMIC_GOLDNUGGET___'
            );

            this.fs.copyTpl(
                this.templatePath('flag-deploy-scripts'),
                this.destinationPath('root/flag-deploy-scripts'),
                this.answers
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
};
