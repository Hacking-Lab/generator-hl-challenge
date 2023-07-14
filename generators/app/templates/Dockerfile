<% if (image == 'alpine-python-flask-hl') { -%>FROM hackinglab/<%= image %>:latest

LABEL maintainer=<<%= authorEmail %>>
MAINTAINER <%= authorName %> <<%= authorEmail %>>

# Install app requirements (keep separateFROM other files to allow quicker build times)
ADD root/app/requirements.txt /app/requirements.txt
RUN pip3 install -r /app/requirements.txt

ADD root /

<%} 

else if (image == 'alpine-binary-c-hl') { -%>FROM hackinglab/alpine-base-hl:latest

LABEL maintainer=<<%= authorEmail %>>
MAINTAINER <%= authorName %> <<%= authorEmail %>>

ADD root /
RUN apk update
RUN chmod +x /etc/services.d/*/run 
RUN apk add --no-cache gcc libc-dev unit curl libseccomp libseccomp-dev socat unit
# Compiling binaryFROM source ( replace the binary with the oneFROM the challenge - /src/binary.c)


RUN gcc /src/binary.c -o /server -lseccomp
# Creating a tar file with the Executable for analysis
RUN tar cf /web/server.tar /server /lib/ld-musl-x86_64.so.1 /usr/lib/libseccomp.so.2.5.2
<%}


else if (image == 'alpine-binary-c-dynamic-hl') { -%>FROM hackinglab/alpine-base-hl:latest

LABEL maintainer=<>
MAINTAINER  <>
ADD root /
RUN apk update 
RUN chmod +x /etc/services.d/*/run
RUN apk add --no-cache gcc libc-dev unit curl libseccomp libseccomp-dev socat unit
# Compiling binaryFROM source ( replace the binary with the oneFROM the challenge - /src/binary.c)

RUN cp /lib/ld-musl-x86_64.so.1 /
RUN cp /usr/lib/libseccomp.so.2.5.2 /
RUN tar cf /web/support.tar  /ld-musl-x86_64.so.1 /libseccomp.so.2.5.2


<%}

else if (image == 'alpine-unitd-hl') { -%>FROM hackinglab/alpine-base-hl:latest

LABEL maintainer=<>
MAINTAINER  <>
ADD root /

RUN apk add --no-cache --update \
    unit && \
    rm -rf /var/cache/apk/* && \
    chown -R root:root /opt/www

ENTRYPOINT ["unitd", "--no-daemon", "--log", "/dev/stderr"]


<%}

else if (image == 'alpine-tinyproxy-hl') { -%>FROM hackinglab/alpine-tinyproxy-hl:latest

LABEL maintainer=<>
MAINTAINER  <>

ADD root /


VOLUME /etc/tinyproxy

EXPOSE 8888

CMD ["tinyproxy", "-d"]


<%}

else if (image == 'alpine-nginx-theia-ide') { -%>FROM hackinglab/alpine-nginx-with-theia-web-ide:latest

LABEL maintainer=<<%= authorEmail %>>

MAINTAINER <%= authorName %> <<%= authorEmail %>>

USER root

ADD root /

RUN chown -R 2000:2000 /home/theia

<%}

else if (image == 'alpine-apache2-hl') { -%>FROM hackinglab/alpine-apache2-hl:3.2

LABEL maintainer=<<%= authorEmail %>>

MAINTAINER <%= authorName %> <<%= authorEmail %>>

ADD root /

RUN apk add --no-cache --update apache2 \
    apache2-utils \
    openssl && \
    mkdir -p /run/apache2 && \
	rm -rf /var/cache/apk/* && \
	chown -R root:root /opt/www

# Expose the ports for apache2 
EXPOSE 80

<%}

else if (image == 'ubuntu-base-hl') { -%>FROM hackinglab/<%= image %>:<%= versionTag %>

LABEL maintainer=<<%= authorEmail %>>
MAINTAINER <%= authorName %> <<%= authorEmail %>>

ADD root /

<%}

else if (image == 'ubuntu-nginx-hl') { -%>FROM hackinglab/<%= image %>:<%= versionTag %>

LABEL maintainer=<<%= authorEmail %>>
MAINTAINER <%= authorName %> <<%= authorEmail %>>

ADD root /

<%}

else if (image == 'ubuntu-nginx-nodejs-hl') { -%>FROM hackinglab/<%= image %>:<%= versionTag %>

LABEL maintainer=<<%= authorEmail %>>
MAINTAINER <%= authorName %> <<%= authorEmail %>>

ADD root /

<%}


else {%>FROM hackinglab/<%= image %>:latest

LABEL maintainer=<<%= authorEmail %>>
MAINTAINER <%= authorName %> <<%= authorEmail %>>

ADD root /

<%}

%>





