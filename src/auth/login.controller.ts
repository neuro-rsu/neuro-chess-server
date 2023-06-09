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

    console.log(`Get session from user ${req.session.userId}`);
    return res.status(200).send({ data: req.hosts })
  }

  async createLogin(req, res) {
      let clientId = await LoginService.createClient()
      if (req.session)
        req.session.userId = clientId;
      else
        console.log(`Not session`);

      //req.session.userId = clientId;

      if (clientId) return res.status(200).send({clientId: clientId})
      else
        return res
          .status(500)
          .send({ message: 'Unable create user.' })
  }
}

const loginController: LoginController = new LoginController()

export default loginController