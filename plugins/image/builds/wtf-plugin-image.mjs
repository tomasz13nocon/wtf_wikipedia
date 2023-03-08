/* wtf-plugin-image 0.3.1  MIT */
import require$$0 from 'jshashes';
import require$$0$1 from 'https';

const Hashes = require$$0;
const server$1 = 'https://upload.wikimedia.org/wikipedia/commons/';

const encodeTitle = function (file) {
  let title = file.replace(/^(image|file?):/i, ''); //titlecase it

  title = title.charAt(0).toUpperCase() + title.substring(1); //spaces to underscores

  title = title.trim().replace(/ /g, '_');
  return title;
}; //the wikimedia image url is a little silly:
//https://commons.wikimedia.org/wiki/Commons:FAQ#What_are_the_strangely_named_components_in_file_paths.3F


const commonsURL$1 = function () {
  let file = this.data.file;
  let title = encodeTitle(file);
  let hash = new Hashes.MD5().hex(title);
  let path = hash.substr(0, 1) + '/' + hash.substr(0, 2) + '/';
  title = encodeURIComponent(title);
  path += title;
  return server$1 + path;
};

var urlHash = commonsURL$1;

const https = require$$0$1; // use the native nodejs request function

const request = function (url) {
  let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new Promise((resolve, reject) => {
    https.get(url, opts, resp => {
      let status = String(resp.statusCode) || '';
      let bool = /^[23]/.test(status);
      resolve(bool);
    }).on('error', err => {
      reject(err);
    });
  });
};

var server = request;

const http = server; // test if the image url exists or not

const imgExists$1 = function (callback) {
  return http(this.url(), {
    method: 'HEAD'
  }).then(function (bool) {
    //support callback non-promise form
    if (callback) {
      callback(null, bool);
    }

    return bool;
  }).catch(e => {
    console.error(e);

    if (callback) {
      callback(e, null);
    }
  });
};

var imgExists_1 = imgExists$1;

const mainImage$1 = function () {
  let box = this.infobox();

  if (box) {
    let img = box.image();

    if (img) {
      return img;
    }
  }

  let s = this.section();
  let imgs = s.images();

  if (imgs.length === 1) {
    return imgs[0];
  }

  return null;
};

var mainImage_1 = mainImage$1;

const commonsURL = urlHash;
const imgExists = imgExists_1;
const mainImage = mainImage_1;

const addMethod = function (models) {
  models.Doc.prototype.mainImage = mainImage; // add a new method to Image class

  models.Image.prototype.commonsURL = commonsURL;
  models.Image.prototype.exists = imgExists;
};

var src = addMethod;

export { src as default };
