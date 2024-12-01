// See https://github.com/typicode/json-server#module
const jsonServer = require('json-server')

const server = jsonServer.create()

// Uncomment to allow write operations
const fs = require('fs')
const path = require('path')
const filePath = path.join('db.json')
const data = fs.readFileSync(filePath, "utf-8");
const db = JSON.parse(data);
const router = jsonServer.router(db)

// Comment out to allow write operations
// const router = jsonServer.router('db.json')

const middlewares = jsonServer.defaults()

server.use(middlewares)
// Add this before server.use(router)
server.use(jsonServer.rewriter({
    '/api/*': '/$1',
    '/blog/:resource/:id/show': '/:resource/:id'
}))
server.use(router)
server.listen(3000, () => {
    console.log('JSON Server is running')
})

// Export the Server API
module.exports = server


// // const jsonServer = require('json-server');
// // const server = jsonServer.create();
// // const router = jsonServer.router('db.json'); // Certifique-se de que o 'db.json' está incluído no deploy
// // const middlewares = jsonServer.defaults();

// // server.use(middlewares);
// // server.use(router);

// // const PORT = process.env.PORT || 3000;
// // server.listen(PORT, () => {
// //   console.log(`JSON Server is running on port ${PORT}`);
// // });

// const jsonServer = require('json-server');
// const server = jsonServer.create();
// const middlewares = jsonServer.defaults();
// const router = jsonServer.router('db.json'); // Usando o arquivo db.json como base

// // Configuração de CORS e Métodos HTTP Permitidos
// server.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*'); // Permite qualquer origem
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Inclui PATCH
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });

// // Configuração do JSON Server para reescrever URLs
// server.use(
//     jsonServer.rewriter({
//         '/api/*': '/$1', // Reescreve rotas para simplificar
//         '/blog/:resource/:id/show': '/:resource/:id'
//     })
// );

// // Middlewares Padrão do JSON Server
// server.use(middlewares);

// // Roteador para Gerenciar Requisições ao db.json
// server.use(router);

// // Inicia o Servidor na Porta Definida
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//     console.log(`JSON Server is running on port ${PORT}`);
// });

// // Exportação para Ambientes Serverless (se necessário)
// module.exports = server;

// // See https://github.com/typicode/json-server#module 
// const jsonServer = require('json-server');

// const server = jsonServer.create();

// // Uncomment to allow write operations
// const fs = require('fs');
// const path = require('path');
// const filePath = path.join('db.json');
// const data = fs.readFileSync(filePath, 'utf-8');
// let db = JSON.parse(data);

// // Função para salvar alterações no arquivo db.json
// const saveDb = (data) => {
//     fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
// };

// // Middlewares
// const middlewares = jsonServer.defaults();
// server.use(middlewares);

// // Adiciona suporte para POST, PUT e DELETE
// server.use(jsonServer.bodyParser);

// // Operações dinâmicas para qualquer recurso
// server.post('/:resource', (req, res) => {
//     const resource = req.params.resource; // Recurso solicitado
//     if (!db[resource]) {
//         return res.status(404).json({ error: `Recurso ${resource} não encontrado` });
//     }
//     const novoItem = req.body;
//     novoItem.id = db[resource].length ? db[resource][db[resource].length - 1].id + 1 : 1; // Gera ID incremental
//     db[resource].push(novoItem); // Adiciona o novo item
//     saveDb(db); // Salva as alterações no arquivo
//     res.status(201).json(novoItem); // Retorna o item criado
// });

// server.put('/:resource/:id', (req, res) => {
//     const resource = req.params.resource;
//     const id = parseInt(req.params.id);
//     if (!db[resource]) {
//         return res.status(404).json({ error: `Recurso ${resource} não encontrado` });
//     }
//     const index = db[resource].findIndex((item) => item.id === id);
//     if (index !== -1) {
//         db[resource][index] = { ...req.body, id }; // Atualiza completamente o item
//         saveDb(db); // Salva as alterações no arquivo
//         res.status(200).json(db[resource][index]); // Retorna o item atualizado
//     } else {
//         res.status(404).json({ error: `Item com ID ${id} não encontrado` });
//     }
// });

// server.delete('/:resource/:id', (req, res) => {
//     const resource = req.params.resource;
//     const id = parseInt(req.params.id);
//     if (!db[resource]) {
//         return res.status(404).json({ error: `Recurso ${resource} não encontrado` });
//     }
//     const index = db[resource].findIndex((item) => item.id === id);
//     if (index !== -1) {
//         const itemRemovido = db[resource].splice(index, 1); // Remove o item
//         saveDb(db); // Salva as alterações no arquivo
//         res.status(200).json(itemRemovido); // Retorna o item removido
//     } else {
//         res.status(404).json({ error: `Item com ID ${id} não encontrado` });
//     }
// });

// // Reescritor de rotas
// server.use(jsonServer.rewriter({
//     '/api/*': '/$1',
//     '/blog/:resource/:id/show': '/:resource/:id'
// }));

// // Roteador padrão para operações GET
// const router = jsonServer.router(db);
// server.use(router);

// server.listen(3000, () => {
//     console.log('JSON Server is running');
// });

// // Export the Server API
// module.exports = server;
