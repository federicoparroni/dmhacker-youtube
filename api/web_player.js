const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');
const ytwrappers = require('./youtube_wrappers.js')

const YOUTUBE_URL_PREFIX = "https://www.youtube.com/watch?v=";

async function fetch_target_id(req, res) {
  let id = req.params.id;
  let url = YOUTUBE_URL_PREFIX + id;

  try {
    const info = await ytdl.getInfo(url);
    console.log('Video info collected:');
    console.log(info);

    let output_file = path.join(__dirname, '..', 'public', 'site', id + '.mp4');
    let writer = fs.createWriteStream(output_file);
    writer.on('finish', function() {
      res.status(200).json({
        state: 'success',
        link: '/site/' + id + '.mp4',
        info: {
          id: id,
          title: info.videoDetails.title
        }
      });
    });
    console.log(`Writing video on: ${output_file}`)
    ytdl(url).pipe(writer);
  } catch (err) {
    res.status(500).json({
      state: 'error',
      message: err.message
    });
  }
}

module.exports = function(app) {
  app.get('/target/:id', fetch_target_id);

  app.get('/search/:query', async function(req, res) {
    let query = req.params.query;
    let result = await ytwrappers.search_one(query, 'en');
    if (result == null) {
      res.status(200).send({
        state: 'error',
        message: 'No results found'
      });
    } else {
      console.log('Video found:')
      console.log(result);
      req.params.id = result.id;
      fetch_target_id(req, res);
    }
  });
}
