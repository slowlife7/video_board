var express = require('express');
var router = express.Router();
var Video = require('../model/video.js');
var moment = require('moment');
var fs = require('fs');

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

router.get('/:title', function(req, res, next) {
 let page_no = 1, count_per_page = 5;
  let last_sequence = 0;
  let search_count = 0;

  console.log('bbbbbbbbbb');

  const query = req.query;
  if ( Object.keys(query).length ) {
    page_no = query.page_no;
    count_per_page = query.count_per_page;
    console.log('page:'+page_no);
    console.log('count:'+count_per_page);
  } 

  Video.countDocuments({"title": { $regex: '.*'+req.params.title+'.*'}})
      .then( (count) => {
        search_count = count;
        console.log('search:'+search_count);
        last_sequence = count - (page_no-1) * count_per_page;
        return Video.find( {"title": { $regex: '.*'+req.params.title+'.*'}}, {_id:0, __v:0}).sort({created:-1}).skip( (page_no -1 ) * count_per_page ).limit(14);
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
        res.json({"search_count":search_count, "items": items});
      });
});

router.get('/*.mp4', function(req, res, next) {
  const file = '/home/bear/video'+decodeURI(req.path);
  console.log(file);
  if( !fs.existsSync( file ) ) {
    //not found file...
    return;
  }

  fs.stat(file, ( err, stat ) => {
    if( err ) {
      //not found file
      if( err.code === 'ENOENT' ) {
        return;
      }
    }

    let start = 0,
        end = stat.size,
        total = 0,
        contentLength = stat.size;
    let contentRange = false;
    const range = req.header('Range');
    if( range ) {
      const position = range.replace(/bytes=/, "").split("-");
      start = parseInt(position[0], 10);
      total = stat.size;
      end = position[1]? parseInt(position[1], 10) : total - 1;
      contentRange = true;
      contentLength = ( end - start ) + 1;
    } 

    if( start <= end ) {
      if( contentRange ) {
	console.log('206');
        res.status(206).set({
          "Accept-Ranges":"bytes",
          "Content-Length":contentLength,
          "Content-Type":"video/mp4",
          "Content-Range":"bytes "+start+"-"+end+"/"+total
        });
      } else {
        res.status(200).set({
          "Accept-Ranges":"bytes",
          "Content-Length":contentLength,
          "Content-Type":"video/mp4"
        });
      }
      let st = fs.createReadStream(file, { start : start, end:end})
		.on('end', function() {
			console.log('Stream done');
			res.end();
		})
		.on('error', function(err) {
			console.error(err);
			res.end();
		
		})
		.pipe(res, {end:true});
    } else {
      res.status(403).end();
    }
  });
});

module.exports = router;
