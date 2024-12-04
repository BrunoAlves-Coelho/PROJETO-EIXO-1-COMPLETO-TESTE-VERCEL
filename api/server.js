const jsonServer = require('json-server');
const fs = require('fs');
const path = require('path');

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

const filePath = path.join('db.json');
const data = fs.readFileSync(filePath, 'utf-8');
let db = JSON.parse(data);

// Função para salvar alterações no arquivo db.json
const saveDb = (data) => {
    if (process.env.VERCEL) {
        console.log("Ambiente Vercel detectado. As alterações no db.json não serão persistidas.");
    } else {
        console.log("Salvando alterações no db.json...");
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log("Alterações salvas com sucesso.");
    }
};

// Middlewares
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Operação POST
server.post('/:resource', (req, res) => {
    const resource = req.params.resource;
    console.log(`Recebida solicitação POST no recurso: ${resource}`);
    if (!db[resource]) {
        console.error(`Recurso ${resource} não encontrado.`);
        return res.status(404).json({ error: `Recurso ${resource} não encontrado` });
    }
    const novoItem = req.body;
    novoItem.id = db[resource].length ? db[resource][db[resource].length - 1].id + 1 : 1;
    db[resource].push(novoItem);
    console.log(`Novo item adicionado ao recurso ${resource}:`, novoItem);
    saveDb(db);
    res.status(201).json(novoItem);
});

// Operação PUT
server.put('/:resource/:id', (req, res) => {
    const resource = req.params.resource;
    const id = parseInt(req.params.id);
    console.log(`Recebida solicitação PUT no recurso: ${resource}, ID: ${id}`);
    if (!db[resource]) {
        console.error(`Recurso ${resource} não encontrado.`);
        return res.status(404).json({ error: `Recurso ${resource} não encontrado` });
    }
    const index = db[resource].findIndex((item) => item.id === id);
    if (index !== -1) {
        db[resource][index] = { ...req.body, id };
        console.log(`Item atualizado no recurso ${resource}:`, db[resource][index]);
        saveDb(db);
        res.status(200).json(db[resource][index]);
    } else {
        console.error(`Item com ID ${id} não encontrado no recurso ${resource}.`);
        res.status(404).json({ error: `Item com ID ${id} não encontrado` });
    }
});

// Operação DELETE
server.delete('/:resource/:id', (req, res) => {
    const resource = req.params.resource;
    const id = parseInt(req.params.id);
    console.log(`Recebida solicitação DELETE no recurso: ${resource}, ID: ${id}`);
    if (!db[resource]) {
        console.error(`Recurso ${resource} não encontrado.`);
        return res.status(404).json({ error: `Recurso ${resource} não encontrado` });
    }
    const index = db[resource].findIndex((item) => item.id === id);
    if (index !== -1) {
        const itemRemovido = db[resource].splice(index, 1);
        console.log(`Item removido do recurso ${resource}:`, itemRemovido);
        saveDb(db);
        res.status(200).json(itemRemovido);
    } else {
        console.error(`Item com ID ${id} não encontrado no recurso ${resource}.`);
        res.status(404).json({ error: `Item com ID ${id} não encontrado` });
    }
});

// Reescritor de rotas
server.use(jsonServer.rewriter({
    '/api/*': '/$1',
    '/blog/:resource/:id/show': '/:resource/:id'
}));

// Roteador padrão
const router = jsonServer.router(db);
server.use(router);

server.listen(3000, () => {
    console.log('JSON Server is running on port 3000');
});

// Exporta o servidor
module.exports = server;



// // See https://github.com/typicode/json-server#module
// const jsonServer = require('json-server')

// const server = jsonServer.create()

// // Uncomment to allow write operations
// const fs = require('fs')
// const path = require('path')
// const filePath = path.join('db.json')
// const data = fs.readFileSync(filePath, "utf-8");
// const db = JSON.parse(data);
// const router = jsonServer.router(db)

// // Comment out to allow write operations
// // const router = jsonServer.router('db.json')

// const middlewares = jsonServer.defaults()

// server.use(middlewares)
// // Add this before server.use(router)
// server.use(jsonServer.rewriter({
//     '/api/*': '/$1',
//     '/blog/:resource/:id/show': '/:resource/:id'
// }))
// server.use(router)
// server.listen(3000, () => {
//     console.log('JSON Server is running')
// })

// // Export the Server API
// module.exports = server







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











