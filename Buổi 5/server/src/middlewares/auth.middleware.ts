import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { ConfigEnvironment } from '~/config/env'

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // bearer token  => Bearer token => ["Bearer", "token"]
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    const decoded = jwt.verify(
      token,
      ConfigEnvironment.jwtSecretKey
    ) as jwt.JwtPayload & { userId: string }

    if (!decoded?.data?.userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    req.headers.userId = decoded.data.userId
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
    return
  }
}
