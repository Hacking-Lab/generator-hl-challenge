#!/bin/bash
UUID=<%= uuid %>
if [ -z "$UUID" ]; then
    echo -n "Enter UUID: "
    read UUID
fi

./challenge-tester/hl-challenge-config-checker.py -c ./ || exit 1

echo "============================================================
=================== Creating tar.gz ===================="
echo ""

[ -e dockerfiles.tar.gz ] && rm dockerfiles.tar.gz

if [ -e "$UUID".* ]; then
    tar cvzf dockerfiles.tar.gz Dockerfile $UUID.* root/ challenge-description/ configs/
else
    tar cvzf dockerfiles.tar.gz Dockerfile root/ challenge-description/ configs/
fi

md5sum dockerfiles.tar.gz