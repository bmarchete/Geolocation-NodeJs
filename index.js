const restify = require('restify');

const knex = require('knex')({
    client: 'mysql',
    connection: 
    {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'db'
    }
});

var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyBlKsSmqCDSGnOTzoJLvTqo2eWV8iBbVC0',
    Promise: Promise
});

const server = restify.createServer({
    name: "localizationapp",
    version: "1.0.0"
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.get("/all", function(req, res, next){
    knex('locations').then((dados) => {
        res.send(dados);
    }, next)

    return next();
});

server.post("/geocode", function(req, res, next){
    const {latitude, longitude} = req.body;
    
    googleMapsClient.reverseGeocode({latlng: [latitude, longitude]}).asPromise().then((response) => {
        const address = response.json.results[0].formatted_address;
        const location_id = response.json.results[0].place_id;
        const image = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=300x300&sensor=false`;

        knex('locations')
        .insert({location_id, address, latitude, longitude})
        .then(() => {    
            res.send({address, image});
        }, next)
    }).catch((err) => {
        res.send(err);
    });
});

server.get(/\/(.*)?.*/, restify.plugins.serveStatic({
    directory: './dist',
    default: 'index.html',
  }));

server.listen(8080, function(){
    console.log("%s %s", server.name, server.url);
});