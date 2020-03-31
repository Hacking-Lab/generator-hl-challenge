#!/bin/bash
UUID=<%= uuid %>
if [ -z "$UUID" ]; then
    echo -n "Enter UUID: "
    read UUID
fi

[ -e dockerfiles.tar.gz ] && rm dockerfiles.tar.gz

tar cvzf dockerfiles.tar.gz Dockerfile "$UUID.gn" root/

md5sum dockerfiles.tar.gz
