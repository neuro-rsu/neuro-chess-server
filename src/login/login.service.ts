const clients = require('../helpers/clients')
const nano = require('../couch-db/couch-db')

class LoginService {
  getLogin() {
    return new Promise((res, rej) => {
      const db = nano.use('frameworks')
      db.partitionedList('login').then(loginList => {
        return res(loginList)
      }).catch( err => res(err))
    })
  }

  async createClient() {
    return clients.constructor.createClient()
  }


}

const loginService: LoginService = new LoginService()

export default loginService