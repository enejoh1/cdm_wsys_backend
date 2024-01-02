if [ $# -eq 0 ]
  then
    echo "No docker tag version supplied"
fi
sudo docker build --platform=linux/amd64 --no-cache -t wsys-backend .
sudo docker tag wsys-backend:latest 222.252.16.150:5555/wsys-backend:$1
sudo docker push 222.252.16.150:5555/wsys-backend:$1