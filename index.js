//@ts-check
// Package imports
import http from 'node:http'
import process from 'node:process'
import * as fs from 'fs'
import {mkdir} from 'fs/promises'
import * as path from 'path'
import {fileURLToPath} from 'url'
import {buildDev} from './build.js'

(async function() {
    const server = http.createServer()
    const port = Number(process.env.PORT) || 8000
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    server.on('request', async function(req, res) {
        switch (req.url) {
            case '/':
            case '/index.html':
                const read_html = fs.createReadStream('./public/index.html')
                res.writeHead(200, { 'Content-Type': 'text/html' })
                read_html.pipe(res)
                break
            case '/default.js':
                const read_script = await buildDev()
                if (read_script instanceof Error) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' })
                    res.write(read_script.message)
                    return
                }
                res.writeHead(200, { 'Content-Type': 'application/javascript' })
                res.write(read_script)
                res.end()
                break
            default:
                res.writeHead(404, { 'Content-Type': 'text/plain' })
                res.end("Not found!")
                break
        }
    })
    server.listen(port, function() {
        console.log(`Server has started successfully!`)
        console.log(`Forwarded URL: http://localhost:${port}`)
    })
})()