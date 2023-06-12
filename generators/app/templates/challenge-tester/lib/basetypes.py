from abc import ABC, abstractmethod
from builtins import FileNotFoundError
from enum import Enum
import json
import os
import yaml


class AutoFixPossibility(Enum):
    NONE = 0,
    PARTIAL = 1,
    FULL = 2,


class DockerType(Enum):
    I_DOCKER = 0,
    R_DOCKER = 1,


class Challenge:
    """
    Class that represents and holds settings about a challenge.
    """
    def __init__(self, path: str):
        self.validation_errors = []
        self.fix_log = []
        self.root = os.path.normpath(path)
        self.config_path = None
        self.compose_file_path = None
        self.compose_file = None
        self.config_json_file_path = None
        self.config_json_file = None

        self.load_files()
        self.name = self.config_json_file['name']
        self.uuid = self.config_json_file['type']
        self.docker_type = self.__get_docker_type()
        self.compose_service_name = self.__get_compose_service_name()

    @property
    def rel_config_json_file_path(self):
        return os.path.relpath(self.config_json_file_path, self.root)

    @property
    def rel_compose_file_path(self):
        return os.path.relpath(self.compose_file_path, self.root)

    def load_files(self):
        """
        Searches and loads config files.
        """
        if not os.path.exists(self.root):
            raise FileNotFoundError(f'Path "{self.root}" does not exist.')
        elif not os.path.isdir(self.root):
            raise NotADirectoryError(f'Path "{self.root}" is not a directory.')

        self.config_path = check_paths(
            [f'{self.root}/configs/idocker', f'{self.root}/configs/rdocker'],
            allow_multi=False,
            throw_error=True)
        self.compose_file_path = f'{self.config_path}/compose.yml'
        self.config_json_file_path = check_paths(
            [f'{self.config_path}/dockermanager_file_gn.json',
             f'{self.config_path}/dockermanager_env_gn.json',
             f'{self.config_path}/dockermanager_no_gn.json'],
            allow_multi=False,
            throw_error=True)

        with open(self.compose_file_path, 'r') as yml_file:
            self.compose_file = yaml.safe_load(yml_file)
        with open(self.config_json_file_path, 'r') as json_file:
            self.config_json_file = json.load(json_file)

    def save_files(self):
        """
        Saves the JSON-Config and compose.yml file
        """
        with open(self.compose_file_path, 'w') as yml_file:
            yaml.safe_dump(self.compose_file, yml_file)
        with open(self.config_json_file_path, 'w') as json_file:
            json.dump(self.config_json_file, json_file, indent=2)

    def __get_docker_type(self):
        """
        Gets the challenge type.
        :return: iDocker or rDocker
        """
        if self.config_json_file['ipAccess'] == 'nat':
            return DockerType.I_DOCKER
        elif self.config_json_file['ipAccess'] == 'direct':
            return DockerType.R_DOCKER
        else:
            raise AttributeError(f'"ipAccess" is invalid in {self.rel_config_json_file_path}.')

    def __get_compose_service_name(self) -> str:
        """
        Gets the Docker-Compose main service name.
        :return: Name of the service
        """
        for service_key in self.compose_file['services']:
            service_value = self.compose_file['services'][service_key]
            if 'image' in service_value and f'REGISTRY_BASE_URL/{self.name}:' in service_value['image']:
                return service_key

        raise AttributeError(f'Service could not be found in {self.rel_compose_file_path}. Syntax error?')


class ValidatorBase(ABC):
    """
    This class represents a validator, and it's base methods.
    All validators should inherit this class and container all abstract methods.
    Every class which inherits from this class and is inside ./lib/validators will be dynamically loaded and executed.
    """
    @property
    @abstractmethod
    def auto_fix_possibility(self) -> AutoFixPossibility:
        """
        This property defines if an auto fix is possible or not.
        :return: True if auto fix is possible else False.
        """
        pass

    @property
    def validation_checks_passed(self) -> bool:
        """
        Returns if the challenge passed all validations successfully.
        :return: True if all validations were passed else False.
        """
        return self.__validation_checks_passed

    @property
    def autofix_was_successful(self) -> bool:
        """
        Returns if auto fixing of the challenge was successful.
        :return: True if autofix was successful.
        """
        return self.__autofix_was_successful

    def __init__(self, challenge: Challenge):
        """
        This method initialized the validator.
        The passed challenge should be saved inside an object variable.
        :param challenge: The challenge to validate.
        """
        self.challenge = challenge
        self.__validation_checks_passed = False
        self.__autofix_was_successful = False

    def validate(self):
        """
        This is a wrapper method to save the result of _validate() into a variable.
        """
        self.__validation_checks_passed = self._validate()

    def fix(self):
        """
        This is a wrapper method to save the result of _fix() into a variable.
        """
        self.__autofix_was_successful = self._fix()

    @abstractmethod
    def _validate(self):
        """
        This method gets called when a challenge should be checked.
        Any validation errors should be added to challenge.validation_errors.
        challenge.root contains the path to the challenge.
        challenge.config_json_file contains the contents of dockermanager_xxx_gn.json
        challenge.compose_file container the contents of compose.yml
        :return: True if all tests are passed else False.
        """
        pass

    @abstractmethod
    def _fix(self):
        """
        This method gets called when a challenge should be fixed (if possible).
        Any fix errors should be added to challenge.fix_errors.
        challenge.root contains the path to the challenge.
        challenge.config_json_file contains the contents of dockermanager_xxx_gn.json
        challenge.compose_file container the contents of compose.yml
        :return: True if a fix was possible else False.
        """
        pass


def check_paths(paths: [], allow_multi=False, throw_error=False):
    """
    Checks if the given paths exist.
    :param paths: String array of the paths to check.
    :param allow_multi: Set to True if multiple matching paths should be allowed.
    :param throw_error: Set to True if an exception should be thrown upon validation error.
    :return: One or many existing paths.
    """
    exception = None
    result = None
    existing_paths = list(filter(lambda path: os.path.exists(path), paths))
    if len(existing_paths) == 0:
        error_msg = f'Could not find any path: {paths}.'
        exception = FileNotFoundError(error_msg)
    elif len(existing_paths) > 1 and not allow_multi:
        error_msg = f'Multiple existing paths found but only one is allowed: {existing_paths}.'
        exception = Exception(error_msg)
    else:
        result = existing_paths[0]

    if exception is not None and throw_error:
        raise exception

    return result
