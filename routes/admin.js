var express = require('express');
var router = express.Router();
var adminHelpers = require('../Helpers/adminHelpers');
const mailer = require('../Helpers/mailer');
const fs = require('fs');
const { Stream } = require('stream');


/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Express' });
});


module.exports = router;
