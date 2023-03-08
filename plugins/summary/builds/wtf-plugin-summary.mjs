/* wtf-plugin-summary 0.3.1  MIT */
import require$$0 from 'compromise';

const fromTemplate$1 = function (doc) {
  let tmpl = doc.template('short description');

  if (tmpl) {
    let json = tmpl.json() || {};
    return json.description || '';
  }

  return null;
};

var template = fromTemplate$1;

const preProcess$1 = function (doc) {
  doc.parentheses().remove();
  return doc;
};

var _00PreProcess = preProcess$1;

const cleanUp = function (s) {
  // 'an actor and was a politician'
  s.remove('and #Copula .*');
  return s;
}; //  founded in 1952 as the flagship ..


const findPivot$1 = function (s) {
  let m = s.matchOne('#Copula+ (a|an|the|any|one) of?');

  if (!m.found) {
    m = s.matchOne('#Copula+');
  }

  if (!m.found) {
    m = s.matchOne('refers to (a|an|the|any)? of?');
  }

  if (!m.found) {
    m = s.matchOne('(constitutes|describes) (a|an|the|any)? of?');
  }

  if (!m.found) {
    return null;
  }

  let f = s.splitOn(m);
  let verb = f.eq(1);
  let article = verb.match("(a|an|the|any)? of?");
  verb.remove("(a|an|the|any)? of?");
  return {
    before: f.eq(0),
    verb: f.eq(1),
    article: article,
    after: cleanUp(f.eq(2))
  };
};

var _01Pivot = findPivot$1;

const byClause$1 = function (s) {
  // 'an actor and also a politician'
  s.remove('and (also|eventually) (a|an|the|#Possessive) .*'); // 'an actor who was a politician'

  s.remove('!of (who|that|which) #Adverb? (#Copula|form|comprise|forms|comprises) .*'); // past-tense verbs 'located in spain'

  s.remove('#Adverb? (located|situated|founded|found|formed|built|developed) .*'); //

  s.remove('#Adverb? (located|situated|founded|found|formed|built|developed) .*');
  return s;
};

var _02ByClause = byClause$1;

const safeCuts = function (s) {
  // 'in hamilton, Canada'
  if (s.has('(#Place && @hasComma) #Country+$')) {
    s.remove('#Country+$');
  } // 'which spans the '


  if (s.has('#Noun (that|which|who) #PresentTense the .*')) {
    s.remove(' that #PresentTense the .*');
  } // 'owned by the ...'


  if (s.has('#Noun #PastTense by the .*')) {
    s.remove('#PastTense by the .*');
  } // 'an american actress'


  s.remove('#Demonym'); // professional hockey player

  s.remove('(professional|former)'); //event-templates

  s.remove('and? held annually .*');
  s.remove('taking place each .*'); // ordinal templates - the fifth fastest ..

  s.remove('^one of (the|many|several|#Value)+');
  s.remove('^(a|an|the)? #Ordinal? #Superlative');
  s.remove('^(a|an|the)? #Ordinal? most #Adjective'); //

  s.remove('born in .*');
  s.remove('born #Date+ in? #Place+?');
  s.remove('(first|initially|originally)? (located|founded|started|based|formed) in .*');
  s.remove('(which|who|that) (is|was) .*');
  s.remove('^the name of');
  return s;
};

var _03SafeCuts = safeCuts;

const isIndependent = function (c) {
  if (c.has('^(and|the|which|who|whom|also|a|an|the)')) {
    return true;
  } // 'part of abu dabi'


  if (c.has('^(west|north|south|east|part) of')) {
    return true;
  } // 'written by .'


  if (c.has('^#PastTense by .')) {
    return true;
  } // 'sometimes called ..'


  if (c.has('^(occasionally|sometimes|frequently)')) {
    return true;
  } // 'such as ..'


  if (c.has('^such as')) {
    return true;
  } // 'featuring gold feathers ..'


  if (c.has('^(including|featuring|depicting)')) {
    return true;
  }

  return false;
};

const hardCuts = function (s) {
  // .. in san fransisco
  if (s.has('#Noun (located|based|situated|sited|found|discovered) (in|on) #Place+$')) {
    s.remove('(located|based) in #Place+$');
  } else if (s.has('(#Noun|#Value) (in|on) the #Adjective? (region|province|district|coast|city) of #Place+$')) {
    s.remove('(in|on) the #Adjective? (region|province|district|coast|city) of #Place+$');
  } else if (s.has('(#Noun|#Value) in #Place+$')) {
    s.remove('in #Place+$');
  } else {
    s.remove('and? part of #Place+$');
    s.remove('and? near #Place+$');
  } // by clause


  let clauses = s.clauses();

  if (clauses.length > 1) {
    let first = clauses.eq(0);
    let second = clauses.eq(1); //can we just choose the first clause?

    if (isIndependent(second)) {
      s = clauses.eq(0);
    } else if (second.has('^(#PastTense)') && first.has('(#Noun|#Value)$')) {
      // 'produced by...'
      s = clauses.eq(0);
    } else if (second.has('^(#Gerund)') && first.has('#Noun$')) {
      // 'featuring a ...'
      s = clauses.eq(0);
    } else {
      // can we remove the last clause, atleast?
      let last = clauses.last();

      if (isIndependent(last)) {
        clauses.list.pop();
        s = clauses.join();
      }
    }
  } //.. writen by sandro leonardo


  if (s.has('(#Noun|and) #PastTense by')) {
    s.remove('#PastTense by .*');
  } //


  s.remove('and? designed to .*');
  s.remove('and? owned by .*');
  s.remove('and? consisting of .*'); // , which collapsed

  if (s.has('@hasComma (which|who) #Verb')) {
    s.remove('(which|who) .*');
  } // , then
  // if (s.has('@hasComma (then)')) {
  //   s.remove('(which|who) .*')
  // }


  return s;
};

var _04HardCuts = hardCuts;

const lastTry$1 = function (s) {
  s.remove('(small|large|minor|major)');
  s.remove('(extinct|retired|annual|biweekly|monthly|daily)');
  s.remove('(female|male)');
  s.remove('(private|independent|official|unofficial|officially)');
  s.remove('(southern|northern|eastern|western|northeastern|northwestern)'); //

  s.remove('^(family|clade|genus|species|order) of');
  return s;
};

var _05LastTry = lastTry$1;

const isGood$1 = function (doc, options) {
  if (doc && typeof doc.text === 'function') {
    let text = doc.text();

    if (text && text.length > options.min && text.length < options.max) {
      return true;
    }
  }

  return false;
};

var _isGood = isGood$1;

const nlp$2 = require$$0;
const preProcess = _00PreProcess;
const findPivot = _01Pivot;
const byClause = _02ByClause;
const safeCut = _03SafeCuts;
const hardCut = _04HardCuts;
const lastTry = _05LastTry;
const isGood = _isGood;

const post = function (s) {
  s.remove('^(and|or|but)');
  s.remove('(and|or|but)$');
  s.post(''); // remove trailing comma

  return s.text();
}; // let count = 0


const doSentence = function (doc, options) {
  let sentence = doc.sentence(0);

  if (!sentence) {
    return '';
  }

  let txt = sentence.text();
  let s = nlp$2(txt);
  preProcess(s);
  let pivot = findPivot(s); // if we can't pivot it properly, don't bother

  if (!pivot || !pivot.verb || !pivot.verb.found) {
    return '';
  }

  let after = pivot.after;

  if (options.article && pivot.article && pivot.article.found) {
    after.prepend(pivot.article.text());
  } // maybe it's good already


  if (isGood(after, options)) {
    return post(after);
  } // parse major chunks


  after = byClause(after);

  if (isGood(after, options)) {
    return post(after);
  } // perform some modifications


  after = safeCut(after);

  if (isGood(after, options)) {
    return post(after);
  } // really give it a go


  after = hardCut(after);

  if (isGood(after, options)) {
    return post(after);
  } // atleast we tried


  after = lastTry(after);

  if (isGood(after, options)) {
    return post(after);
  } // console.log(after.text())
  // count += 1
  // console.log(count)
  // console.log(after.match('#PastTense').text())
  // console.log(after.text())
  // console.log('\n')


  return '';
};

var sentence = doSentence;

const bad$1 = ['living', 'births', 'former', 'deceased', 'missing', 'with', 'descent', 'award', 'winners', 'nominees', 'alumni', 'other'].map(str => new RegExp("\\b".concat(str, "\\b"), 'i'));
const good$1 = ['male', 'female'].map(str => new RegExp("\\b".concat(str, "\\b"), 'i'));
const like$1 = ['male', 'female', 'century'].map(str => new RegExp("\\b".concat(str, "\\b"), 'i'));
const dislike$1 = ['people', 'place', 'from', 'in', 'people from'].map(str => new RegExp("\\b".concat(str, "\\b")), 'i');
var regs = {
  good: good$1,
  bad: bad$1,
  like: like$1,
  dislike: dislike$1
};

const {
  like,
  dislike,
  good,
  bad
} = regs;
const hasYear = /[0-9]{4}/;
const isPlural = /s$/;

const fromCategory$1 = function (doc) {
  let cats = doc.categories(); // try to focus on the best ones, first

  let tmp = cats.filter(cat => {
    return good.find(reg => reg.test(cat));
  });

  if (tmp.length > 0) {
    cats = tmp;
  } // remove bad ones


  cats = cats.filter(cat => {
    if (bad.find(reg => reg.test(cat))) {
      return false;
    }

    if (hasYear.test(cat)) {
      return false;
    }

    return true;
  });

  if (cats.length === 0) {
    return '';
  } // look at sorting by preferences


  tmp = cats.filter(cat => {
    return like.find(reg => reg.test(cat));
  });

  if (tmp.length > 0) {
    cats = tmp;
  } // remove disliked ones


  tmp = cats.filter(cat => {
    // not a plural ending
    if (isPlural.test(cat) === false) {
      return false;
    } // just one word


    if (cat.slice(' ').length === 1) {
      return false;
    }

    return dislike.find(reg => reg.test(cat)) === undefined;
  });

  if (tmp.length > 0) {
    cats = tmp;
  } // sort them by most words


  cats = cats.sort((a, b) => {
    let aWords = a.split(' ').length;
    let bWords = b.split(' ').length;

    if (aWords > bWords) {
      return -1;
    } else if (aWords < bWords) {
      return 1;
    }

    return 0;
  }); // console.log(cats)

  return cats[0];
};

var _01Choose = fromCategory$1;

const nlp$1 = require$$0;

const useAn = function (str) {
  const a_regexs = [/^onc?e/i, //'wu' sound of 'o'
  /^u[bcfhjknq-t][aeiou]/i, // 'yu' sound for hard 'u'
  /^eul/i];

  for (let i = 0; i < a_regexs.length; i++) {
    if (a_regexs[i].test(str)) {
      return false;
    }
  } //basic vowel-startings


  if (/^[aeiou]/i.test(str)) {
    return true;
  }

  return false;
}; // 'American songwriters' to 'an American songwriter'


const changeCat = function (cat, options) {
  let c = nlp$1(cat);
  c.nouns().toSingular(); // add article to the front

  if (options.article) {
    let article = 'A'; // let noun = c.nouns(0)

    if (useAn(cat) === true) {
      // console.log(c.nouns(0))
      // article = c.nouns(0).json({ terms: false })[0].article || article
      article = 'An';
    }

    let first = c.terms(0);

    if (first.has('#ProperNoun') === false) {
      first.toLowerCase();
    }

    c.prepend(article);
  } // remove any parentheses


  c.parentheses().remove();
  return c.text();
};

var _02Change = changeCat;

const chooseCat = _01Choose;
const change = _02Change;

const byCategory = function (doc, options) {
  let cat = chooseCat(doc);

  if (!cat) {
    return '';
  }

  return change(cat, options);
};

var category = byCategory;

const nlp = require$$0;
const fromTemplate = template;
const fromSentence = sentence;
const fromCategory = category;
const defaults = {
  article: true,
  template: true,
  sentence: true,
  category: true,
  max: 80,
  min: 3
};

const seemsGood = function (txt, options) {
  return txt && txt.length > 5 && txt.length < options.max;
};

const plugin = function (models) {
  // add a new method to main class
  models.Doc.prototype.summary = function (options) {
    let doc = this;
    options = options || {};
    options = Object.assign({}, defaults, options); // generate from {{short description}} template

    let txt = '';

    if (options.template) {
      txt = fromTemplate(doc);

      if (seemsGood(txt, options)) {
        return txt.trim();
      }
    } // generate from first-sentence


    if (options.sentence) {
      txt = fromSentence(doc, options);

      if (seemsGood(txt, options)) {
        return txt.trim();
      }
    }

    if (options.category) {
      return fromCategory(doc, options);
    }

    return '';
  }; // should we use 'it', 'he', 'they'...


  models.Doc.prototype.article = function () {
    let txt = ''; // prefer the 2nd sentence

    if (this.sentence(1)) {
      txt = this.sentence(1).text();
    } else {
      txt = this.sentence(0).text();
    }

    let doc = nlp(txt);
    let found = doc.match('(#Pronoun|#Article)').eq(0).text().toLowerCase();
    return found || 'it';
  }; // was event in past? is person dead?


  models.Doc.prototype.tense = function () {
    let txt = this.sentence().text();
    let doc = nlp(txt);
    let copula = doc.match('#Copula+').first();

    if (copula.has('was')) {
      return 'Past';
    }

    let vb = doc.verbs(0);

    if (vb.has('#PastTense')) {
      return 'Past';
    }

    if (doc.has('will #Adverb? be') || doc.has('(a|an) (upcoming|planned)')) {
      return 'Future';
    }

    return 'Present';
  };
};

var src = plugin;

export { src as default };
