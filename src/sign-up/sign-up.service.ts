import nano from '../couch-db/couch-db.js'

import {User} from 'user'

import * as ULID from 'ulid';

import bcrypt from 'bcrypt'

class SignUpService {
  checkMethod(req) {
    return (req.method === "POST") ? Promise.resolve("POST") :
      Promise.reject({
        error: `Метод ${req.method} недопустим`,
        status: 400
      })
  }

  checkUserName(req) {
    return req.body.username !== undefined ? Promise.resolve(JSON.stringify(req.body.username)) :
      Promise.reject({
        error: `Не задано имя пользователя`,
        status: 400
      })
  }

  checkPassword(req) {
    return req.body.password !== undefined ? Promise.resolve(req.body.password) :
      Promise.reject({
        error: `Не задан пароль пользователя`,
        status: 400
      })
  }

  checkUser(req) {
    return new Promise((res, rej) => {
        const db = nano.use('neuro-chess-users')
        db.partitionedList(req.body.username)
          .then(loginList => {
            if (loginList.rows.length === 0 )
              return res(loginList.rows.length)
            else {
              rej({
                error: `Пользователь с именем ${req.body.username} уже существует`,
                status: 400
              })
            }
          })
          .catch( (e) =>
            rej({
              error: `Ошибка запроса к базе данных: ${e}`,
              status: 400
            })
          )
    })
  }

  createHash(req) {
    return bcrypt.hash(req.body.password, +process.env.SALT_ROUNDS )
      .catch ( err =>
        Promise.reject( {
          error: `Ошибка создания кеша пароля: ${err}`,
          status: 500
        })
      )
  }

  insertUser(req, hash) {
    const db = nano.use('neuro-chess-users')
    const user: User = {
      ulid: ULID.ulid(),
      password: hash
    }
    return db.insert(user as object, `${req.body.username}:user`)
    .catch( err =>
        Promise.reject({
          error: `Ошибка создания пользователя: ${err}`,
          status: 500
        })
      )
  }

  getUser(req) {
    const db = nano.use('neuro-chess-users')
    return db.get(`${req.body.username}:user`).catch( err =>
      Promise.reject({
        error: `Не могу найти пользователя в базе данных: ${err}`,
        status: 500
      })
    )
  }

  createUser(req) {
    return this.createHash(req).then(hash => this.insertUser(req, hash))
  }
}

const signUpService: SignUpService = new SignUpService()

export default signUpService