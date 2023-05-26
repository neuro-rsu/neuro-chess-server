import ULID = require('ulid')
const  nano = require('../couch-db/couch-db')

class Clients {
    static  clients = new Map()

    static createClient(response: object) {
      return Clients.getUlid()
    }

    static getUlid() {
        return ULID.ulid()
    }

}

export = new Clients()