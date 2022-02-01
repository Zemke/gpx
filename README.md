Split GPX track at pre-defined geopoints, set start and direction of track.

## Usage

```console
node index.js hohe-mark-route.gpx targets.txt "Hohe Mark" --reverse --start 51.827551,7.282159
```

`hohe-mark-route.gpx` is a single GPX track that you want to split. \
Supply `--reverse` if you want the direction to be reserved.a \
Supply `--start` along with a starting geo coordinate to let the route start there
(useful for round trips).

The `targets.txt` is an ordered line-separated list of comma-separated latitude and longitude
coordinates of your destinations.

```
51.89193,6.97189
51.823689,6.421331
51.827192,7.063063
```

You may set environment variable `ELE_0=1` to default elevations to 0. At the moment elevation
is derived from the base GPX file if it provides it. If it's not and `ELE_0` is not `1` then
there's no elevation.

## Use Case

You want to go on a multi-day bike trip and for every day you want to know your route from
the place where you stayed for the night back to the route and then to your next place.

The original route is followed until a point is reached where you're closest to your next
destination. From there a straight line is drawn to that place. \
You'll therefore get a GPX track for every day of your trip.

Here's an example of the whole route and the individual days split from it.

![before](https://user-images.githubusercontent.com/3391981/151962666-a74332b4-e9a4-494b-8ef7-8281ec1cf486.png)
<img width="1029" alt="day 1" src="https://user-images.githubusercontent.com/3391981/151962640-af211e3b-afb6-4e48-8e53-df8c102dcd1e.png">
<img width="1029" alt="day 2" src="https://user-images.githubusercontent.com/3391981/151962650-e449e305-ffa1-4ba2-b834-dc4ee50ac356.png">
<img width="1029" alt="day 3" src="https://user-images.githubusercontent.com/3391981/151962660-1fdaccc8-c09d-4cf2-9737-43f4536675dc.png">
<img width="1029" alt="day 4" src="https://user-images.githubusercontent.com/3391981/151962664-198b4c3c-709d-4da5-a355-ee24c30ca876.png">

## TODO

- web interface with visualizations

🚲

