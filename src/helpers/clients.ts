import * as ULID from 'ulid'

//const nano = require('../couch-db/couch-db')

export class Clients {
    static  clients = new Map()

    static createClient() {
      return Clients.getUlid()
    }

    static getUlid() {
        return ULID.ulid()
    }
}

const clients: Clients = new Clients()

export default clients