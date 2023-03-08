/* wtf-plugin-api 0.1.1  MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('slow')) :
  typeof define === 'function' && define.amd ? define(['slow'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.wtfImage = factory(global.require$$0));
})(this, (function (require$$0) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);

  var _fns = {};

  _fns.normalize = function () {
    let title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    title = title.replace(/ /g, '_');
    title = title.trim();
    title = encodeURIComponent(title);
    return title;
  };

  _fns.defaults = {
    lang: 'en',
    path: 'w/api.php'
  };

  _fns.toUrlParams = function (obj) {
    let arr = Object.entries(obj).map(_ref => {
      let [key, value] = _ref;
      return "".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(value));
    });
    return arr.join('&');
  };

  _fns.fetchOne = function (url, http, prop) {
    return http(url).then(res => {
      let pages = Object.keys(res.query.pages || {});

      if (pages.length === 0) {
        return {
          pages: [],
          cursor: null
        };
      }

      return {
        pages: res.query.pages[pages[0]][prop] || [],
        cursor: res.continue
      };
    });
  };

  const {
    normalize: normalize$4,
    defaults: defaults$6,
    toUrlParams: toUrlParams$6,
    fetchOne: fetchOne$2
  } = _fns;
  const params$6 = {
    action: 'query',
    rdnamespace: 0,
    prop: 'redirects',
    rdlimit: 500,
    format: 'json',
    origin: '*',
    redirects: true
  };

  const makeUrl$5 = function (title, options, append) {
    let url = "https://".concat(options.lang, ".wikipedia.org/").concat(options.path, "?");

    if (options.domain) {
      url = "https://".concat(options.domain, "/").concat(options.path, "?");
    }

    url += toUrlParams$6(params$6);
    url += "&titles=".concat(normalize$4(title));

    if (append) {
      url += append;
    }

    return url;
  };

  const getRedirects$1 = async function (title, http) {
    let list = [];
    let getMore = true;
    let append = '';

    while (getMore) {
      let url = makeUrl$5(title, defaults$6, append);
      let {
        pages,
        cursor
      } = await fetchOne$2(url, http, 'redirects');
      list = list.concat(pages);

      if (cursor && cursor.rdcontinue) {
        append = '&rdcontinue=' + cursor.lhcontinue;
      } else {
        getMore = false;
      }
    }

    return list;
  };

  var getRedirects_1 = getRedirects$1;

  const {
    normalize: normalize$3,
    defaults: defaults$5,
    toUrlParams: toUrlParams$5,
    fetchOne: fetchOne$1
  } = _fns;
  const params$5 = {
    action: 'query',
    lhnamespace: 0,
    prop: 'linkshere',
    lhshow: '!redirect',
    lhlimit: 500,
    format: 'json',
    origin: '*',
    redirects: true
  };

  const makeUrl$4 = function (title, options, append) {
    let url = "https://".concat(options.lang, ".wikipedia.org/").concat(options.path, "?");

    if (options.domain) {
      url = "https://".concat(options.domain, "/").concat(options.path, "?");
    }

    url += toUrlParams$5(params$5);
    url += "&titles=".concat(normalize$3(title));

    if (append) {
      url += append;
    }

    return url;
  };

  const getIncoming$1 = async function (title, http) {
    let list = [];
    let getMore = true;
    let append = '';

    while (getMore) {
      let url = makeUrl$4(title, defaults$5, append);
      let {
        pages,
        cursor
      } = await fetchOne$1(url, http, 'linkshere');
      list = list.concat(pages);

      if (cursor && cursor.lhcontinue) {
        append = '&lhcontinue=' + cursor.lhcontinue;
      } else {
        getMore = false;
      }
    }

    return list;
  };

  var getIncoming_1 = getIncoming$1;

  const {
    normalize: normalize$2,
    defaults: defaults$4,
    toUrlParams: toUrlParams$4
  } = _fns;
  const params$4 = {
    action: 'query',
    prop: 'pageviews',
    format: 'json',
    origin: '*',
    redirects: true
  };

  const makeUrl$3 = function (title, options, append) {
    let url = "https://".concat(options.lang, ".wikipedia.org/").concat(options.path, "?");

    if (options.domain) {
      url = "https://".concat(options.domain, "/").concat(options.path, "?");
    }

    url += toUrlParams$4(params$4);
    url += "&titles=".concat(normalize$2(title));

    if (append) {
      url += append;
    }

    return url;
  };

  const getPageViews$1 = function (doc, http) {
    let url = makeUrl$3(doc.title(), defaults$4);
    return http(url).then(res => {
      let pages = Object.keys(res.query.pages || {});

      if (pages.length === 0) {
        return [];
      }

      return res.query.pages[pages[0]].pageviews || [];
    });
  };

  var getPageViews_1 = getPageViews$1;

  const {
    normalize: normalize$1,
    defaults: defaults$3,
    toUrlParams: toUrlParams$3,
    fetchOne
  } = _fns;
  const params$3 = {
    action: 'query',
    tinamespace: 0,
    prop: 'transcludedin',
    tilimit: 500,
    format: 'json',
    origin: '*',
    redirects: true
  };

  const makeUrl$2 = function (title, options, append) {
    let url = "https://".concat(options.lang, ".wikipedia.org/").concat(options.path, "?");

    if (options.domain) {
      url = "https://".concat(options.domain, "/").concat(options.path, "?");
    }

    url += toUrlParams$3(params$3);
    url += "&titles=".concat(normalize$1(title)); // support custom cursor params

    if (append) {
      url += append;
    }

    return url;
  }; // fetch all the pages that use a specific template


  const getTransclusions$1 = async function (template, _options, http) {
    let list = [];
    let getMore = true;
    let append = '';

    while (getMore) {
      let url = makeUrl$2(template, defaults$3, append);
      let {
        pages,
        cursor
      } = await fetchOne(url, http, 'transcludedin');
      list = list.concat(pages);

      if (cursor && cursor.ticontinue) {
        append = '&ticontinue=' + cursor.ticontinue;
      } else {
        getMore = false;
      }
    }

    return list;
  };

  var getTransclusions_1 = getTransclusions$1;

  const {
    normalize,
    defaults: defaults$2,
    toUrlParams: toUrlParams$2
  } = _fns;
  const params$2 = {
    action: 'query',
    list: 'categorymembers',
    cmlimit: 500,
    cmtype: 'page|subcat',
    cmnamespace: 0,
    format: 'json',
    origin: '*',
    redirects: true
  };

  const fetchIt$1 = function (url, http, prop) {
    return http(url).then(res => {
      let pages = Object.keys(res.query[prop] || {});

      if (pages.length === 0) {
        return {
          pages: [],
          cursor: null
        };
      }

      let arr = pages.map(k => res.query[prop][k]);
      return {
        pages: arr,
        cursor: res.continue
      };
    });
  };

  const makeUrl$1 = function (title, options, append) {
    let url = "https://".concat(options.lang, ".wikipedia.org/").concat(options.path, "?");

    if (options.domain) {
      url = "https://".concat(options.domain, "/").concat(options.path, "?");
    }

    url += toUrlParams$2(params$2);

    if (/^Category/i.test(title) === false) {
      title = 'Category:' + title;
    }

    url += "&cmtitle=".concat(normalize(title));

    if (append) {
      url += append;
    }

    return url;
  };

  const getCategory$1 = async function (title, options, http) {
    let list = [];
    let getMore = true;
    let append = '';

    while (getMore) {
      let url = makeUrl$1(title, defaults$2, append);
      let {
        pages,
        cursor
      } = await fetchIt$1(url, http, 'categorymembers');
      list = list.concat(pages);

      if (cursor && cursor.cmcontinue) {
        append = '&cmcontinue=' + cursor.lhcontinue;
      } else {
        getMore = false;
      }
    }

    return list;
  };

  var getCategory_1 = getCategory$1;

  const {
    defaults: defaults$1,
    toUrlParams: toUrlParams$1
  } = _fns;
  const params$1 = {
    action: 'query',
    generator: 'random',
    grnnamespace: '0',
    prop: 'pageprops',
    grnlimit: '1',
    rvslots: 'main',
    format: 'json',
    origin: '*',
    redirects: 'true'
  };

  const fetchIt = function (url, http) {
    return http(url).then(res => {
      let pages = Object.keys(res.query.pages || {});

      if (pages.length === 0) {
        return {
          pages: [],
          cursor: null
        };
      }

      return res.query.pages[pages[0]];
    });
  };

  const makeUrl = function (options) {
    let url = "https://".concat(options.lang, ".wikipedia.org/").concat(options.path, "?");

    if (options.domain) {
      url = "https://".concat(options.domain, "/").concat(options.path, "?");
    }

    url += toUrlParams$1(params$1);
    return url;
  };

  const getRandom = async function (_options, http) {
    let url = makeUrl(defaults$1);
    let page = await fetchIt(url, http);
    return page;
  };

  var getRandom_1 = getRandom;

  const {
    defaults,
    toUrlParams
  } = _fns;
  const params = {
    format: 'json',
    action: 'query',
    generator: 'random',
    grnnamespace: 14,
    prop: 'revisions',
    grnlimit: 1,
    origin: '*'
  };

  const randomCategory = function () {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let http = arguments.length > 1 ? arguments[1] : undefined;
    options = Object.assign({}, defaults, options);
    let url = "https://".concat(options.lang, ".wikipedia.org/").concat(options.path, "?");

    if (options.domain) {
      url = "https://".concat(options.domain, "/").concat(options.path, "?");
    }

    url += toUrlParams(params);
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

  var getRandomCategory$1 = randomCategory;

  const slow = require$$0__default["default"];

  const isObject = function (obj) {
    return obj && Object.prototype.toString.call(obj) === '[object Object]';
  };

  const chunkBy = function (arr) {
    let chunkSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
    let groups = [];

    for (let i = 0; i < arr.length; i += chunkSize) {
      groups.push(arr.slice(i, i + chunkSize));
    }

    return groups;
  };

  const fetchList$1 = function (pages, options, wtf) {
    // support a list of strings, or objects
    if (pages[0] && isObject(pages[0])) {
      pages = pages.map(o => o.title);
    } // fetch in groups of 5


    let groups = chunkBy(pages);

    const doit = function (group) {
      return wtf.fetch(group, options); //returns a promise
    }; //only allow three requests at a time


    return slow.three(groups, doit).then(res => {
      // flatten into one list
      return res.reduce((arr, a) => {
        arr = arr.concat(a);
        return arr;
      });
    });
  };

  var fetchList_1 = fetchList$1;

  const getRedirects = getRedirects_1;
  const getIncoming = getIncoming_1;
  const getPageViews = getPageViews_1;
  const getTransclusions = getTransclusions_1;
  const getCategory = getCategory_1;
  const getRandomPage = getRandom_1;
  const getRandomCategory = getRandomCategory$1;
  const fetchList = fetchList_1;

  const addMethod = function (models) {
    // doc methods
    models.Doc.prototype.getRedirects = function () {
      return getRedirects(this.title(), models.http);
    };

    models.Doc.prototype.getIncoming = function () {
      return getIncoming(this.title(), models.http);
    };

    models.Doc.prototype.getPageViews = function () {
      return getPageViews(this, models.http);
    }; // constructor methods


    models.wtf.getRandomPage = function (options) {
      return getRandomPage(options, models.http);
    };

    models.wtf.getRandomCategory = function (options) {
      return getRandomCategory(options, models.http);
    };

    models.wtf.getTemplatePages = function (template, options) {
      return getTransclusions(template, options, models.http);
    };

    models.wtf.getCategoryPages = function (category, options) {
      return getCategory(category, options, models.http);
    };

    models.wtf.fetchList = function (list, options) {
      return fetchList(list, options, models.wtf);
    };

    models.wtf.getIncoming = function (title) {
      return getIncoming(title, models.http);
    };

    models.wtf.getRedirects = function (title) {
      return getRedirects(title, models.http);
    };
  };

  var src = addMethod;

  return src;

}));
//# sourceMappingURL=wtf-plugin-api.js.map
