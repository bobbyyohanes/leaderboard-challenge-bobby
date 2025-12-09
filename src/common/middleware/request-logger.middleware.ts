import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;

      const log = `[${new Date().toISOString()}] ${req.ip} ${req.method} ${
        req.originalUrl
      } ${res.statusCode} - ${duration}ms\n`;

      const logDir = path.join(process.cwd(), 'logs');
      const logFile = path.join(logDir, 'app.log');

      // Pastikan folder logs ada
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
      }

      // Append log ke file
      fs.appendFileSync(logFile, log);
    });

    next();
  }
}
