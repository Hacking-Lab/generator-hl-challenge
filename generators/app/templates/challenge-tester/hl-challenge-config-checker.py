#!/usr/bin/python3

import argparse
from colorama import Fore
import glob
import os
import sys
from lib.basetypes import Challenge, ValidatorBase, AutoFixPossibility
from lib.helperfunctions import print_color, create_banner

BANNER_CHAR = '='
CHALLENGE_BANNER_LENGTH = 60
SCRIPT_FILENAME = os.path.basename(__file__)
SCRIPT_DIR = os.path.dirname(__file__)

# Command line argument handling #
#####################################
parser = argparse.ArgumentParser(
    prog=f'./{SCRIPT_FILENAME}',
    description='A tool to check (and fix) a challenge if it not complies the HL standard.\n'
                'The following checks are done:\n'
                ' - If FILE flag is used then all ENV flag files should be removed and vice versa.\n'
                ' - ENV and FILE flags are not used at the same time.\n'
                ' - Port numbers are set\n'
                ' - iDocker and rDocker properties are used consistently.',
    formatter_class=argparse.RawTextHelpFormatter)

parser.add_argument('-f', '--fix',
                    action='store_true',
                    default=False,
                    dest='fix_challenge',
                    help='Tries to fix challenge(s) if possible. Use with caution!')
parser.add_argument('-c', '--challenge',
                    metavar='N',
                    required=True,
                    type=str,
                    nargs='*',
                    dest='challenges_to_check',
                    help='Space separated list of paths to all challenges which should be checked.')
args = parser.parse_args()


def handle_challenge(challenge: Challenge):
    """
    Runs all validators for a challenge.
    :param challenge: The challenge to validate.
    """
    print('Validating...', end='')
    # Create an instance of each validator
    validators = [validator(challenge) for validator in ValidatorBase.__subclasses__()]
    [validator.validate() for validator in validators]
    print_color(Fore.GREEN, 'done')

    if validation_errors_found := any(v.validation_checks_passed is False for v in validators):
        print_color(Fore.RED, 'Issues found:')
        for entry in challenge.validation_errors:
            print_color(Fore.YELLOW, f'  {entry}')
        print()
    else:
        print_color(Fore.GREEN, 'No validation errors found.')

    if args.fix_challenge and validation_errors_found:
        print('Auto fixing...', end='')
        for validator in validators:
            if validator.auto_fix_possibility != AutoFixPossibility.NONE:
                validator.fix()

        if any(v.autofix_was_successful is False for v in validators):
            print_color(Fore.RED, 'Errors occurred during autofix')

        elif len(challenge.fix_log) == 0:
            print_color(Fore.RED, 'Was not possible to do any auto fixes')

        elif any(v.auto_fix_possibility == AutoFixPossibility.PARTIAL or
                 v.auto_fix_possibility == AutoFixPossibility.NONE
                 for v in validators):
            print_color(Fore.RED, 'Only partial autofix was possible')
        else:
            print_color(Fore.GREEN, 'done')

        if len(challenge.fix_log) > 0:
            print_color(Fore.LIGHTYELLOW_EX, 'Fixes:')
            for entry in challenge.fix_log:
                print_color(Fore.YELLOW, f'  {entry}')


# Load validator modules
module_files = glob.glob(f'{SCRIPT_DIR}/lib/validators/*.py')
for module_file in module_files:
    module_namespace = os.path.relpath(module_file, SCRIPT_DIR).replace('/', '.').replace('.py', '')
    module = __import__(module_namespace)

validation_errors_found = False
for challenge_path in args.challenges_to_check:
    challenge = Challenge(challenge_path)

    challenge_banner = create_banner(CHALLENGE_BANNER_LENGTH, BANNER_CHAR, f'Validating challenge "{challenge.name}"')
    print_color(Fore.LIGHTCYAN_EX, f'{BANNER_CHAR * CHALLENGE_BANNER_LENGTH}\n{challenge_banner}\n')

    # Check challenge
    handle_challenge(challenge)

    if args.fix_challenge:
        challenge.save_files()

    if len(challenge.validation_errors) > 0:
        validation_errors_found = True

    print()

if validation_errors_found:
    if not args.fix_challenge:
        print_color(
            Fore.YELLOW,
            f'You can try to autofix the challenge by using:\n'
            f'  {sys.argv[0]} --fix --challenge {" ".join(args.challenges_to_check)}')
    exit(1)
else:
    exit(0)
