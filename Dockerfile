FROM ubuntu

RUN apt-get update
RUN apt-get install -y sudo
RUN apt-get install -y python3 python3-pip python3-venv


RUN mkdir -p /download
WORKDIR /download
COPY graphviz_zip/graphviz-2.46.0.tar.gz /download
RUN tar -xvf graphviz-2.46.0.tar.gz
WORKDIR /download/graphviz-2.46.0

RUN ./configure
RUN make && make install

RUN mkdir /VizQue
COPY __init__.py /VizQue
COPY vizque.py /VizQue
COPY setup.py /VizQue
WORKDIR /VizQue
SHELL  ["/bin/bash", "-c"]
RUN python3 setup.py sdist
RUN pip3 install -e .
CMD ["/usr/local/bin/vizque"]