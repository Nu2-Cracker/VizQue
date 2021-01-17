FROM ubuntu

RUN apt-get update
RUN apt-get install -y sudo
RUN apt-get install -y python3 python3-pip python3-venv
RUN sudo apt update
#sudo apt install graphviz

RUN mkdir /VizQue

RUN mkdir /VizQue/result
COPY __init__.py /VizQue
COPY vizque.py /VizQue
COPY setup.py /VizQue
COPY command.py /VizQue

# CMD ["python3", "/VizQue/command.py"]




