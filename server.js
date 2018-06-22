var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/OWLScrape";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


// Routes

app.get("/", function(req, res){
  db.Article.find({}, function(err, data){
    var reddit = {
      article: data
    };
    console.log(reddit);
    res.render("index", reddit);
  });
});

app.get("/saved-posts", function(req, res){
  db.Article.find({saved:true}, function(err, data){
    var saved = {
      article: data
    };
    console.log(saved);
    res.render("saved-posts", saved);
  });
});

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("https://old.reddit.com/r/Overwatch/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("p.title").each(function(i, element) {
      // Save an empty result object
      var result = {};
      var link = $(this)
        .children("a")
        .attr("href");
      var url = link.indexOf(".com");

      if (url === -1){
        link = "https://reddit.com" + link;
      }

      console.log(link);
      // Add the text and href of every klink, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = link;
      result.type = $(this)
      .children("span.linkflairlabel")
      .text();

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {

  db.Article.find({}, function(err, data){
    if (err){
      console.log(err);
    }
    else {
      res.json(data);
    }
  });
  // TODO: Finish the route so it grabs all of the articles
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/saved-posts/:id", function(req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  db.Article.findOne({_id : req.params.id}) 
  .populate("notes")
  .then(function(dbArticle){
    res.json(dbArticle);
  })
  .catch(function(err){
    res.json(err);
  });
});


//Route for saving an article
app.post("/articles/save/:id", function(req, res){
  db.Article.findOneAndUpdate(
    { _id: req.params.id },
    { saved: true})
  .then(function(dbArticle){
    res.json(dbArticle);
  })
  .catch(function(err){
    res.json(err);
  });
});

//unsave an article
app.post("/articles/remove/:id", function(req, res){
  db.Article.findOneAndUpdate(
    { _id: req.params.id},
    { saved: false,
      $unset : { notes : 1} })
  .then(function(dbArticle){
    res.json(dbArticle);
  })
  .catch(function(err){
    res.json(err);
  });
});

// Route for saving/updating an Article's associated Note
app.post("/saved-posts/:id", function(req, res) {
  console.log(req.body);
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Note.create(req.body)
  .then(function(dbNote){
    return db.Article.findOneAndUpdate(
    { _id: req.params.id }, 
    {notes: dbNote._id},
    {new: true});
  }).then(function(dbArticle){
    res.json(dbArticle);
  })
  .catch(function(err){
    res.json(err);
  });
});


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
