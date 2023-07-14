import signUpService from './sign-up.service.js'

class SignUpController {
  // getLogin(req, res) {
  //   if (req.query.id) {
  //     if (req.hosts.hasOwnProperty(req.query.id))
  //       return res
  //         .status(200)
  //         .send({ data: req.hosts[req.query.id] })
  //     else
  //       return res
  //         .status(404)
  //         .send({ message: 'Host not found.' })
  //   } else if (!req.hosts)
  //     return res
  //       .status(404)
  //       .send({ message: 'Hosts not found.' })

  //   console.log(`Get session from user ${req.session.userId}`);
  //   return res.status(200).send({ data: req.hosts })
  // }

  createUser(req, res, next) {
    signUpService.checkUserName(req)
      .then(() => signUpService.checkPassword(req))
      .then(() => signUpService.checkUser(req))
      .then(() => signUpService.createUser(req))
      .then(() => signUpService.getUser(req))
      .then((r) => {
        res.status(200).send({ p: r })
      })
      .catch(next)
  }


}

const signUpController: SignUpController = new SignUpController()

export default signUpController