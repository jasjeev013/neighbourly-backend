const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'neighbourlyisthebest';

function auth(req, res, next) {
<<<<<<< HEAD

  const token = req.header('access_token');

 


=======
  const token = req.headers.access_token;
   console.log(token)
   console.log(req.headers)
>>>>>>> 6e4053102d34519b916c413fe1888b87aebbdbc5
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

function authorize(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    next();
  };
}

module.exports = { auth, authorize };