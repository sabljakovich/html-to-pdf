
## Docker

Build image from source

```
docker build -t html-to-pdf -f Dockerfile .
```

Run container with the previously created image

```
docker run --rm -p 5555:1234 html-to-pdf
```

* `--rf` - remove the container once stopped
* `-p 5555:1234` - map port `5555` on host to port `1234` in docker
