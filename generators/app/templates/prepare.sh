#!/bin/bash

UUID=<%= uuid %>
if [ -z "$UUID" ]; then
    echo -n "Enter UUID from HL Resource Editor: "
    read UUID
fi

./challenge-tester/hl-challenge-config-checker.py -c ./ || exit 1

echo "============== Creating tar.gz ===================="
echo ""

[ -e dockerfiles.tar.gz ] && rm dockerfiles.tar.gz

if [ -e "$UUID".* ]; then
    tar cvzf dockerfiles.tar.gz --exclude='**/node_modules/*' Dockerfile $UUID.* root/ challenge-description/ configs/
else
    tar cvzf dockerfiles.tar.gz --exclude='**/node_modules/*' Dockerfile root/ challenge-description/ configs/
fi

if test -f /usr/bin/md5sum; then
    /usr/bin/md5sum ./dockerfiles.tar.gz
fi

if test -f /sbin/md5; then
    /sbin/md5 ./dockerfiles.tar.gz
fi

