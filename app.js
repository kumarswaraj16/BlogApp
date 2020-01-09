var express = require('express');
var app = express();
var mongoose = require('mongoose');
var methodOverride = require('method-override');
mongoose.connect("mongodb://localhost/restful_blog_app");
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);
// Blog.create({
//     title: "Test Blog",
//     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTxEOVTcvf8wEI1bGPVZrCVADRvWGpFsVzrowss8S1SuQl_xJjK",
//     body: "Disturbing images from the fires' aftermath are beginning to emerge. Warning: This post contains graphic images of dead animals."
// });
app.get('/', function(req, res) {
    res.redirect('/blogs');
});

app.get('/blogs', function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) throw err;
        res.render('posts', { blogs: blogs });
    });
});

app.get('/blogs/new', function(req, res) {
    res.render('new');
});

app.post('/blogs', function(req, res) {
    Blog.create(req.body.blog, function(err, newBlog) {
        if (err) {
            res.render('new');
        } else {
            res.redirect('/blogs');
        }
    });
});

app.get('/blogs/:id', function(req, res) {
    Blog.findById(req.params.id, function(err, findBlog) {
        if (err) res.redirect("/blogs");
        res.render("show", { blog: findBlog });
    });
});

app.get('/blogs/:id/edit', function(req, res) {
    Blog.findById(req.params.id, function(err, findBlog) {
        if (err) res.redirect("/blogs");
        res.render("edit", { blogs: findBlog });
    });
});

app.put('/blogs/:id', function(req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err) {
        if (err) res.redirect("/blogs");
        res.redirect('/blogs/' + req.params.id);
    });
});

app.delete('/blogs/:id', function(req, res) {
    Blog.findByIdAndDelete(req.params.id, function(err) {
        if (err) res.redirect('/blogs');
        res.redirect('/blogs');
    });
});

app.listen(3000, function() {
    console.log("Server is Connected!");
});