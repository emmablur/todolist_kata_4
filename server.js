const http = require('http');
const headers = require('./header');
const { v4: uuidv4 } = require('uuid')
const errorHandler = require('./errorHandler')
const todos = [];

requestListener = (req, res) => {
    let body = ''

    req.on('data', chunk => {
        body += chunk
    })

    if (req.url == '/todos' && req.method == 'GET') {
        res.writeHead(200, headers)
        res.write(JSON.stringify({
            data: todos,
            status: "success"
        }))
        res.end();
    } else if (req.url == '/todos' && req.method == 'POST') {
        try {
            req.on('end', () => {
                const title = JSON.parse(body)
                if (title) {
                    todos.push({
                        title,
                        id: uuidv4()
                    })
                    res.writeHead(200, headers)
                    res.write(JSON.stringify({
                        data: todos,
                        status: "success"
                    }))
                    res.end();
                } else {
                    errorHandler(res, headers)
                }

            })
        } catch (error) {
            errorHandler(res, headers)
        }

    } else if (req.url == '/todos' && req.method == 'DELETE') {
        todos.length = 0
        res.writeHead(200, headers)
        res.write(JSON.stringify({
            data: todos,
            status: "success"
        }))
        res.end();
    } else if (req.url.startsWith('/todos/') && req.method == 'DELETE') {
        const id = req.url.split('/').pop()
        const index = todos.findIndex(todo => todo.id === id)
        if (index != -1) {
            todos.splice(index, 1)
            res.writeHead(200, headers)
            res.write(JSON.stringify({
                data: todos,
                status: "success"
            }))
            res.end();
        } else {
            errorHandler(res, headers)
        }
    } else if (req.url.startsWith('/todos/') && req.method == 'PATCH') {
        try {
           req.on('end', () => {
            const title = JSON.parse(body).title
            const id = req.url.split('/').pop()
            const index = todos.findIndex(todo => todo.id === id)
            if (index != -1 && title) {
                todos[index].title = title
                res.writeHead(200, headers)
                res.write(JSON.stringify({
                    data: todos,
                    status: "success"
                }))
                res.end();
            } else {
                errorHandler(res, headers)
            }
    
           }) 
        } catch {
            errorHandler(res,headers)
        }
    } else if (req.url == '/todos' && req.method == 'OPTIONS') {
        res.writeHead(200, headers)
        res.end()
    } else {
        res.writeHead(404, headers)
        res.write(JSON.stringify({
            message: '無對應路由',
            status: "fail"
        }))
        res.end()
    }
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005)