
import { Router } from 'express';
import magicNumber from './magic_number'
const api = Router()

api.get('/', (req, res, next) => {
  res.json({hello: 'Hello'})
  // Mail.send("ben@mailinator.com", "welcome")
  next()
})

api.use('/magic_number', magicNumber)


export default api;