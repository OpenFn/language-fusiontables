'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lastReferenceValue = exports.dataValue = exports.dataPath = exports.merge = exports.sourceValue = exports.fields = exports.field = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.execute = execute;
exports.row = row;

var _languageCommon = require('language-common');

Object.defineProperty(exports, 'field', {
  enumerable: true,
  get: function get() {
    return _languageCommon.field;
  }
});
Object.defineProperty(exports, 'fields', {
  enumerable: true,
  get: function get() {
    return _languageCommon.fields;
  }
});
Object.defineProperty(exports, 'sourceValue', {
  enumerable: true,
  get: function get() {
    return _languageCommon.sourceValue;
  }
});
Object.defineProperty(exports, 'merge', {
  enumerable: true,
  get: function get() {
    return _languageCommon.merge;
  }
});
Object.defineProperty(exports, 'dataPath', {
  enumerable: true,
  get: function get() {
    return _languageCommon.dataPath;
  }
});
Object.defineProperty(exports, 'dataValue', {
  enumerable: true,
  get: function get() {
    return _languageCommon.dataValue;
  }
});
Object.defineProperty(exports, 'lastReferenceValue', {
  enumerable: true,
  get: function get() {
    return _languageCommon.lastReferenceValue;
  }
});

var _Client = require('./Client');

var _url = require('url');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Execute a sequence of operations.
 * Wraps `language-common/execute`, and prepends initial state for fusiontables.
 * @example
 * execute(
 *   create('foo'),
 *   delete('bar')
 * )(state)
 * @constructor
 * @param {Operations} operations - Operations to be performed.
 * @returns {Operation}
 */
function execute() {
  for (var _len = arguments.length, operations = Array(_len), _key = 0; _key < _len; _key++) {
    operations[_key] = arguments[_key];
  }

  var initialState = {
    references: [],
    data: null
  };

  return function (state) {
    return _languageCommon.execute.apply(undefined, operations)(_extends({}, initialState, state));
  };
}

/**
 * Create a row
 * @example
 * execute(
 *   event(data)
 * )(state)
 * @constructor
 * @param {object} rowData - Payload data for the Row
 * @returns {Operation}
 */
function row(rowData) {

  return function (state) {
    var body = (0, _languageCommon.expandReferences)(rowData)(state);
    // const body = `const body = INSERT INTO <table_id> (<column_name> {, <column_name>}*) VALUES (<value> {, <value>}*){ {;INSERT INTO <table_id> (<column_name> {, <column_name>}*) VALUES (<value> {, <value>}*)}*`;

    var _state$configuration = state.configuration;
    var username = _state$configuration.username;
    var password = _state$configuration.password;
    var apiUrl = _state$configuration.apiUrl;

    //same
    // where are these being entered from- username, password, apiURL

    var url = (0, _url.resolve)(apiUrl + '/', 'api/events');

    console.log("Posting row data:");
    console.log(body);

    // return post({ username, password, body, url, clientID, scope})
    return (0, _Client.post)({ username: username, password: password, body: body, url: url }).then(function (result) {
      console.log("Success:", result);
      return _extends({}, state, { references: [result].concat(_toConsumableArray(state.references)) });
    });
  };
}

// /** This is the call for CartoDb's
//  * Execute an SQL statement
//  * @example
//  * execute(
//  *   sql(sqlQuery)
//  * )(state)
//  * @constructor
//  * @param {object} sqlQuery - Payload data for the message
//  * @returns {Operation}
//  */
// export function sql(sqlQuery) {
//
//   return state => {
//
//     const body = sqlQuery(state);
//
//     const { account, apiKey } = state.configuration;
//
//     const url = 'https://'.concat(account, '.cartodb.com/api/v2/sql')
//
//     console.log(url)
//     console.log("Executing SQL query:");
//     console.log(body)
//
//     return post({ apiKey, body, account, url })
//     .then((result) => {
//       console.log("Success:", result);
//       return { ...state, references: [ result, ...state.references ] }
//     })
//
//   }
// }
