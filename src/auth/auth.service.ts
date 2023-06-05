const clients = require('../helpers/clients')
const nano = require('../couch-db/couch-db')

class AuthService {
  getLogin(user) {
    return new Promise((res, rej) => {
      const db = nano.use('neuro-chess-users')
      db.partitionedList(user, { include_docs: true }).then(user => {
          return res(user)
      }).catch( err => res(err))
    })
  }

  async createClient() {
    return clients.constructor.createClient()
  }
}

export = new AuthService()