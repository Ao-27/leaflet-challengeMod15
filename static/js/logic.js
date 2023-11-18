
// Define the url for the GeoJSON earthquake data for all_day
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// Create the map
let myMap = L.map("map", {
    center: [38.5, -97],
    zoom: 6
})

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Retrieve and add the earthquake data to the map
d3.json(url).then(function(data) {
    function styleMap(info) {
        return {
            fillColor: colourMap(info.geometry.coordinates[2]),
            radius: radiusMap(info.properties.mag),
            opacity: 0.2,
            fillOpacity: 0.8,
            color: "black",
            stroke: true,
            weight: 0.5
        };
    };
// Establish colors for depth
    function colourMap(mag) {
        if (mag > 90) {
            return "red"
        }
        else if (mag > 70) {
            return "orangered"
        }
        else if (mag > 50) {
            return "orange"
        }
        else if (mag > 30) {
            return "yellow"
        }
        else if (mag>10) {
            return "green"
        }
        else {
            return "lime"
        }
    };

 // Establish magnitude 
 function mapRadius(mag) {
     if (mag === 0) {
         return 1;
     }

     return mag * 4;
 }

 // Add earthquake data to the map
 L.geoJson(data, {

     pointToLayer: function (feature, latlng) {
         return L.circleMarker(latlng);
     },

     style: mapStyle,

     // Activate pop-up data 
     onEachFeature: function (feature, layer) {
         layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);

     }
 }).addTo(myMap);

// Add the legend with colors
var legend = L.control({position: "bottomright"});
legend.onAdd = function() {
var div = L.DomUtil.create("div", "info legend"),
depth = [-10, 10, 30, 50, 70, 90];

for (var i = 0; i < depth.length; i++) {
 div.innerHTML +=
 '<i style="background:' + mapColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
}
return div;
};
legend.addTo(myMap)
});