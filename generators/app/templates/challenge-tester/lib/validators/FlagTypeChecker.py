import os
import re
from lib.basetypes import AutoFixPossibility, Challenge, ValidatorBase


UUID_PATTERN = "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"


class FlagTypeChecker(ValidatorBase):
    @property
    def auto_fix_possibility(self) -> AutoFixPossibility:
        return self.__auto_fix_possibility

    def __init__(self, challenge: Challenge):
        super().__init__(challenge)
        self.__auto_fix_possibility = AutoFixPossibility.FULL
        self.challenge = challenge

        self.flag_type = self.challenge.config_json_file['challengeType']
        self.deploy_type = self.challenge.config_json_file.get('gnDeploy', 'static')

        self.error_prefix = f'Challenge is set to {self.deploy_type.upper()} flag but'

        self.env_flag_compose_reference = None
        self.rel_env_file = self.__check_rel_path(f'{self.challenge.uuid}.env')
        self.rel_env_flag_deploy_script = self.__check_rel_path(
            'root/flag-deploy-scripts/deploy-env-flag.sh')

        self.file_flag_compose_reference = None
        self.rel_gn_file = self.__check_rel_path(f'{self.challenge.uuid}.gn')
        self.rel_file_flag_deploy_script = self.__check_rel_path(
            'root/flag-deploy-scripts/deploy-file-flag.sh')

        self.__load_yaml_flag_config()

    def _validate(self) -> bool:
        result = True

        if self.flag_type != 'dynamicGN' and self.flag_type != 'noGN':
            self.challenge.validation_errors.append(
                f'"challengeType" must be set to "dynamicGN" or "noGN" in {self.challenge.rel_config_json_file_path}.')
            self.__auto_fix_possibility = AutoFixPossibility.NONE
            return False

        if self.flag_type == 'dynamicGN' and self.deploy_type != 'env' and self.deploy_type != 'file':
            self.challenge.validation_errors.append(
                f'"gnDeploy" is invalid for a dynamic flag challenge in {self.challenge.rel_config_json_file_path}.')
            self.__auto_fix_possibility = AutoFixPossibility.NONE
            return False

        if self.flag_type == 'noGN' and self.deploy_type != 'static':
            self.challenge.validation_errors.append(
                f'"gnDeploy" should be removed for a static flag challenge in '
                f'{self.challenge.rel_config_json_file_path}.')
            return False

        # Check dynamic flag configs
        result = (self.__error_parser(
                    f'{self.error_prefix} %s file is referenced in {self.challenge.rel_compose_file_path}.',
                    self.env_flag_compose_reference is not None, f'no "{self.rel_env_file}"', f'"{self.rel_env_file}"',
                    self.file_flag_compose_reference is not None, f'no "{self.rel_gn_file}"', f'"{self.rel_gn_file}"')
                  and result)

        result = (self.__error_parser(
                    f'{self.error_prefix} %s.',
                    self.rel_env_file is not None, f'"{self.rel_env_file}" was found', f'"{self.rel_env_file}" was not found',
                    self.rel_gn_file is not None, f'"{self.rel_gn_file}" was found', f'"{self.rel_gn_file}" was not found')
                  and result)

        result = (self.__error_parser(
                    f'{self.error_prefix} deploy script %s.',
                    self.rel_env_flag_deploy_script is not None, f'{self.rel_env_flag_deploy_script} was not found.', f'{self.rel_env_flag_deploy_script} was found',
                    self.rel_file_flag_deploy_script is not None, f'{self.rel_file_flag_deploy_script} was not found.', f'{self.rel_file_flag_deploy_script} was found',)
                  and result)

        return result

    def _fix(self) -> bool:
        if self.deploy_type != 'env':
            if self.env_flag_compose_reference is not None:
                del self.challenge.compose_file['service'][self.challenge.compose_service_name]['env_file'][self.env_flag_compose_reference]
                self.challenge.fix_log.append(f'Removed ENV flag reference from {self.challenge.rel_compose_file_path}')
            self.__remove_flag_and_deploy_file(self.rel_env_file, self.rel_env_flag_deploy_script)

        if self.deploy_type != 'file':
            if self.file_flag_compose_reference is not None:
                del self.challenge.compose_file['service'][self.challenge.compose_service_name]['volumes'][self.file_flag_compose_reference]
                self.challenge.fix_log.append(f'Removed FILE flag reference from {self.challenge.rel_compose_file_path}')

            self.__remove_flag_and_deploy_file(self.rel_gn_file, self.rel_file_flag_deploy_script)

        return True

    def __load_yaml_flag_config(self):
        """
        Checks the compose.yml for ENV and FILE flag entry.
        """
        service = self.challenge.compose_file['services'][self.challenge.compose_service_name]
        self.env_flag_compose_reference = next(
            (env_file for env_file in service.get('env_file', []) if f'./{self.challenge.uuid}.env' in env_file),
            None)
        self.file_flag_compose_reference = next(
            (volume for volume in service.get('volumes', []) if f'/{self.challenge.uuid}---hobo.gn' in volume),
            None)

    def __error_parser(
            self,
            error_string: str,
            env_check: bool, env_should_be_text: str, env_should_not_be_text: str,
            file_check: bool, file_should_be_text: str, file_should_not_be_text: str) -> bool:
        """
        Parses an error by conditions for ENV or FILE flags.
        :param error_string: The template error message.
        :param env_check: True if the ENV check was successful.
        :param env_should_be_text: Error injection text if the ENV check should be successful but wasn't.
        :param env_should_not_be_text: Error injection text if the ENV check was successful but shouldn't.
        :param file_check: True if the FILE check was successful.
        :param file_should_be_text: Error injection text if the FILE check should be successful but wasn't.
        :param file_should_not_be_text: Error injection text if the FLAG check was successful but shouldn't.
        :return: True if no error was found else False.
        """
        error_count = len(self.challenge.validation_errors)

        if self.deploy_type == 'env':
            if not env_check:
                self.challenge.validation_errors.append(error_string % env_should_be_text)
            if file_check:
                self.challenge.validation_errors.append(error_string % file_should_not_be_text)
        elif self.deploy_type == 'file':
            if env_check:
                self.challenge.validation_errors.append(error_string % env_should_not_be_text)
            if not file_check:
                self.challenge.validation_errors.append(error_string % file_should_be_text)
        elif self.deploy_type == 'static':
            if env_check:
                self.challenge.validation_errors.append(error_string % env_should_not_be_text)
            if file_check:
                self.challenge.validation_errors.append(error_string % file_should_not_be_text)

        return len(self.challenge.validation_errors) == error_count

    def __check_rel_path(self, rel_path: str) -> str | None:
        """
        Checks if *directory*/*rel_path* is a valid path.
        :param rel_path: The relative path to check against the challenge root.
        :return: The relative path itself if it is valid or None.
        """
        if rel_path is not None and os.path.isfile(os.path.join(self.challenge.root, rel_path)):
            return rel_path
        else:
            return None

    def __remove_flag_and_deploy_file(self, rel_flag_file: str, rel_deploy_file: str):
        if rel_flag_file is not None:
            self.__remove_rel_file_if_exist(rel_flag_file)
            self.challenge.fix_log.append(f'Deleted "{self.rel_gn_file}" file')
        if self.rel_file_flag_deploy_script is not None:
            self.__remove_rel_file_if_exist(rel_deploy_file)
            self.challenge.fix_log.append(f'Deleted FILE flag deployment script: {self.rel_file_flag_deploy_script}.')

    def __remove_rel_file_if_exist(self, rel_file: str):
        """
        Deletes a relative file if it exists.
        :param rel_file: The relative filepath.
        """
        if rel_file is not None and (fullpath := os.path.join(self.challenge.root, rel_file)):
            if os.path.isfile(fullpath):
                os.remove(fullpath)

    @staticmethod
    def __get_files_by_regex(pattern: str, dir_path: str) -> []:
        """
        Searches for files under a given path by using a regex pattern.
        :param pattern: The regex to test.
        :param dir_path: The path under which the files should be searched.
        :return: A list of files that matched against the regex.
        """
        reg = re.compile(pattern)
        return list(filter(lambda filename: reg.match(filename) is not None, os.listdir(dir_path)))
