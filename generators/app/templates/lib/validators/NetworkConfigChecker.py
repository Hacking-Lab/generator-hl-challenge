from lib.basetypes import AutoFixPossibility, Challenge, DockerType, ValidatorBase
from lib.helperfunctions import yaml_get_path


class TraefikLabelChecker(ValidatorBase):
    TRAEFIK_PORT_LABEL = "traefik.port=ENTER_YOUR_PORT_NUMBER_HERE"
    TRAEFIK_LABELS = [
        "traefik.frontend.rule=Host:hobo.idocker.REALM_DOMAIN_SUFFIX",
        "traefik.protocol=http",
        "traefik.frontend.errors.network.status=500-599",
        "traefik.frontend.errors.network.backend=errorpage",
        "traefik.frontend.errors.network.query=/{status}.html"
    ]

    @property
    def auto_fix_possibility(self) -> AutoFixPossibility:
        return self.__auto_fix_possibility

    def __init__(self, challenge: Challenge):
        super().__init__(challenge)
        self.__auto_fix_possibility = AutoFixPossibility.FULL
        self.challenge = challenge

        self.set_protocol = None
        self.labels_found = False
        self.traefik_port = -1
        self.config_json_port = -1
        self.missing_traefik_labels = []

    def _validate(self) -> bool:
        error_count = len(self.challenge.validation_errors)

        # Check port in JSON-Config
        self.config_json_port = TraefikLabelChecker.__get_port_from_string(self.challenge.config_json_file['port'])
        if self.config_json_port == -1:
            self.challenge.validation_errors.append(f'"port" is invalid in {self.challenge.rel_config_json_file_path}.')
            self.__auto_fix_possibility = AutoFixPossibility.PARTIAL

        if self.challenge.docker_type == DockerType.I_DOCKER:
            self.__idocker_validation()
        else:
            self.__rdocker_validation()

        return len(self.challenge.validation_errors) == error_count

    def _fix(self) -> bool:
        if self.set_protocol is not None:
            self.challenge.config_json_file['protocol'] = self.set_protocol
            self.challenge.fix_log.append(
                f'"protocol" has been set to "{self.set_protocol}" in {self.challenge.rel_config_json_file_path}.')

        if not self.labels_found:
            self.challenge.compose_file['services'][self.challenge.compose_service_name]['labels'] = self.TRAEFIK_LABELS
            self.challenge.fix_log.append(
                f'Added missing Traefik labels in {self.challenge.rel_compose_file_path}. '
                f'You still need to set a port number')

        else:
            for label in self.missing_traefik_labels:
                key = label.split('=')[0]
                self.challenge.compose_file['services'][self.challenge.compose_service_name]['labels'].append(label)
                self.challenge.fix_log.append(
                    f'Missing label "{key}" has been added to {self.challenge.rel_compose_file_path}')

        return True

    def __idocker_validation(self):
        """
        Validates iDocker network properties. (Traefik labels, protocol, etc.)
        """
        # Check JSON-Config #
        if self.challenge.config_json_file['protocol'] != 'http':
            self.set_protocol = 'http'
            self.challenge.validation_errors.append(
                f'"protocol" should be "nat" for a iDocker challenge in {self.challenge.rel_config_json_file_path}.')

        # Check Traefik Labels #
        existing_labels = yaml_get_path(
            f'services:{self.challenge.compose_service_name}:labels', self.challenge.compose_file)

        if existing_labels is None:
            self.missing_traefik_labels.append(self.TRAEFIK_LABELS)
            self.challenge.validation_errors.append(
                f'Traefik labels are missing in {self.challenge.rel_compose_file_path}.')
            self.__auto_fix_possibility = AutoFixPossibility.PARTIAL
            return False
        else:
            self.labels_found = True

            # Check if all traefik labels are set
            for label in self.TRAEFIK_LABELS:
                (key, value) = label.split('=')
                if not any(key in el for el in existing_labels):
                    self.missing_traefik_labels.append(label)
                    self.challenge.validation_errors.append(
                        f'Traefik label "{key}" is missing in {self.challenge.rel_compose_file_path}.')

        # Check if traefik port number is set
        port_value = next((p.split('=')[1] for p in existing_labels if p.startswith('traefik.port')), None)
        self.traefik_port = TraefikLabelChecker.__get_port_from_string(port_value)
        if port_value is None:
            self.challenge.validation_errors.append(
                f'"traefik.port" is missing in {self.challenge.rel_compose_file_path}.')
            self.__auto_fix_possibility = AutoFixPossibility.PARTIAL
        elif self.traefik_port == -1:
            self.challenge.validation_errors.append(
                f'"traefik.port" is invalid in {self.challenge.rel_compose_file_path}.')
            self.__auto_fix_possibility = AutoFixPossibility.PARTIAL
        elif self.config_json_port != -1 and self.traefik_port != self.config_json_port:
            self.challenge.validation_errors.append(
                f'"port" in {self.challenge.rel_config_json_file_path} and '
                f'"traefik.port" in {self.challenge.rel_config_json_file_path} do not have the same value')

    def __rdocker_validation(self):
        """
        Validates rDocker network properties. (protocol)
        """
        if self.challenge.config_json_file['protocol'] != 'socket':
            self.set_protocol = 'socket'
            self.challenge.validation_errors.append(
                f'"protocol" should be "socket" for a rDocker challenge in {self.challenge.rel_config_json_file_path}.')

    @staticmethod
    def __get_port_from_string(port_string: str) -> int:
        """
        Checks if a string is a port number.
        :param port_string: String to check.
        :return: The parsed port number or -1.
        """
        if port_string is not None and port_string.isdigit() and (0 < int(port_string) < 65535):
            return int(port_string)
        else:
            return -1
