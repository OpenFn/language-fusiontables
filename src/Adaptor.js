import { execute as commonExecute, expandReferences } from 'language-common';
import { post } from './Client';
import { resolve as resolveUrl } from 'url';

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
export function execute(...operations) {
  const initialState = {
    references: [],
    data: null
  }

  return state => {
    return commonExecute(...operations)({ ...initialState, ...state })
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
export function row(rowData) {

  return state => {
    const body = expandReferences(rowData)(state);
    // const body = `const body = INSERT INTO <table_id> (<column_name> {, <column_name>}*) VALUES (<value> {, <value>}*){ {;INSERT INTO <table_id> (<column_name> {, <column_name>}*) VALUES (<value> {, <value>}*)}*`;

    const { username, password, apiUrl } = state.configuration;

    //same
    // where are these being entered from- username, password, apiURL
    const url = resolveUrl(apiUrl + '/', 'api/events')

    console.log("Posting row data:");
    console.log(body)

    // return post({ username, password, body, url, clientID, scope})
    return post({ username, password, body, url})
    .then((result) => {
      console.log("Success:", result);
      return { ...state, references: [ result, ...state.references ] }
    })

  }
}

export {
  field, fields, sourceValue,
  merge, dataPath, dataValue, lastReferenceValue
} from 'language-common';
