#!/bin/zsh
#docker build -t vizque:latest .
touch vizque.sh

vizque_dir=`pwd`

echo "docker run -it --rm -v $vizque_dir:/VizQue --name vizque vizque:latest" > vizque.sh
echo "file=\`ls $vizque_dir/tmp_result/ | grep svg\`" >> vizque.sh
echo "open $vizque_dir/tmp_result/\$file"  >> vizque.sh

echo 'alias vizque="sh $vizque_dir/vizque.sh"' >> ~/.zshrc
source ~/.zshrc

