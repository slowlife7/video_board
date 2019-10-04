var express = require('express');
var router = express.Router();
var Video = require('../model/video.js');
var moment = require('moment');

router.get('/', function(req, res, next) {

  let page_no = 1, count_per_page = 5;
  const query = req.query;
  if ( Object.keys(query).length ) {
    page_no = query.page_no;
    count_per_page = query.count_per_page;
    console.log('page:'+page_no);
    console.log('count:'+count_per_page);
  } 

  let last_sequence = 0;
  Video.countDocuments()
      .then( (count) => {
        last_sequence = count - (page_no-1) * count_per_page;
        return Video.find( {}, {_id:0, __v:0}).sort({created:-1}).skip( (page_no -1 ) * count_per_page ).limit(14);
      })
      .then( (result) => {
        let items = result.map( ( item ) => {
          item._doc.seq = last_sequence--;
          console.log(item.title);
          item.title = item._doc.title.replace(/._/, '');
          item._doc.created = moment(item.created).format('YYYY-MM-DD hh:mm:ss');
          console.log(item.created);
          return item;
        });
        res.json(items);
      });
});

router.get('/pages', function(req, res, next) {

  Video.countDocuments()
      .then( (count) => {
        res.json({total_pages:count});
      });
});

router.get('/*.mp4', function(req, res, next) {

});

module.exports = router;
