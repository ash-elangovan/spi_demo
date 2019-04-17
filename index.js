'use strict';

const Hapi = require('hapi');
var Request = require("request");
let desiredMovie = "HELLBOY";
let done = false;
const accountSid = process.env.accountSid;
const authToken = process.env.accountSid;
const client = require('twilio')(accountSid, authToken);
const init = async () => {

    const server = Hapi.server({
        port: 3002,
        host: 'localhost'
    });
    timer();
    await server.start();
    console.log('Server running on %ss', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();

function timer (){
    setTimeout(async ()=>{
        try {
            getSpiResults();
        }
        catch (ex) {
            console.error(ex);
        }
        if(!done){
            console.log("CHECK")
            timer();
        }
        else{
                console.log("CAN MAKE CALL");
                client.calls
                  .create({
                     url: 'http://demo.twilio.com/docs/voice.xml',
                     to: process.env.to,
                     from: process.env.from
                   })
                  .then(call => console.log("INDSIDE CALL", call.sid));
        }
        
    },5000)
}

const getSpiResults = async function () {
    var options = {
        url: 'https://www.spicinemas.in/chennai/show-times/data',
        headers: {
            "content-type": "application/json",
            'User-Agent': 'request',
            "Accept":   "text/html,application/xhtml+xml,application/xml;q=0.9,/;q=0.8"
        }
      };
    Request.get(options, (error, response, body) => {
    if(error) {
        return console.log("ERROR",error);
    }
    //console.log(body);
    let response = JSON.parse(body.toString());
    checkMovie(response.uniqueMovies)
});

const checkMovie = (movieList) =>{
    movieList.forEach(movie => {
        if(movie.includes(desiredMovie)){
            console.log('FINALLY !!!!')
            done=true;
        }
    });
}
};