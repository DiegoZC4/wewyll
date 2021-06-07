

function doAuth(req, res) {
  // TODO: do the auth

  // we let people past with null auth, but some methods don't, they'll handle
  // that themselves

  // this function just parses all the authentication and stops incorrect
  // credentials, etc.
  let valid = true;

  let user = null;
  let access = null;

  if (valid) {
    res.locals.user = user;
    res.locals.access = access;
    next();
  } else {
    err = new Error("Invalid credentials!");
    next(err);
  }
}

module.exports = doAuth;
