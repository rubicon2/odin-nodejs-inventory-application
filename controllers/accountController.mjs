import checkPassword from '../password.mjs';

function getLoginForm(req, res) {
  const { isLoggedIn, errorMessage } = req.session;
  res.render('accounts/login.ejs', {
    title: 'Login',
    isLoggedIn,
    errorMessage,
  });
}

function getLogout(req, res) {
  req.session.isLoggedIn = false;
  res.status(303).redirect('/');
}

function postLoginForm(req, res) {
  if (checkPassword(req.body.password)) {
    req.session.errorMessage = null;
    req.session.isLoggedIn = true;
    res.status(303).redirect('/');
  } else {
    req.session.errorMessage = 'Password entered was incorrect.';
    res.status(401).redirect('/account/login');
  }
}

export { getLoginForm, getLogout, postLoginForm };
