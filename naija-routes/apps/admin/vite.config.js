import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'

const monorepoRoot = path.resolve(__dirname, '../..')
const sharedWeb = path.resolve(monorepoRoot, 'packages/shared/web')

export default defineConfig({
  server: {
    port: 5186,
    fs: {
      allow: [monorepoRoot]
    }
  },
  plugins: [
    {
      name: 'serve-shared',
      configureServer(server) {
        server.middlewares.use('/shared', (req, res, next) => {
          const reqPath = req.url.split('?')[0]
          const filePath = path.join(sharedWeb, reqPath)
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath)
            const mime = {
              '.js': 'application/javascript',
              '.css': 'text/css',
              '.json': 'application/json',
              '.html': 'text/html',
              '.png': 'image/png',
              '.svg': 'image/svg+xml'
            }[ext] || 'application/octet-stream'
            res.setHeader('Content-Type', mime)
            res.setHeader('Cache-Control', 'max-age=3600')
            res.end(fs.readFileSync(filePath))
          } else {
            next()
          }
        })
      }
    }
  ]
})
