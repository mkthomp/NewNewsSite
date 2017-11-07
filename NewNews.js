var express = require('express');
var pug = require('pug');
var url = require('url');
var bodyParser = require('body-parser');
var xml2js = require('xml2js');
var xmlParser = new xml2js.Parser({explicitArray: false});
var fs = require('fs');
var json = require('./newusers.json');
var newsFile = __dirname + "/news.xml";
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', './views');
app.set('view enging', 'pug');
app.engine('pug', pug.__express);

app.listen(8080);

app.get('/NewNews/news', function (req, res) {
    fs.readFile(newsFile, "utf-8", function (error, text) {
        if (error) {
            throw error;
        }else {
            xmlParser.parseString(text, function (err, result) {
                console.log(result);
                var articles = new Array();
                var pubArticles = new Array();
                for (var i = 0; i<result.NEWS.ARTICLE.length; i++) {
                    if (result.NEWS.ARTICLE[i].PUBLIC === 'T') {
                        pubArticles.push(result.NEWS.ARTICLE[i].TITLE);
                    }else {
                        articles.push(result.NEWS.ARTICLE[i].TITLE)
                    }
                }
                res.render('view.pug', {title: 'New News Inc.',
                    message: 'Welcome to New News Inc.! You curently have Guest privileges.',
                    articles: articles, pubArticles: pubArticles});
            })
        }
    });
});
app.get('/NewNews/login', function (req, res) {
    res.render('login.pug', {title: 'Login', message: 'Please Login as Reporter or Subsciber.'});
});
app.post('/NewNews/news', function (req, res) {
    var name = req.body.name;
    var role = req.body.role;

    fs.readFile(newsFile, "utf-8", function (error, text) {
        if (error) {
            throw error;
        }else {
            xmlParser.parseString(text, function (err, result) {
                console.log(result);
                var articles = new Array();
                var pubArticles = new Array();
                for (var i = 0; i < result.NEWS.ARTICLE.length; i++) {
                    if (result.NEWS.ARTICLE[i].PUBLIC === 'T' || result.NEWS.ARTICLE[i].AUTHOR === name ) {
                        pubArticles.push(result.NEWS.ARTICLE[i].TITLE);
                    } else {
                        articles.push(result.NEWS.ARTICLE[i].TITLE)
                    }
                }
                if (role === 'Reporter') {
                    res.render('loggedInView.pug', {
                        title: 'New News Inc.', message: 'Welcome ' + name + '! ' + 'You have Reporter privileges',
                        articles: articles, pubArticles: pubArticles
                    })
                } else {
                    for (var i=0; i<articles.length; i++) {
                        pubArticles.push(articles[i]);
                    }
                    articles=null
                    res.render('loggedInView.pug', {
                        title: 'New News Inc.',
                        message: 'Welcome ' + name + '! ' + 'You have Subscriber privileges',
                        pubArticles: pubArticles
                    })
                }
            })
        }
    })
});
app.get('/NewNews/add', function (req, res) {

});
//not working
app.get('/NewNews/readNews', function (req, res) {
    //Not sure how to pull the name of the article
    var name = req.body.name;
    console.log(name);
    var newsFile = __dirname + "/news.xml";
    fs.readFile(newsFile, "utf-8", function (error, text) {
        if (error) {
            throw error;
        }else {
            xmlParser.parseString(text, function (err, result) {
                var title;
                var author;
                var article;
                for (var i=0; i<result.NEWS.ARTICLE.lenght; i++) {
                    if (result.NEWS.ARTICLE[i].TITLE === 'name') {
                        title=result.result.NEWS.ARTICLE[i].TITLE;
                        author=result.NEWS.ARTICLE[i].AUTHOR;
                        article=result.NEWS.ARTICLE[i].CONTENT;
                    }
                res.render('articleView.pug', {title: title, author: author, article: article});
                }
            })
        }
    })
});