#!/bin/zsh

docker-compose up --build -d
# nim c -o:output_vizque vizque.nim
docker-compose exec vizque_apps bash
# npm install; nohup npm run start &
# exit
vizque_dir=`pwd`

#実行シェル
echo "cd $vizque_dir" > vizque.sh
echo "docker-compose exec vizque_apps ./output_vizque" >> vizque.sh
echo "open http://0.0.0.0:5555" >> vizque.sh


echo "alias vizque=\"sh $vizque_dir/vizque.sh\"" >> ~/.zshrc
echo "alias vizque_uninstall=\"source $vizque_dir/uninstall.sh\"" >> ~/.zshrc
source ~/.zshrc

#uninstallシェル

echo "echo -n \"Can I delete it? [y/N]:\"" > uninstall.sh
echo "read ans" >> uninstall.sh

echo "if [ \"\$ans\" = \"y\" ]; then" >> uninstall.sh
echo "  docker stop vizque" >> uninstall.sh
echo "  docker rm -f vizque" >> uninstall.sh
echo "  docker rmi -f vizque_img" >> uninstall.sh
echo "  cd $vizque_dir/.." >> uninstall.sh
echo "  rm -rf VizQue" >> uninstall.sh
echo "  sed -i -e '/alias vizque/d' ~/.zshrc" >> uninstall.sh
echo "  source ~/.zshrc" >> uninstall.sh
echo "fi" >> uninstall.sh

