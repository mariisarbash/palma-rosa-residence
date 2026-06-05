import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const icalHandler = require('./api/ical.js')


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

function vercelApiDevServer() {
  return {
    name: 'vercel-api-dev-server',
    configureServer(server) {
      server.middlewares.use('/api/ical', (req, res) => {
        const requestUrl = new URL(req.url || '', 'http://localhost')
        const mockReq = {
          method: req.method,
          query: {
            apt: requestUrl.searchParams.get('apt') || '',
          },
        }
        const mockRes = {
          statusCode: 200,
          setHeader(name, value) {
            res.setHeader(name, value)
          },
          status(code) {
            this.statusCode = code
            return this
          },
          json(payload) {
            res.statusCode = this.statusCode
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(payload))
            return this
          },
          end() {
            res.statusCode = this.statusCode
            res.end()
            return this
          },
        }

        Promise.resolve(icalHandler(mockReq, mockRes)).catch((error) => {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: error.message || 'dev_api_failed' }))
        })
      })
    },
  }
}

export default defineConfig({
  publicDir: path.resolve(__dirname, './public'),
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    vercelApiDevServer(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  // Long-term caching: split big vendors into their own chunks so a code
  // change in app/* doesn't invalidate the (large) library chunks.
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router'],
          'motion-vendor': ['motion'],
          'leaflet-vendor': ['leaflet', 'react-leaflet'],
          'daypicker-vendor': ['react-day-picker', 'date-fns'],
        },
      },
    },
  },
})
