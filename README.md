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
pocketbase change size of files if needed (profile now max 5MB)
can be set with BODY_SIZE_LIMIT
a 100k ride is about 2 to 2.5MB


get a graphhopper and location api on your own to prevent limits:
routing: https://www.graphhopper.com/
location: https://geocode.maps.co/

## Credentials
admin@avarts.lan - adminadmin

## FAQ

## TODO
- Create manual activity
- Edit activities
- Better time notation
- Adapt code for parsed fit data fields (speed vs enhanced speed vs zwift vs etc.)
- Pocketbase edit user permission rules (who can edit and delete)
- Disable registration
- Estimated time recalculate distance / average speed last 10 activities (of same sport type)
- Track equipment
- Compress/simplify generated GPX files
- Analysis and Laps per activity
- Custom charts for gpx using d3

- DONE Merge route if multiple laps in fit file
- DONE Speed graph
- DONE Fix screenshot when reuploading activity
- DONE Remove activities

## License
