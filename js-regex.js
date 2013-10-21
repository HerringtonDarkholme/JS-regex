(function () {
  'use strict';

  // utility
  function isPlainObject (obj) {
    var ctor,
        toString = Object.prototype.toString,
        hasOwnProperty = Object.prototype.hasOwnProperty;

    if ( !obj ||
         typeof obj !== 'object' ||
         toString.call(obj) !== '[object Object]') {
      return false;
    }

    ctor = typeof obj.constructor === 'function' && obj.constructor.prototype;
    if (!ctor || !hasOwnProperty.call(ctor, 'isPrototypeOf')) {
      return false;
    }

    return true;
  }

  function isArray (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }


  // exports
  var Regex = {
    // Chinese Resident ID
    IDCARD: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
    // obsolete 15 digits ID
    IDCARD2: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/,

    // username
    ALPHNUM: /^[a-zA-Z0-9]+$/,
    USERNAME: /^[A-Za-z0-9_]{1,32}$/, // twitter like


    // password
    // UpperCase, LowerCase, Number
    PASSWORD: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/,
    STRONG_PASSWORD: /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,


    // url & email
    URL: /^((https?|ftp):\/\/|(www|ftp)\.)[a-z0-9-]+(\.[a-z0-9-]+)+([\/?].*)?$/,
    // reference: http://stackoverflow.com/questions/161738/what-is-the-best-regular-expression-to-check-if-a-string-is-a-valid-url
    STRICT_URL: /^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)$/,
    // email specs are crazy. this only couples with a limited scope(but still useful)
    EMAIL: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,


    // phone, tel
    PHONE: /^(1(([35][0-9])|(47)|[8][01236789]))\d{8}$/,
    TEL: /^(\+?\d{2})?(0\d{2,3}(\-)?)?\d{7,8}$/,

    // misc
    MONGOID: /[0-9a-f]{24}/,
    UUID: /([0-9a-fA-F]{32}|[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/,
    IPV4: /((^|\.)((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]?\d))){4}$/,
    IPV6: /((^|:)([0-9a-fA-F]{0,4})){1,8}$/,
    CHINESE: /^[\u4e00-\u9fa5]+$/,
    CHINESE_EXT: /^([\u4E00-\u9FA5\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]|[\uFE30-\uFFA0])+$/,

    // function
    escapeText : function(data) {
      return data.replace(/&/g, '&amp;').
                  replace(/</g, '&lt;').
                  replace(/>/g, '&gt;').
                  replace(/"/g, '&quot;');
    },

    escapeJSON: function (data) {
      if (typeof  data === 'string') {
        return Regex.escapeText(data);
      }
      if (isArray(data) || isPlainObject(data)) {
        for (var i in data) {
          if (data.hasOwnProperty(i)) {
            data[i] = Regex.escapeJSON(data[i]);
          }
        }
      }
      return data;
    },

    nameLength: function (lower, upper) {
      lower = (+lower) ||  4;
      upper = (+upper) || 32;
      return new RegExp('^[A-Za-z0-9_]{'+ lower, +','+upper+'}');
    },

    railsRoute: function (url) {
      // strip unnecessary part
      url = url.replace(/https?:\/\//, ''). // scheme
                replace(/\?.*/, '').        // query
                replace(/#.*/, '').         // hash
                replace(/\/$/, '');         // trailing slash

      var components = url.split('/'),
          comp = components[0];
      var namespace, contoller, mongoid, action, len;

      if (!comp) { return null; }
      // exclude hostname
      /\./.test(comp) && components.shift();
      len = components.length;

      var isMongo = function (comp) {
        return Regex.MONGOID.test(comp) || /\-/.test(comp);
      };

      // kill len >= 5
      if (len > 4 && isMongo(components[len-2])) {
        components = components.slice(len - 4);
        len = 4;
      }

      switch (len) {
      case 0:
        contoller = 'ROOT';
        break;
      case 1:
        contoller = components[0];
        action = 'index';
        break;
      case 2:
        contoller = components[0];
        comp = components[1];
        if (isMongo(comp)) {
          mongoid = comp;
          action  = 'show';
        } else {
          action = comp;
        }
        break;
      case 3:
        comp = components[1];
        if (isMongo(comp)) {
          contoller = components[0]
          mongoid = comp;
          action  = components[2];
        } else {
          namespace = components[0];
          contoller = comp;
          comp = components[2];
          mongoid = isMongo(comp) ? comp : undefined;
          action = isMongo(comp) ? 'show' : comp;
        }
        break;
      case 4:
        namespace = components[0];
        contoller = components[1];
        mongoid   = components[2];
        action    = components[3];
        break;
      }

      return {
        namespace : namespace,
        contoller : contoller,
        mongoid   : mongoid,
        action    : action
      };
    }

  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Regex;
  } else if (typeof define === 'function' && define.amd) {
    define(function(){ return Regex; });
  } else {
    window.Regex = Regex;
  }
})();
