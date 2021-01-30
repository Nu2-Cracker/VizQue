FROM ubuntu

ENV DEBIAN_FRONTEND=noninteractive


RUN apt-get update
RUN apt-get install -y sudo \
    python3 python3-pip python3-venv  \
    graphviz


SHELL ["/bin/bash", "-c"]

WORKDIR /
RUN mkdir /VizQue
COPY __init__.py /VizQue
COPY vizque.py /VizQue
COPY setup.py /VizQue
WORKDIR /VizQue

RUN python3 setup.py sdist
RUN pip3 install -e .

CMD ["/usr/local/bin/vizque"]

# docker build -t vizque:latest .
#docker run -it --rm --name vizque vizque:latest