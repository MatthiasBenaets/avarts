<h1 align="center">
  <br>
  <img src="/static/avarts.svg" alt="Avarts" width="500">
</h1>

<h4 align="center">A self-hosted fitness activity tracker.</h4>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#configuration">Configuration</a> •
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
- Activity Logger
- Activity Analyser
- Statistics Tracker
- Route Builder
- Route Database

## Deployment

There are multiple ways to deploy Avarts.\
Here are a couple option you can choose from to get started.\
More configuration is available below.

First clone the repository: `git clone https://github.com/matthiasbenaets/avarts && cd avarts`

1. node: Build the website and run node `npm run build && node build`.\
   Then start Pocketbase `./pb/pocketbase serve --http=0.0.0.0:8090`.
2. docker: Just run `docker build . -t avarts ; docker run -p 8080:8080 -p 8090:8090 -v avarts:/app/db/pb_data avarts:latest`.
3. docker-compose: Just run `docker compose up -d`.
4. npm: Mainly for development start the page `npm run dev`.\
   Then start Pocketbase `./pb/pocketbase serve --http=0.0.0.0:8090`.

> [!TIP]
> It recommended to go through the configuration information provided below.

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
At the moment Avarts is hardcoded to connect to localhost:8090, so it recommended to keep the default settings for Pocketbase.\
This might change in the future.

Docker and docker-compose will automatically start Pocketbase.
Don't forget to expose port 8090 and create a persistent volume when using Docker (see example under [variables](#variables))

By default, Pocketbase sets a max file size of 5MB.\
If this is not enough, variable `BODY_SIZE_LIMIT` can be set. This has to be a value in bytes.\
Since 5MB is often not enough for GPX or FIT files, these limit are raised to 20MB.\
If this is still not enough for your use case, it can manually be changed on Pocketbase.

The Pocketbase dashboard can be accessed on `http://localhost:8090/_/`.\
An admin account is available. Log in using the credentials below.\
It's recommended you change these as soon as possible.
```
login:      admin@avarts.lan
password:   adminadmin
```

### Routing

**Default:**
For planning your next adventure, Avarts provides you with a route builder.\
By default, it uses the demo server of Open Source Routing Machine (OSRM).\
This is a valid option, but might not be recommended for some.
> [!NOTE]
> The OSRM demo server will only route with type 'car', which is not ideal for running and cycling.
> If this is an issue for you, take a look at some other options below.

If a `PUBLIC_OSRM` or `PUBLIC_GRAPHHOPPER_API` environmental variable is provided, Avarts will use these routing machines instead.

**Self-hosted OSRM Server**:\
It is possible to host your own OSRM server.
This will work pretty much the same as the default demo server, however, you now have the option to pick cycling or running as a navigation type.
The only downside at the moment is that you will be limited to one routing type. This might change in the future.

Before starting your own OSRM server, a few prerequisites:

1. Go to https://download.geofabrik.de/ and download the region you want for routing.
    - Alternatively use the command line
2. Place the file(s) inside the cloned repository in a `osrm` directory
```bash
# (via cmd line) inside the root of the cloned repository
mkdir osrm && cd osrm
wget http://download.geofabrik.de/europe/belgium-latest.osm.pbf
```
3. Afterwards, process the file. Either pick `car.lua`, `bicycle.lua` or `foot.lua` for your routing engine.\

>!NOTE
>To extract and process the file(s), about 5x the initial `.osm.pbf` file size is needed in RAM.\
>For example, a 1GB file will require 5GB of RAM.
>Keep this in mind when using large region files. It will crash out if not enough RAM is available.

```bash
docker run -t -v "${PWD}:/data" osrm/osrm-backend osrm-extract -p /opt/bicycle.lua /data/belgium-latest.osm.pbf
docker run -t -v "${PWD}:/data" osrm/osrm-backend osrm-partition /data/belgium-latest.osrm
docker run -t -v "${PWD}:/data" osrm/osrm-backend osrm-customize /data/belgium-latest.osrm
```
You should now have all the required `*.osrm` files to host your own routing machine.
If you host Avarts via npm, node, or docker run `docker run -t -i -p 5000:5000 -v "${PWD}:/data" osrm/osrm-backend osrm-routed --algorithm mld /data/belgium-latest.osrm` in the `osrm` directory.
For docker-compose, uncomment the `osrm/osrm-backend` section.

Whenever the routing machine is deploy, don't forget to set the `PUBLIC_OSRM` environment.\
By default use `PUBLIC_OSRM=http://0.0.0.0:5000/route/v1`.

The URLs mentioned can be adapted depending on your network and hosting needs.

If you want multiple counties for routing, but are not interested in using one of the giant region due to hardware restrictions, you can use a package like `osmium` to merge files:
```bash
osmium merge belgium-latest.osm.pbf netherlands-latest.osm.pbf luxembourg-latest.osm.pbf -o benelux.osm.pbf
```

**Graphhopper:**

Graphhopper is another open source alternative.\
You can register on their website at https://www.graphhopper.com/.\
They will provide you with an API key that can be used for routing.\
It can be passed as a variable using `PUBLIC_GRAPHHOPPER_API`.\

Form the looks of it, it might also be possible to self-host it.
Needs to be looked into.

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

## TODO
- Reset password
- Custom charts for gpx using d3 - Analysis and Laps per activity
- Track equipment
- Allow multiple OSRM routing servers
- Complete rewrite

## License
