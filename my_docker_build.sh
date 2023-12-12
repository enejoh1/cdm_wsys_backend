#! /bin/bash

docker run -it -v $PWD:/app -v $PWD/../HBLWMS_WEB:/app/vue_wsys -w /app -p 80:80 -p 7080:7080 --network br0 wsys:build1.2 /bin/bash

