# Hackernews clone

Use apizilla to quickly build hackernews clone

# Installation

``
docker-compose up --build
``

# Demo

Demo application can be found [here](https://hackernews.apizilla.io/)

# Code generation

```
docker run -dit -v "$(PWD):/etc/apizilla" apizilla/apizilla:v0.5.11
docker ps
docker exec -it XXXXXXXXX sh
cd /etc/apizilla
apizilla generate
```

# Apizilla

Apizilla is a low code high performance platform. It can be used to develop internal microservices and mvp's in hours

## Features
- Rest endpoints
- RabbitMQ integration
- Database transactions
- Full data privacy
- No vendor lock-in
- Build in admin panel
- Rest client
- Custom logic
- Mysql
- Postgresql
- Designed for low latency high throughput applications