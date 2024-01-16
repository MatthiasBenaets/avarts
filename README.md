<h1 align="center">
  <br>
  <img src="/static/avarts.svg" alt="Avarts" width="500">
</h1>

<h4 align="center">A self-hosted fitness activity tracker.</h4>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#configuration">Configuration</a> •
  <a href="#images">Images</a> •
  <a href="#FAQ">FAQ</a> •
  <a href="#TODO">To Do</a> •
</p>

---

<b>Avarts</b> is a self-hosted application designed for athletes seeking to monitor and analyze their fitness activities.\
It offers a <b>private alternative</b> to mainstream activity tracking platforms, and will store your <b>activities, routes, and overall statistics</b>.\
For now, the platform is mainly focused on running, cycling and swimming.
</td></tr></table>

## Features
- Activity Logger for cycling, running and swimming
- Activity Analyser
- Statistics Tracker
- Route Builder
- Route Database

## Deployment

There are multiple ways to deploy Avarts.\
Here are a couple options you can choose from to get started.\
More configuration options are available below.

First clone the repository: `git clone https://github.com/matthiasbenaets/avarts && cd avarts`

1. node: Build the website and start node `npm run build && node build`.\
   Then start Pocketbase `./pb/pocketbase serve --http=0.0.0.0:8090`.
2. docker: Just run `docker build . -t avarts ; docker run -p 8080:8080 -p 8090:8090 -v avarts:/app/db/pb_data avarts:latest`.
3. docker-compose: Just run `docker-compose up -d`.
4. npm: Mainly for development start the page `npm run dev`.\
   Then start Pocketbase `./pb/pocketbase serve --http=0.0.0.0:8090`.

> [!TIP]
> It's recommended to go through the configuration information provided below.

## Configuration

### Variables
Avarts is mostly configured with environmental variables.

Depending on how you have deployed it, you can pass along some environmental variables.\
As an example, let's use `PUBLIC_REGISTRATION` in:

- npm: add `PUBLIC_REGISTRATION=false` to the `.env` file in the root of the repository.
- node: `PUBLIC_REGISTRATION=false node build`.
- docker: `docker run -e PUBLIC_REGISTRATION=false -p 8080:8080 -p 8090:8090 -v avarts_data:/app/db/pb_data avarts:latest`.
- docker-compose: add `PUBLIC_REGISTRATION=false` in the `environment` section.

### Registration
Registrations are enabled by default.\
If you want to disable the option to register, set environmental variable `PUBLIC_REGISTRATION=false`.

### Pocketbase
Pocketbase is the database of choice for Avarts.\
Mainly for ease of use, configuration options and for how easy it is to transfer and back-up data.

A Pocketbase binary is provided in `/db` and can be started with `pocketbase serve`.\
At the moment, Avarts is hardcoded to connect to localhost:8090, so it's recommended to keep the default settings for Pocketbase.\
This might change in the future.

Docker and docker-compose will automatically start Pocketbase.
Don't forget to expose port 8090 and create a persistent volume when using Docker (see example under [variables](#variables)).\
Otherwise your activities and routes will not be saved on restart.

By default, Pocketbase sets a max file size of 5MB.\
If this is not enough, variable `BODY_SIZE_LIMIT` can be set. This has to be a value in bytes.\
Since 5MB is often not enough for GPX or FIT files, these limit are raised to 20MB.\
If this is still not enough for your use case, it can manually be changed on Pocketbase.

The Pocketbase dashboard can be accessed on `http://localhost:8090/_/`.\
Here you can also tweak the database if you want to.\
An admin account is available. Log in using the credentials below.\
It's recommended you change these as soon as possible if you want to make everything publicly available.
```
login:      admin@avarts.lan
password:   adminadmin
```

Since Avarts does not require you to register with an email address, it can be tricky to reset passwords if one has forgot theirs.
It's recommended to just reset this via the Pocketbase interface in the `users` collection.
If you also no longer have access to your Pocketbase admin login, use `./pocketbase admin` with `create` or `update`.

### Routing

**Default:**\
For planning your next adventure, Avarts provides you with a route builder.\
By default, it uses the demo server of Open Source Routing Machine (OSRM).\
This is a valid option, but might not be recommended for some.
> [!NOTE]
> The OSRM demo server will only route with type 'car', which is not ideal for running and cycling.
> If this is an issue for you, take a look at some other options below.

If a `PUBLIC_OSRM_URL`, `PUBLIC_GRAPHHOPPER_URL` or `PUBLIC_GRAPHHOPPER_API` environmental variable is set, Avarts will use the demo routing machines instead.

**Self-hosted OSRM Server**:\
It is possible to host your own OSRM server.
This will work pretty much the same as the default demo server, however, you now have the option to pick cycling or running as a navigation type.
The only downside at the moment is that you will be limited to one routing type. This might change in the future.

Before starting your own OSRM server, a few prerequisites:

1. Go to https://download.geofabrik.de/ and download the region you want for routing.
    - Alternatively use the command line
2. Place the file(s) inside the cloned repository in the `osrm` directory
```bash
# (via cmd line) inside the root of the cloned repository
cd osrm
wget http://download.geofabrik.de/europe/belgium-latest.osm.pbf
```
3. Afterwards, process the file. Either pick `car.lua`, `bicycle.lua` or `foot.lua` for your routing engine.

> [!NOTE]
> To extract and process the file(s), about 5x the initial `.osm.pbf` file size is needed in RAM.\
> For example, a 1GB file will require 5GB of RAM.
> Keep this in mind when using large region files. It will crash out if not enough RAM is available.

```bash
docker run -t -v "${PWD}:/data" osrm/osrm-backend osrm-extract -p /opt/bicycle.lua /data/belgium-latest.osm.pbf
docker run -t -v "${PWD}:/data" osrm/osrm-backend osrm-partition /data/belgium-latest.osrm
docker run -t -v "${PWD}:/data" osrm/osrm-backend osrm-customize /data/belgium-latest.osrm
```
You should now have all the required `*.osrm` files to host your own routing machine.
If you host Avarts via npm, node, or docker run `docker run -t -i -p 5000:5000 -v "${PWD}:/data" osrm/osrm-backend osrm-routed --algorithm mld /data/belgium-latest.osrm` in the `osrm` directory.\
For docker-compose, uncomment the `osrm/osrm-backend` section.

Whenever the routing machine is deploy, don't forget to set the `PUBLIC_OSRM_URL` environment.\
By default use `PUBLIC_OSRM_URL=http://0.0.0.0:5000/route/v1`.

The URLs mentioned can be adapted depending on your network and hosting needs.

If you want multiple counties for routing, but are not interested in using one of the giant region due to hardware restrictions, you can use a package like `osmium` to merge files:
```bash
osmium merge belgium-latest.osm.pbf netherlands-latest.osm.pbf luxembourg-latest.osm.pbf -o benelux.osm.pbf
```

**GraphHopper:**

GraphHopper is another open source alternative.\
You can host a server yourself, or use their paid service.\
Unlike OSRM, it will have routing for cycling and running if you follow the steps below.

You can register on their website at https://www.graphhopper.com/. \
They will provide you with an API key that can be used for routing.\
It can be passed as a variable using `PUBLIC_GRAPHHOPPER_API`.

If you like to keep everything local, you can follow the guide on https://github.com/graphhopper/graphhopper.
Here's a quick setup guide using the example config:

1. Install a JVM (>= Java 17) and get the needed files for hosting.\
Either download them manually from the links below (and via [geofabrik](https://download.geofabrik.de)) or use the CLI.\
If you plan on using `docker-compose.yml`, it's best to place these files inside the `graphhopper` directory of the cloned repository.
```bash
# Optional for docker-compose (inside root of repo)
cd graphhopper
# Get files
wget https://repo1.maven.org/maven2/com/graphhopper/graphhopper-web/8.0/graphhopper-web-8.0.jar https://raw.githubusercontent.com/graphhopper/graphhopper/8.x/config-example.yml http://download.geofabrik.de/europe/belgium-latest.osm.pbf
```
2. Create your own `config.yml` file or adapt the existing `config-example.yml`.\
Here are a couple of tweaks you can make. This will set up a routing server that will work for cycling and running.\
A `config-example.yml` file can be found inside `/graphhopper`.
```yml
profiles:
- name: bike
  vehicle: bike
  custom_model:
      distance_influence: null
      heading_penalty: null
  areas: []
- name: foot
  vehicle: foot
  custom_model:
      distance_influence: null
      heading_penalty: null
  areas: []

profiles_ch:
  - profile: bike
  - profile: foot

# import.osm.ignored_highways: footway,cycleway,path,pedestrian,steps # typically useful for motorized-only routing
import.osm.ignored_highways: motorway,trunk # typically useful for non-motorized routing

server:
  application_connectors:
  - type: http
    port: 8989
    # bind_host: localhost
    bind_host: 0.0.0.0
```

3. Afterwards, run the command below. It will process the file and start the server on port 8989.\
If you are using docker compose, you can also just uncomment the GraphHopper section. (this will automatically run the command inside an OpenJDK Java environment)\
You can still run this command before deploying with docker-compose, to make the initial deployment take less time.
```bash
# command for node and docker
java -D"dw.graphhopper.datareader.file=belgium.osm.pbf" -jar graphhopper*.jar server config-example.yml
```
> [!NOTE]
> Just like OSRM, it will use a lot of RAM to generate the initial cache files.
> Keep this in mind when selecting large region files.
> On first startup, when there is no `graph-cache` directory, it can take a fairly long while before the server if fully deployed.

Don't forget to set the environment variable to the routing machine with `PUBLIC_GRAPHHOPPER_URL`.\
If you followed the steps above, use `http://0.0.0.0:8989/route`.

If you want to use multiple regions, just like with osrm, use a package like `osmium` to merge regions.

### Location
Avarts uses the start coordinates of your activity to determine the location of your activity.\
Unfortunately FIT files do no provide this information in its data, only longitude and latitude.\
To determine the location, a location API is used from https://geocode.maps.co/.\
My Maps is very generous with their API and allows 1000000 requests per month.\
This is plenty, so feel free to use the API key provided in this repo, just don't abuse it.\
Now if you want to use your own API key, you can request one via the link above.\
This key can be passed as a variable `PUBLIC_LOCATION_API`.

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

<b>Q:</b> Why is the elevation map so jumpy/stuttery?\
<b>A:</b> Since not all routing engines provide elevation data (and those that have, are not very accurate), a decision was made to use a general free elevation API.

<b>Q:</b> What routing server do you recommend?\
<b>A:</b> GraphHopper self-hosted > OSRM self-hosted > GraphHopper API > OSRM demo server

## TODO
- Custom charts for gpx using d3 - Analysis and Laps per activity
- Track equipment
- Allow following other users
- Complete rewrite
