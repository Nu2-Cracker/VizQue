docker run -it --rm -v /Users/ru_1218/PycharmProjects/VizQue:/VizQue --name vizque vizque:latest
file=`ls /Users/ru_1218/PycharmProjects/VizQue/tmp_result/ | grep svg`
open /Users/ru_1218/PycharmProjects/VizQue/tmp_result/$file
