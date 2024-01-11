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

## Images

**Home Page**
<br/>
<img src="/static/home.png" alt="Avarts Home Page" width="500">
<br/>
**Route Builder**
<br/>
<img src="/static/builder.png" alt="Avarts Route Builder" width="500">
<br/>
**Activity Viewer**
<br/>
<img src="/static/activity.png" alt="Avarts Activity Viewer" width="500">
<br/>
**Course List**
<br/>
<img src="/static/routes.png" alt="Avarts Course List" width="500">
<br/>
**Route Viewer**
<br/>
<img src="/static/route.png" alt="Avarts Route Viewer" width="500">
<br/>
**Activity Uploader**
<br/>
<img src="/static/upload.png" alt="Avarts Activity Uploader" width="500">
<br/>

## FAQ

## TODO
- Estimated time recalculate distance / average speed last 10 activities (of same sport type)
- Disable registration
- Track equipment
- better input error management
- Compress/simplify generated GPX files
- Look for alternative to graphhopper
- Analysis and Laps per activity
- Custom charts for gpx using d3
- Fix route creator summary close button click-through


- DONE User interaction privileges
- DONE Adapt code for parsed fit data fields (speed vs enhanced speed vs zwift vs etc.)
- DONE Better time notation
- DONE Delete confirmation
- DONE Edit activities
- DONE Create manual activity
- DONE Don't show data if a metric does not exist
- DONE Merge route if multiple laps in fit file
- DONE Speed graph
- DONE Fix screenshot when reuploading activity
- DONE Remove activities

## License
