FROM archlinux


RUN pacman -Syy --noconfirm
RUN pacman -Syu --noconfirm
RUN pacman -S sudo which gcc nim nimble git pcre openssl\
  nodejs=14.15.4 npm python python-pip graphviz --noconfirm

RUN nimble -y  install jester


RUN mkdir /VizQue && mkdir -p /VizQue/vizque
COPY setup.py /VizQue
RUN python setup.py sdist
RUN pip install -e .


WORKDIR /VizQue/vizque





#RUN python3 setup.py sdist
#RUN pip3 install -e .


