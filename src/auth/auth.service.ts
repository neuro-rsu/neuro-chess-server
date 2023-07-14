import nano from '../couch-db/couch-db.js'
import {default as clients,  Clients}  from '../helpers/clients.js'

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
    return Clients.createClient()
  }
}

const authService: AuthService = new AuthService()

export default authService