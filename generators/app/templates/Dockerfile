<% if (image == 'alpine-python-flask') { %>

FROM hackinglab/<%= image %>:latest

LABEL maintainer=<<%= authorEmail %>>
MAINTAINER <%= authorName %> <<%= authorEmail %>>

# Install app requirements (keep separate from other files to allow quicker build times)
COPY root/app/requirements.txt /app/requirements.txt
RUN pip3 install -r /app/requirements.txt

COPY root /
<% } 

else if (image == 'alpine-binary-c') { %>

FROM hackinglab/alpine-base:latest
LABEL maintainer=<>
MAINTAINER  <>
COPY root /
RUN apk update 
RUN apk add --no-cache gcc libc-dev unit curl libseccomp libseccomp-dev socat unit
# Compiling binary from source ( replace the binary with the one from the challenge - /src/binary.c)

RUN cp /lib/ld-musl-x86_64.so.1 /
RUN cp /usr/lib/libseccomp.so.2.5.1 /
RUN tar cf /web/support.tar  /ld-musl-x86_64.so.1 /libseccomp.so.2.5.1


<% }


else if (image == 'alpine-nginx-theia-ide') { %>

FROM hackinglab/alpine-nginx-with-theia-web-ide:latest

LABEL maintainer=<<%= authorEmail %>>

MAINTAINER <%= authorName %> <<%= authorEmail %>>

USER root

COPY root /

RUN chown -R 2000:2000 /home/theia

<% }


else {%>

FROM hackinglab/<%= image %>:latest

LABEL maintainer=<<%= authorEmail %>>
MAINTAINER <%= authorName %> <<%= authorEmail %>>



<% }

%>





