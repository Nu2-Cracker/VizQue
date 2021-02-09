FROM ubuntu:20.04




RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN DEBIAN_FRONTEND=noninteractive apt-get update &&\
  apt-get upgrade -y && \
  apt-get install -y tzdata &&\
  apt-get install -y git curl vim &&\
  rm -rf /var/lib/apt/lists/*

ENV NVM_DIR /usr/local/.nvm
ENV NODE_VERSION 10.23.2

# Install nvm
RUN git clone https://github.com/creationix/nvm.git $NVM_DIR && \
  cd $NVM_DIR && \
  git checkout `git describe --abbrev=0 --tags`

# Install default version of Node.js
RUN source $NVM_DIR/nvm.sh && \
  nvm install $NODE_VERSION && \
  nvm alias default $NODE_VERSION && \
  nvm use default && npm i -g  npm@5.10.0



# Add nvm.sh to .bashrc for startup...
RUN echo "source ${NVM_DIR}/nvm.sh" > $HOME/.bashrc && \
  source $HOME/.bashrc

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules


# Set the path.
ENV PATH  $NVM_DIR/v$NODE_VERSION/bin:$PATH



RUN apt update && apt upgrade -y
RUN apt install -y python3.8 python3-setuptools python3-pip





RUN mkdir /VizQue && \
  mkdir -p /VizQue/vizque &&\
  mkdir -p /VizQue/react-app
COPY setup.py /VizQue

WORKDIR /VizQue
SHELL [ "bash", "-c" ]
RUN python3 setup.py sdist
RUN pip3 install -e .


WORKDIR /VizQue/react-app


EXPOSE 5555



