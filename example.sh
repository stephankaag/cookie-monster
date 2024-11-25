set -e

docker build -t cookie-monster .
docker run -e URL=https://www.imdb.com/calendar -p 3000:3000 cookie-monster
CONTAINER_ID=$(docker ps -alq)
docker cp $CONTAINER_ID:/tmp/result.json .