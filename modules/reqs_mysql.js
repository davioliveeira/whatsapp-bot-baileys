const createConnection = async () => {
    return await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'test'
    });
}
const getUser = async (msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT user FROM pedido WHERE user = ?', [msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return true;
    return false;
}
const setUser = async (msg, nome) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('INSERT INTO `pedido` (`id`, `user`, `nome`, `local`, `pessoas`,`dataEvento`,`pacote`) VALUES (NULL, ?, ?, "", "","","")', [msg, nome]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return rows[0].user;
    return false;
}
// GROUP PESSOAS 
const getPessoas = async (msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT pessoas FROM pedido WHERE user = ?', [msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return rows[0].pessoas;
    return false;
}
const setPessoas = async (pessoas, msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pedido SET pessoas = ? WHERE pedido.user = ?;', [pessoas, msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });

    if (rows.affectedRows > 0) return true;
    return false;
}
const delPessoas = async (msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pedido SET pessoas = "" WHERE pedido.user = ?;', [msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.affectedRows > 0) return true;
    return false;
}
//GROUP DATA
const getdata = async (msg) =>{
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT dataEvento FROM pedido WHERE user = ?', [msg]);
    delay(1000).then(async function () {
         await connection.end();
         delay(500).then(async function () {
             connection.destroy();
         });
     });
     if (rows.length > 0) return rows[0].dataEvento;
     return false;   
}
const setData = async (data, msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pedido SET dataEvento = ? WHERE pedido.user = ?;', [data, msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });

    if (rows.affectedRows > 0) return true;
    return false;
}
const delData = async (msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pedido SET dataEvento = "" WHERE pedido.user = ?;', [msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.affectedRows > 0) return true;
    return false;
}
// GROUP LOCAL 
const getLocal = async (msg) =>{
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT local FROM pedido WHERE user = ?', [msg]);
    delay(1000).then(async function () {
         await connection.end();
         delay(500).then(async function () {
             connection.destroy();
         });
     });
     if (rows.length > 0) return rows[0].local;
     return false;   
}
const setLocal = async (local, msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pedido SET local = ? WHERE pedido.user = ?;', [local, msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });

    if (rows.affectedRows > 0) return true;
    return false;
}
const delLocal = async (msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pedido SET local = "" WHERE pedido.user = ?;', [msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.affectedRows > 0) return true;
    return false;
}
// GROUP PACOTE
const getPacote = async (msg) =>{
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT pacote FROM pedido WHERE user = ?', [msg]);
    delay(1000).then(async function () {
         await connection.end();
         delay(500).then(async function () {
             connection.destroy();
         });
     });
     if (rows.length > 0) return rows[0].pacote;
     return false;   
}
const setPacote = async (pacote, msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pedido SET local = ? WHERE pedido.user = ?;', [pacote, msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });

    if (rows.affectedRows > 0) return true;
    return false;
}
const delPacote = async (msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pedido SET pacote = "" WHERE pedido.user = ?;', [msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.affectedRows > 0) return true;
    return false;
}
//DELETA TUDO!
const delAll = async (msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pedido SET dataEvento= "", local= "", pacote= "", pessoas = "" WHERE pedido.user = ?;', [msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.affectedRows > 0) return true;
    return false;
}

export { createConnection,
    getUser,setUser,
    getLocal,setLocal,delLocal,
    getPessoas,setPessoas,delPessoas,
    getPacote,setPacote,delPacote,
    getdata,setData,delData,
    delAll
}