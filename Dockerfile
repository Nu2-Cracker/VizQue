FROM archlinux


RUN pacman -Syy --noconfirm
RUN pacman -Syu --noconfirm
RUN pacman -S sudo which gcc nim nimble git pcre openssl\
  nodejs=14.15.4 npm python python-pip graphviz --noconfirm

RUN nimble -y  install jester

RUN git clone https://github.com/Nu2-Cracker/VizQue.git
WORKDIR /VizQue/vizque
RUN mkdir tmp_result
RUN mkdir volume_space
RUN python setup.py sdist
RUN pip install -e .




#RUN python3 setup.py sdist
#RUN pip3 install -e .


