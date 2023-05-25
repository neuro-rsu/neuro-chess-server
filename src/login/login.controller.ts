const LoginService = require('./login.service')

class LoginController {
  getLogin(req, res) {
    if (req.query.id) {
      if (req.hosts.hasOwnProperty(req.query.id))
        return res
          .status(200)
          .send({ data: req.hosts[req.query.id] })
      else
        return res
          .status(404)
          .send({ message: 'Host not found.' })
    } else if (!req.hosts)
      return res
        .status(404)
        .send({ message: 'Hosts not found.' })

    return res.status(200).send({ data: req.hosts })
  }
}

export = new LoginController()