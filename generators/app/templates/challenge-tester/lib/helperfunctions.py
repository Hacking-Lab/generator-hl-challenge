import colorama
from colorama import Style


def print_color(color: colorama.ansi.Fore, content: str, **kwargs):
    """
    Prints the 'content' in the given color.
    :param color: The color which should be used.
    :param content: The content to print.
    """
    print(color + content + Style.RESET_ALL, **kwargs)


def create_banner(total_length: int, char: str, msg: str):
    """
    Helper method to create ASCII banners.
    :param total_length: The total length of the banner.
    :param char: The char to use as pre- and suffix.
    :param msg: The string which is between the pre- and suffix.
    :return: The banner as string.
    """
    append_length = total_length - len(msg) - 2
    if append_length <= 0:
        return f'{char} {msg} {char}'

    is_even = append_length % 2 == 0
    char_count = append_length // 2
    return '{} {} {}'.format(char * char_count, msg, char * (char_count + (0 if is_even else 1)))


def yaml_get_path(path: str, yaml):
    """
    Searches a yaml for a specific path. Paths must be separated by a colon.
    :param path: The path to search in the yaml. (Node1:SubNode:SubSubNode)
    :param yaml: The yaml to search in.
    :return: The value of the node which was found under the given path or None.
    """
    current_yaml = yaml
    path_parts = path.split(':')
    for node in path_parts:
        if node in current_yaml:
            current_yaml = current_yaml[node]
        else:
            return None
    return current_yaml
