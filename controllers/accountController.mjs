import { checkUserCredentials } from '../db/auth.mjs';

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

async function postLoginForm(req, res, next) {
  try {
    const { username, password } = req.body;
    const areCredentialsValid = await checkUserCredentials(username, password);
    if (areCredentialsValid) {
      req.session.errorMessage = null;
      req.session.isLoggedIn = true;
      res.status(303).redirect('/');
    } else {
      req.session.errorMessage = 'Username and password do not match.';
      res.status(401).redirect('/account/login');
    }
  } catch (error) {
    next(error);
  }
}

export { getLoginForm, getLogout, postLoginForm };
