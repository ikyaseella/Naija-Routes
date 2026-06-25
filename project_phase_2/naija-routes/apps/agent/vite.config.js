import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'

const monorepoRoot = path.resolve(__dirname, '../..')
const i18nDir = path.resolve(monorepoRoot, 'packages/shared/web/i18n')

export default defineConfig({
  server: {
    fs: {
      allow: [monorepoRoot]
    }
  },
  plugins: [
    {
      name: 'serve-i18n',
      configureServer(server) {
        server.middlewares.use('/__i18n', (req, res, next) => {
          const filename = req.url.replace(/^\//, '')
          const filePath = path.join(i18nDir, filename)
          if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'application/json')
            res.setHeader('Cache-Control', 'max-age=3600')
            res.end(fs.readFileSync(filePath, 'utf-8'))
          } else {
            next()
          }
        })
      }
    }
  ]
})
