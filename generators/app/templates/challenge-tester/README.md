# hl-challenge-config-checker
## Introduction
Tool to check possible conflicts in existing challenge configuration
* ENV file available but not referenced in yml
* FILE not used
* Port number not set

## Feature of this tool
* Analyze mode: Prints an error for every invalid configuration
* Fixing mode: Tries to fix some invalid configuration

## Programming Language
* Python 3

## Usage
```
usage: ./hl-challenge-config-checker.py [-h] [-f] -c [N ...]

A tool to check (and fix) a challenge if it not complies the HL standard.
The following checks are done:
 - If FILE flag is used then all ENV flag files should be removed and vice versa.
 - ENV and FILE flags are not used at the same time.
 - Port numbers are set
 - iDocker and rDocker properties are used consistently.

options:
  -h, --help            show this help message and exit
  -f, --fix             Tries to fix challenge(s) if possible. Use with caution!
  -c [N ...], --challenge [N ...]
                        Space separated list of paths to all challenges which should be checked.
```
