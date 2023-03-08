/* wtf-plugin-category 0.3.1  MIT */
import require$$0 from 'slow';

const defaults = {
  lang: 'en',
  wiki: 'wikipedia',
  domain: null,
  path: 'w/api.php' //some 3rd party sites use a weird path

};

const isObject = function (obj) {
  return obj && Object.prototype.toString.call(obj) === '[object Object]';
};

const fetchRandom = function (lang, options, http) {
  options = options || {};
  options = Object.assign({}, defaults, options); //support lang 2nd param

  if (typeof lang === 'string') {
    options.lang = lang;
  } else if (isObject(lang)) {
    options = Object.assign(options, lang);
  }

  let url = "https://".concat(options.lang, ".wikipedia.org/").concat(options.path, "?");

  if (options.domain) {
    url = "https://".concat(options.domain, "/").concat(options.path, "?");
  }

  url += "format=json&action=query&generator=random&grnnamespace=14&prop=revisions&grnlimit=1&origin=*";
  return http(url).then(res => {
    try {
      let o = res.query.pages;
      let key = Object.keys(o)[0];
      return o[key].title;
    } catch (e) {
      throw e;
    }
  }).catch(e => {
    console.error(e);
    return null;
  });
};

var random$1 = fetchRandom;

const slow = require$$0;
const random = random$1;

const chunkBy = function (arr) {
  let chunkSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
  let groups = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    groups.push(arr.slice(i, i + chunkSize));
  }

  return groups;
};

const fetchCat = function (wtf, cat, lang, opts) {
  if (!cat) {
    return {
      docs: [],
      categories: []
    };
  }

  return wtf.category(cat, lang).then(resp => {
    let pages = resp.pages.map(o => o.title);
    let groups = chunkBy(pages);

    const doit = function (group) {
      return wtf.fetch(group, opts); //returns a promise
    }; //only allow three requests at a time


    return slow.three(groups, doit).then(responses => {
      //flatten the results
      let docs = [].concat.apply([], responses);
      return {
        docs: docs,
        categories: resp.categories
      };
    });
  });
};

const plugin = function (models) {
  models.wtf.parseCategory = function (cat, lang, opts) {
    return fetchCat(models.wtf, cat, lang, opts);
  };

  models.wtf.randomCategory = function (lang, opts) {
    return random(lang, opts, models.http);
  };

  models.wtf.fetchCategory = models.wtf.parseCategory;
};

var src = plugin;

export { src as default };
