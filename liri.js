require("dotenv").config();
var keys = require("./keys");
var axios = require("axios");
var fs = require("fs");
var request = require("request")
var Spotify = require("node-spotify-api")
var moment = require("moment")

// Takes an artist and searches the Bands in Town 
// Artist API for an artist and render information

// This will take a movie, search IMDb and return information
var concertThis = function(artist){
    if (!artist) {
        artist = "Celine+Dion"
    }
    var region = ""

    
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

    // This line is just to help us debug against the actual URL.
    // console.log(queryUrl);

    axios.get(queryUrl).then(
        function(response) {
            outputData(artist + " concert information:")

            for (i=0; i < response.data.length; i++) {
                
                region = response.data[i].venue.region
                 //handle Canadian venues
                if (region === "") {
                    region = response.data[i].venue.country
                }

                // Need to return Name of venue, Venue location, Date of event (MM/DD/YYYY)
                outputData("-------------------------------------")
                outputData("Venue: " + response.data[i].venue.name)
                outputData("Location: " + response.data[i].venue.city + ", " + region);
                outputData("Date: " + moment(response.data[i].datetime).format('MM/DD/YYYY'))
            }
        })
        .catch(function(error) {
            if (error.response) {
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------headers---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}


// This will take a song, search spotify and return information
var spotifyThisSong = function(song){
    // Default should be "The Sign" by Ace of Base
    if (!song){
        song = "The Sign Ace of Base"
    }

    var spotify = new Spotify(keys.spotify);

    spotify.search({type: "track", query: song, limit: 1}, function (err, data){
        if (err) {
            return console.log(err)
        }

        // Need to return Artist(s), Song Name, Album, Preview link of song from Spotify
        var songInfo = data.tracks.items[0]
        outputData("----------------------")
        outputData(songInfo.artists[0].name)
        outputData(songInfo.name)
        outputData(songInfo.preview_url)
        outputData(songInfo.album.name)
        
    })
}


// This will take a movie, search IMDb and return information
var movieThis = function(movieName){
    if (!movieName) {
        movieName = "Mr.+Nobody"
    }

    // Then run a request with axios to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    // This line is just to help us debug against the actual URL.
    // console.log(queryUrl);

    axios.get(queryUrl).then(
        function(response) {
            outputData("-----------------------------");
            outputData("Title: " + response.data.Title);
            outputData("Release Year: " + response.data.Year);
            outputData("IMDB Rating: " + response.data.imdbRating)
            outputData("Rotten Tomatoes Rating: " + response.data.Ratings)
            outputData("Country: " + response.data.Country)
            outputData("Language: " + response.data.Language)
            outputData("Plot: " + response.data.Plot)
            outputData("Actors: " + response.data.Actors)
        })
        .catch(function(error) {
            if (error.response) {
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------headers---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}

// Using the `fs` Node package, LIRI will take the text inside of random.txt
// and then use it to call one of LIRI's commands.
var doWhatItSays = function(){

    // read from file
    fs.readFile("random.txt", "utf8", function (err, data) {
        if(err){
            return console.log(err)
        }
        
        var dataArr = data.split(",")

        // call appropriate function and pass arguement
        runAction(dataArr[0], dataArr[1])
    });
}


// This function will handle outputting to the console and writing to log file
var outputData = function(data) {
    console.log(data)

    fs.appendFile("log.txt", "\r\n" + data, function (err){
        if(err){
            return console.log(err)
        } 
    })
}

var runAction = function(func, parm) {
    switch (func) {
        case "concert-this":
            concertThis(parm)
            break
        case "spotify-this-song":
            spotifyThisSong(parm)
            break
        case "movie-this":
            movieThis(parm)
            break
        case "do-what-it-says":
            doWhatItSays()
            break
        default:
            console.log("That is not a command that I recognize, please try again.") 
    }
}

runAction(process.argv[2], process.argv.slice(3).join("+"))

