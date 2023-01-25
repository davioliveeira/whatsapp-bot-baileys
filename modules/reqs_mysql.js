



const getUser = async (msgfom) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT user FROM pastelaria WHERE user = ?', [msgfom]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return true;
    return false;
}

const setUser = async (msgfom, nome) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('INSERT INTO `pastelaria` (`id`, `user`, `nome`, `itens`, `pagamento`, `localizacao`,  `total`) VALUES (NULL, ?, ?, "", 0, 0, 0)', [msgfom, nome]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return rows[0].user;
    return false;
}

const getPastel = async () => {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT title, description FROM pastel');
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return rows;
    return false;
}

/////////////////////////////////////////////////
const setTipo = async (tipo, msgfom) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pastelaria SET tipo_pastel = ? WHERE pastelaria.user = ?;', [tipo, msgfom]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.affectedRows > 0) return true;
    return false;
}

const getTipo = async (msgfom) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT tipo_pastel FROM pastelaria WHERE user = ?', [msgfom]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return rows[0].tipo_pastel;
    return false;
}
const delTipo = async (msgfom) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pastelaria SET tipo_pastel = "" WHERE pastelaria.user = ?;', [msgfom]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return true;
    return false;
}
//////////////////////////////////////////////////////
/////////////////////////////////////////////////
const setOpcao = async (opcao, msgfom) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pastelaria SET opcao_sabores = ? WHERE pastelaria.user = ?;', [opcao, msgfom]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.affectedRows > 0) return true;
    return false;
}

const getOpcao = async (msgfom) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT opcao_sabores FROM pastelaria WHERE user = ?', [msgfom]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return rows[0].opcao_sabores;
    return false;
}
const delOpcao = async (msgfom) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pastelaria SET opcao_sabores = "" WHERE pastelaria.user = ?;', [msgfom]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return true;
    return false;
}
//////////////////////////////////////////////////////
const set_tipo_pastel = async (total, msgfom) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE tipo_pastel SET title = ? WHERE pastelaria.user = ?;', [total, msgfom]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.affectedRows > 0) return true;
    return false;
}

const get_tipo_pastel = async (msgfom) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT title, description FROM tipo_pastel');
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return rows;
    return false;
}

const getBebida = async (msgfom) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT title, description FROM bebidas');
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return rows;
    return false;
}


const getFormaPagamento = async (msgfom) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT title, description FROM forma_pagamento');
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return rows;
    return false;
}

const getTotal = async (msgfom) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT total FROM pastelaria WHERE user = ?', [msgfom]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return rows[0].total;
    return false;
}

const setTotal = async (total, msgfom) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pastelaria SET total = ? WHERE pastelaria.user = ?;', [total, msgfom]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.affectedRows > 0) return true;
    return false;
}

const delTotal = async (msgfom) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pastelaria SET total = 0 WHERE pastelaria.user = ?;', [msgfom]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return true;
    return false;
}

const getItens = async (msgfom) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT itens FROM pastelaria WHERE user = ?', [msgfom]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return rows[0].itens;
    return false;
}

const setItens = async (itens, msgfom) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pastelaria SET itens = ? WHERE pastelaria.user = ?;', [itens, msgfom]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.affectedRows > 0) return true;
    return false;
}

const delItens = async (msgfom) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pastelaria SET itens = "" WHERE pastelaria.user = ?;', [msgfom]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return true;
    return false;
}

const getPagamento = async (msgfom) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT forma_pagamento FROM pastelaria WHERE user = ?', [msgfom]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return rows[0].forma_pagamento;
    return false;
}

const setPagamento = async (pagamento, msgfom) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pastelaria SET forma_pagamento = ? WHERE pastelaria.user = ?;', [pagamento, msgfom]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.affectedRows > 0) return true;
    return false;
}

const delPagamento = async (msgfom) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pastelaria SET forma_pagamento = "" WHERE pastelaria.user = ?;', [msgfom]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return true;
    return false;
}

const setLocalizacao = async (localizacao, msgfom) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pastelaria SET localizacao = ? WHERE pastelaria.user = ?;', [localizacao, msgfom]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.affectedRows > 0) return true;
    return false;
}

const delLocalizacao = async (msgfom) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pastelaria SET localizacao = "" WHERE pastelaria.user = ?;', [msgfom]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return true;
    return false;
}

const getLocalizacao = async (msgfom) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT localizacao FROM pastelaria WHERE user = ?', [msgfom]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return rows[0].localizacao;
    return false;
}

const setPedido = async (msgfom, nome, itens, pagamento, localizacao, total) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('INSERT INTO `pastelaria_full` (`id`, `user`, `nome`, `itens`, `forma_pagamento`, `localizacao`,  `total`) VALUES (NULL, ?, ?, ?, ?, ?, ?)', [msgfom, nome, itens, pagamento, localizacao, total]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.affectedRows > 0) return rows[0].user;
    return false;
}

module.export = {
    getUser,
    setUser,
    getPastel,
    setTipo,
    getTipo,
    delTipo,
    setOpcao,
    getOpcao,
    delOpcao,
    set_tipo_pastel,
    get_tipo_pastel,
    getBebida,
    getFormaPagamento,
    getTotal,
    setTotal,
    delTotal,
    getItens,
    setItens,
    delItens,
    getPagamento,
    setPagamento,
    delPagamento,
    setLocalizacao,
    delLocalizacao,
    getLocalizacao,
    setPedido,
    delAll,
}