FROM hackinglab/<%= image %>:3.2.0

LABEL maintainer=<<%= authorEmail %>>
MAINTAINER <%= authorName %> <<%= authorEmail %>>

<% if (image == 'alpine-python-flask') { %>
# Install app requirements (keep separate from other files to allow quicker build times)
COPY root/app/requirements.txt /app/requirements.txt
RUN pip3 install -r /app/requirements.txt
<% } %>



COPY root /

<% if (image == 'alpine-binary-c') { %>
RUN apk update 
RUN apk add --no-cache gcc libc-dev unit curl libseccomp libseccomp-dev socat unit
# Compiling binary from source ( replace the binary with the one from the challenge - /src/binary.c)
RUN gcc /src/binary.c -o /server -lseccomp
# Creating a tar file with the Executable for analysis
RUN tar cf /web/server.tar /server /lib/ld-musl-x86_64.so.1 /usr/lib/libseccomp.so.2.5.1
<% } %>