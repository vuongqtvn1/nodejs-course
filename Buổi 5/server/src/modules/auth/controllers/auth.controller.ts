import { Request, Response } from 'express'
import { RegisterDTO, LoginDTO } from '../dtos/auth.dto'
import { AuthService } from '../services/auth.service'

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const data = req.body as RegisterDTO

      const result = await AuthService.register(data)
      res.status(201).json(result)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const data = req.body as LoginDTO

      const result = await AuthService.login(data)

      res.json(result)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  static async getMe(req: Request, res: Response) {
    try {
      const userId = req.headers.userId as string

      const result = await AuthService.getMe(userId)

      res.json(result)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}
