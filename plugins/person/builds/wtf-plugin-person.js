/* wtf-plugin-person 0.2.1  MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('spacetime')) :
  typeof define === 'function' && define.amd ? define(['spacetime'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.wtfPerson = factory(global.require$$0));
})(this, (function (require$$0) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);

  // https://en.wikipedia.org/wiki/Category:People_and_person_infobox_templates

  var _infoboxes = {
    actor: true,
    adult_biography: true,
    afl_biography: true,
    alpine_ski_racer: true,
    archbishop: true,
    architect: true,
    artist: true,
    athlete: true,
    baseball_biography: true,
    basketball_biography: true,
    boxer: true,
    canadianmp: true,
    cfl_player: true,
    chef: true,
    chess_player: true,
    christian_leader: true,
    college_coach: true,
    college_football_player: true,
    comedian: true,
    comics_creator: true,
    cricketer: true,
    criminal: true,
    cyclist: true,
    economist: true,
    engineer: true,
    fashion_designer: true,
    field_hockey_player: true,
    figure_skater: true,
    football_biography: true,
    gaa_player: true,
    golfer: true,
    governor: true,
    gridiron_football_person: true,
    gymnast: true,
    handball_biography: true,
    hindu_leader: true,
    horseracing_personality: true,
    ice_hockey_player: true,
    indian_politician: true,
    judge: true,
    lacrosse_player: true,
    martial_artist: true,
    mass_murderer: true,
    medical_person: true,
    military_person: true,
    minister: true,
    mlb_player: true,
    model: true,
    monarch: true,
    mp: true,
    nascar_driver: true,
    nba_biography: true,
    nfl_biography: true,
    nfl_player: true,
    officeholder: true,
    person: true,
    philosopher: true,
    police_officer: true,
    politician: true,
    'politician_(general)': true,
    presenter: true,
    president: true,
    professional_wrestler: true,
    racing_driver: true,
    religious_biography: true,
    roman_emperor: true,
    royalty: true,
    rugby_biography: true,
    rugby_league_biography: true,
    saint: true,
    scholar: true,
    scientist: true,
    skier: true,
    sportsperson: true,
    squash_player: true,
    state_representative: true,
    state_senator: true,
    swimmer: true,
    tennis_biography: true,
    volleyball_biography: true,
    volleyball_player: true,
    wrc_driver: true,
    writer: true,
    'hockey team player': true,
    'snooker player': true,
    bishop: true,
    'football biography': true,
    'military person': true,
    'baseball biography': true,
    'ice hockey player': true,
    'nfl player': true,
    'christian leader': true,
    congressman: true,
    'basketball biography': true,
    'comics creator': true,
    'professional wrestler': true,
    'college coach': true,
    'tennis biography': true,
    'afl biography': true,
    'nfl biography': true,
    'rugby biography': true,
    'rugby league biography': true,
    'prime minister': true,
    'nba biography': true,
    'figure skater': true,
    'f1 driver': true,
    'gridiron football person': true,
    'indian politician': true,
    'racing driver': true,
    'martial artist': true,
    'chinese-language singer and actor': true,
    astronaut: true,
    senator: true,
    'nascar driver': true,
    'adult biography': true,
    'state representative': true,
    'state senator': true,
    'coa wide': true,
    'religious biography': true,
    'chess player': true,
    'pageant titleholder': true,
    'gaa player': true,
    'us cabinet official': true
  };

  const mapping = _infoboxes;

  const byInfobox$5 = function (doc, prop) {
    let infoboxes = doc.infoboxes();

    for (let i = 0; i < infoboxes.length; i++) {
      let inf = infoboxes[i];
      let type = inf.type();
      type = type.toLowerCase();
      type = type.trim();

      if (mapping.hasOwnProperty(type)) {
        let s = inf.get(prop);

        if (s) {
          return s.text();
        }
      }
    }

    return null;
  };

  var getInfobox = byInfobox$5;

  const spacetime$1 = require$$0__default["default"];

  const parseSentence = function (doc) {
    let s = doc.sentence();

    if (!s) {
      return null;
    }

    let txt = s.text() || '';
    let paren = txt.match(/\(.*\)/);

    if (!paren || !paren[0]) {
      return null;
    }

    txt = paren[0] || '';
    txt = txt.trim();
    txt = txt.replace(/^\(/, '');
    txt = txt.replace(/\)$/, '');
    let split = txt.split(/ – /);
    split = split.filter(str => str); // got birth/death info

    if (split[0] && split[1] && split.length === 2) {
      return {
        birth: split[0],
        death: split[1]
      };
    } // try for just birth date in parentheses


    if (split[0]) {
      let str = split[0].replace(/^(born|ne) (c\.)?/, '');
      let d = spacetime$1(str);

      if (d.isValid()) {
        return {
          birth: str
        };
      }
    }

    return null;
  };

  var getSentence = parseSentence;

  const byCategory$4 = function (doc) {
    let cats = doc.categories();

    for (let i = 0; i < cats.length; i += 1) {
      let m = cats[i].match(/([0-9]{4}) births/);

      if (m && m[1]) {
        let year = parseInt(m[1], 10);

        if (year && year > 1000) {
          return year;
        }
      }
    }

    return null;
  };

  var byCategory_1$1 = byCategory$4;

  const spacetime = require$$0__default["default"];

  const parseDate$2 = function (str) {
    if (!str) {
      return null;
    } // remove parentheses


    str = str.replace(/\(.*\)/, '');
    str = str.trim(); // just the year

    if (str.match(/^[0-9]{4}$/)) {
      return {
        year: parseInt(str, 10)
      };
    } // parse the full date


    let s = spacetime(str);
    return {
      year: s.year(),
      month: s.month(),
      date: s.date()
    };
  };

  var parseDate_1 = parseDate$2;

  const byInfobox$4 = getInfobox;
  const bySentence$1 = getSentence;
  const byCategory$3 = byCategory_1$1;
  const parseDate$1 = parseDate_1;

  const birthDate$1 = function (doc) {
    let res = byInfobox$4(doc, 'birth_date');

    if (res) {
      return parseDate$1(res);
    } // try parentheses in first sentence


    res = bySentence$1(doc);

    if (res && res.birth) {
      return parseDate$1(res.birth);
    } // try to get year from 'Category:1955 births'


    let year = byCategory$3(doc);

    if (year) {
      return {
        year: year
      };
    }

    return null;
  };

  var birthDate_1 = birthDate$1;

  const byInfobox$3 = getInfobox;

  const birthPlace$1 = function (doc) {
    let res = byInfobox$3(doc, 'birth_place');

    if (res) {
      return res;
    }

    return null;
  };

  var birthPlace_1 = birthPlace$1;

  const aliveCats = {
    'Living people': true,
    'Year of birth missing (living people)': true,
    'Date of birth missing (living people)': true,
    'Place of birth missing (living people)': true,
    'Active politicians': true,
    'Biography articles of living people': true
  };
  const didDie = {
    'Dead people': true,
    'Date of death missing': true,
    'Date of death unknown': true,
    'Place of death missing': true,
    'Place of death unknown': true,
    'Year of death missing': true,
    'Year of death unknown': true,
    'Year of death uncertain': true,
    'Recent deaths': true,
    'People declared dead in absentia': true,
    'Politicians elected posthumously': true,
    'People who died in office': true,
    'Assassinated heads of state‎ ': true,
    'Assassinated heads of government': true,
    'Assassinated mayors': true,
    'People who died in Nazi concentration camps': true,
    'People executed in Nazi concentration camps': true,
    'Politicians who died in Nazi concentration camps': true,
    'People who have received posthumous pardons': true,
    'People lost at sea‎': true,
    'Deaths due to shipwreck': true,
    'People who died at sea': true,
    'Unsolved deaths‎': true,
    'Deaths by horse-riding accident‎': true,
    'Deaths from falls‎': true,
    'Deaths by poisoning‎‎': true,
    'Deaths from cerebrovascular disease‎': true,
    'Deaths from asphyxiation‎': true,
    'Deaths from sepsis‎': true,
    'Deaths from pneumonia‎': true,
    'Deaths from dysentery‎‎': true,
    'Deaths by drowning‎': true
  };

  const byCat$1 = function (doc) {
    let cats = doc.categories(); //confirmed alive categories

    if (cats.find(c => aliveCats.hasOwnProperty(c))) {
      return true;
    } //confirmed death categories


    if (cats.find(c => didDie.hasOwnProperty(c))) {
      return false;
    }

    return null;
  };

  var byCategory$2 = byCat$1;

  // {{WikiProject Biography}} (with living=yes parameter)
  // {{WikiProject banner shell}} (with blp=y parameter)

  const isAlive$2 = {
    blp: true,
    'blp unsourced': true,
    'blp unsourced section': true,
    'blp primary sources': true,
    'blp self-published': true,
    'blp sources': true,
    'blp sources section': true,
    'blp imdb-only refimprove': true,
    'blp imdb refimprove': true,
    'blp no footnotes': true,
    'blp more footnotes': true,
    'blp one source': true,
    'active politician': true,
    activepol: true,
    'current person': true
  };
  const isDead = {
    'recent death': true,
    'recent death presumed': true,
    'recent death confirmed': true,
    obituary: true,
    elegy: true,
    eulogy: true,
    panegyric: true,
    memorial: true
  };

  const byTemplate$1 = function (doc) {
    let templates = doc.templates().map(tmpl => tmpl.json());

    for (let i = 0; i < templates.length; i++) {
      let title = templates[i].template || '';
      title = title.toLowerCase().trim();

      if (isAlive$2.hasOwnProperty(title)) {
        return true;
      }

      if (isDead.hasOwnProperty(title)) {
        return false;
      }
    } // `{{WikiProject Biography|living=yes|activepol=yes}}`


    let bio = doc.template('WikiProject Biography');

    if (bio) {
      bio = bio.json(); //living blp BLP

      if (bio.living === 'yes' || bio.blp === 'yes' || bio.activepol === 'yes' || bio.BLP === 'yes') {
        return true;
      }

      if (bio.living === 'no' || bio.blp === 'no' || bio.BLP === 'no') {
        return false;
      }
    }

    return null;
  };

  var byTemplate_1 = byTemplate$1;

  const byCat = byCategory$2;
  const byTemplate = byTemplate_1; // maximum age of a person

  let d = new Date();
  const minYear = d.getFullYear() - 105;

  const isAlive$1 = function (doc) {
    // if we have a death date
    let death = doc.deathDate();

    if (death) {
      return false;
    } // if we have a death place


    let deathPlace = doc.deathPlace();

    if (deathPlace) {
      return false;
    } // does it have a good category?


    let fromCat = byCat(doc);

    if (fromCat === true || fromCat === false) {
      return fromCat;
    } // does it have a good template?


    let fromTemplate = byTemplate(doc);

    if (fromTemplate === true || fromTemplate === false) {
      return fromTemplate;
    } // were they born in 1900?


    let birth = doc.birthDate();

    if (birth && birth.year && birth.year < minYear) {
      return true;
    }

    return null;
  };

  var isAlive_1 = isAlive$1;

  const byCategory$1 = function (doc) {
    let cats = doc.categories();

    for (let i = 0; i < cats.length; i += 1) {
      let m = cats[i].match(/([0-9]{4}) deaths/);

      if (m && m[1]) {
        let year = parseInt(m[1], 10);

        if (year && year > 1000) {
          return year;
        }
      }
    }

    return null;
  };

  var byCategory_1 = byCategory$1;

  const byInfobox$2 = getInfobox;
  const bySentence = getSentence;
  const byCategory = byCategory_1;
  const parseDate = parseDate_1;

  const deathDate$1 = function (doc) {
    let res = byInfobox$2(doc, 'death_date');

    if (res) {
      return parseDate(res);
    } // try parentheses in first sentence


    res = bySentence(doc);

    if (res && res.death) {
      return parseDate(res.death);
    } // try to get year from 'Category:1955 deaths'


    let year = byCategory(doc);

    if (year) {
      return {
        year: year
      };
    }

    return null;
  };

  var deathDate_1 = deathDate$1;

  const byInfobox$1 = getInfobox;

  const deathPlace$1 = function (doc) {
    let res = byInfobox$1(doc, 'death_place');

    if (res) {
      return res;
    }

    return null;
  };

  var deathPlace_1 = deathPlace$1;

  const byInfobox = getInfobox;

  const getNationality = function (doc) {
    let res = byInfobox(doc, 'nationality');

    if (res) {
      return res;
    }

    return null;
  };

  var nationality$1 = getNationality;

  const birthDate = birthDate_1;
  const birthPlace = birthPlace_1;
  const isAlive = isAlive_1;
  const deathDate = deathDate_1;
  const deathPlace = deathPlace_1;
  const nationality = nationality$1;

  const addMethod = function (models) {
    models.Doc.prototype.birthDate = function () {
      return birthDate(this);
    };

    models.Doc.prototype.birthPlace = function () {
      return birthPlace(this);
    };

    models.Doc.prototype.isAlive = function () {
      return isAlive(this);
    };

    models.Doc.prototype.deathDate = function () {
      return deathDate(this);
    };

    models.Doc.prototype.deathPlace = function () {
      return deathPlace(this);
    };

    models.Doc.prototype.nationality = function () {
      return nationality(this);
    };
  };

  var src = addMethod;

  return src;

}));
//# sourceMappingURL=wtf-plugin-person.js.map
