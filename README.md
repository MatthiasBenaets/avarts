<h1 align="center">
  <br>
  <img src="/static/avarts.svg" alt="Avarts" width="500">
</h1>

<h4 align="center">A self-hosted fitness activity tracker.</h4>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#configuration">Configuration</a> •
  <a href="#credentials">Credentials</a> •
  <a href="#FAQ">FAQ</a> •
  <a href="#TODO">To Do</a> •
  <a href="#license">License</a>
</p>

---

<b>Avarts</b> is a self-hosted application designed for athletes seeking to monitor and analyze their fitness activities.
It offers a <b>private alternative</b> to mainstream activity tracking platforms, <b>Avarts</b> will store your <b>activities, routes, and overall statistics</b>.
For now, the platform is mainly focused on running, cycling and swimming.
</td></tr></table>

## Features

## Deployment

1. (npm run build) ; node build ; /pb/pockebase server --http=0.0.0.0:8090

2. docker build . -t avarts ; docker run -p 8080:8080 -p 8090:8090 -v avarts:/app/db/pb_data avarts:latest

3. docker compose up -d

> [!IMPORTANT]
> Update the api keys to your own

## Configuration


## Credentials
admin@avarts.lan - adminadmin

## FAQ

## TODO
- Edit activities
- Remove activities
- Create manual activity
- Speed graph
- Adapt code for parsed fit data fields (speed vs enhanced speed vs zwift vs etc.)
- Merge route if multiple laps in fit file
- Track equipment
- Better time notation
- Fix screenshot when reuploading activity
- Disable registration

## License
