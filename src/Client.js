import request from 'superagent'

// export function post({ username, password, body, url, clientID, scope}) {
export function post({ username, password, body, url }) {
  return new Promise((resolve, reject) => {
    request.post(url)
    .type('json')
    .accept('json')
    // .auth(username, password, clientID, scope)
    //Why do we use the .type and .accept compands
    // what changes are required here, there's an extra clientID and scope needed
    // the url is something like https://accounts.google.com/o/oauth2/v2/auth
    .auth(username, password)
    .send(body)
    .end((error, res) => {
      if (!!error || !res.ok) {
        reject( error )
      }

      resolve( res )
    })

  })
}

// So how this works is you first add a request- which could be de Delete, Head, Post, Put. All of these commands must be passed a URL on which to act. So the url
//given here as the argument of the Post command will be where
// When making a post, we must specify what kind of post it is. As a short-hand the .type() method is also available,
//accepting the canonicalized MIME type name complete with type/subtype, or simply the extension name such as "xml", "json", "png", etc:
//Superagent will automatically serialize JSON and forms. If you want to send the payload in a custom format, you can replace the built-in serialization with .serialize() method.
//Setting Accept
//Would we need a query string?
//Why is a body required to be created
