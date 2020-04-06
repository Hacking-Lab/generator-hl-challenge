FROM hackinglab/<%= image %>:3.1.0

MAINTAINER <%= authorName %> <<%= authorEmail %>>
<% if (image == 'alpine-python-flask') { %>
# Install app requirements (keep separate from other files to allow quicker build times)
ADD root/app/requirements.txt /app/requirements.txt
RUN pip3 install -r /app/requirements.txt
<% } %>
ADD root /
