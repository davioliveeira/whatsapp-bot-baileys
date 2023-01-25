const makeWaSocket = require('@adiwajshing/baileys').default
const { delay, DisconnectReason, fetchLatestBaileysVersion, useMultiFileAuthState, } = require('@adiwajshing/baileys')
const { unlink, existsSync, mkdirSync } = require('fs');
const P = require('pino');  
const fs = require('fs');
const mysql = require('mysql2/promise');


const createConnection = async () => {
    return await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'test'
    });
}

//USER
const getUser = async (msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT user FROM pedido_mago WHERE user = ?', [msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return true;
    return false;
}
//NOME
const setUser = async (msg, nome) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('INSERT INTO `pedido_mago` (`id`, `user`, `nome`, `pacote` ,`dataEvento`, `localEvento`, `qntPessoas`) VALUES ( NULL,?, ?, "", "", "", "")', [msg, nome]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return rows[0].user;
    return false;
}
//localEvento
const getLocal = async (msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT localEvento FROM pedido_mago WHERE user = ?', [msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return rows[0].localEvento;
    return false;
}
const setLocal = async (localEvento, msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pedido_mago SET localEvento = ? WHERE pedido_mago.user = ?;', [localEvento, msg]);
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
    const [rows] = await connection.execute('UPDATE pedido_mago SET localEvento = "" WHERE pedido_mago.user = ?;', [msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.affectedRows > 0) return true;
    return false;
}
//dataEVENTO
const getdataEvento = async (msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT dataEvento FROM pedido_mago WHERE user = ?', [msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return rows[0].dataEvento;
    return false;
}
const setdataEvento = async (dataEvento, msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pedido_mago SET dataEvento = ? WHERE pedido_mago.user = ?;', [dataEvento, msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });

    if (rows.affectedRows > 0) return true;
    return false;
}
const deldataEvento = async (msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pedido_mago SET dataEvento = "" WHERE pedido_mago.user = ?;', [msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.affectedRows > 0) return true;
    return false;
}
//PACOTE
const getPacote = async (msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT pacote FROM pedido_mago WHERE user = ?', [msg]);
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
    const [rows] = await connection.execute('UPDATE pedido_mago SET pacote = ? WHERE pedido_mago.user = ?;', [pacote, msg]);
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
    const [rows] = await connection.execute('UPDATE pedido_mago SET pacote = "" WHERE pedido_mago.user = ?;', [msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.affectedRows > 0) return true;
    return false;
}
//QNTPESSOASS
const getqntPessoas = async (msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT qntPessoas FROM pedido_mago WHERE user = ?', [msg]);
    // console.dir(rows)
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return rows[0].qntPessoas;
    return false;
}
const setqntPessoas = async (qntPessoas, msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pedido_mago SET qntPessoas = ? WHERE pedido_mago.user = ?;', [qntPessoas, msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });

    if (rows.affectedRows > 0) return true;
    return false;
}
const delpessoas = async (msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pedido_mago SET qntPessoas = "" WHERE pedido_mago.user = ?;', [msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.affectedRows > 0) return true;
    return false;
}
//HORARIO
const getHorario = async (msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT hora FROM pedido_mago WHERE user = ?', [msg]);
    // console.dir(rows)
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return rows[0].hora;
    return false;
}
const setHorario = async (hora, msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pedido_mago SET hora = ? WHERE pedido_mago.user = ?;', [hora, msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });

    if (rows.affectedRows > 0) return true;
    return false;
}
const delHorario = async (msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pedido_mago SET hora= "" WHERE pedido_mago.user = ?;', [msg]);
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
    const [rows] = await connection.execute('UPDATE pedido_mago SET dataEvento= "", localEvento= "", pacote= "", qntPessoas = "" WHERE pedido_mago.user = ?;', [msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.affectedRows > 0) return true;
    return false;
}

const GroupCheck = (jid) => {
    const regexp = new RegExp(/^\d{18}@g.us$/)
    return regexp.test(jid)
}

const Update = (sock) => {
    sock.on('connection.update', ({ connection, lastDisconnect, qr }) => {
        if (qr) {
            console.log('Qrcode: ', qr);
        };
        if (connection === 'close') {
            const Reconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
            if (Reconnect) Connection()
            console.log(`CONEXÃO FECHADA! RAZÃO: ` + DisconnectReason.loggedOut.toString());
            if (Reconnect === false) {
                const removeAuth = Path + Auth
                unlink(removeAuth, err => {
                    if (err) throw err
                })
            }
        }
        if (connection === 'open') {
            console.log('BOT CONECTADO')
        }
    })
}

async function Connection() {
    const { version } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState('vex');
    const config = {
        auth: state,
        logger: P({ level: 'error' }),
        printQRInTerminal: true,
        version,
        connectTimeoutMs: 60000,
        auth: state,
        async getMessage(key) {
            return { conversation: 'vex' };
        },
    };
    const sock = makeWaSocket(config);
    Update(sock.ev);
    sock.ev.on('creds.update', saveCreds);

    const SendMessage = async (jid, msg) => {
        await sock.presenceSubscribe(jid);
        await delay(2000);
        await sock.sendPresenceUpdate('composing', jid);
        await delay(1500);
        await sock.sendPresenceUpdate('paused', jid);
        return await sock.sendMessage(jid, msg);
    };


    //Captura usuários - Message upsert 
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
          
        const msg = messages[0];
        const jid = msg.key.remoteJid;
        const cliente = msg.pushName
        const atendente = '5585985456782@s.whatsapp.net'

        try {
            //Aloca os Contatos no Banco.
            const nomeContato = msg.pushName;
            const user = msg.key.remoteJid;
            const getUserFrom = await getUser(user);

            if (getUserFrom === false) {
                await setUser(user, nomeContato);
                  console.log('Usuário armazenado: ' + user + ' - ' + nomeContato)
            }

            if (getUserFrom !== false) {
                
                // console.log('Usuário já foi armazenado')
            }
        } catch (e) {
            console.log('Não foi possível armazenar o usuário' + e)
        }
    //////
        if (!msg.key.fromMe && jid !== 'status@broadcast' && !GroupCheck(jid) ) {
            sock.readMessages(jid, msg.key.participant, [msg.key.id]);
            console.log("MENSAGEM : ", msg)
            

            /* ================================================================ */
            /*=========================== BUTTONS  ============================ */
            /* ================================================================ */
            const btn1 = [{ buttonId: 'pedido', buttonText: { displayText:'Fazer pedido'} },
            { buttonId: 'atendente', buttonText: { displayText:'Redes Sociais'} }]




            /* ================================================================ */
            /*=========================== CONSULTAS =========================== */
            /* ================================================================ */
            const nomeContato = msg.pushName;
            const user = msg.key.remoteJid;
            const sanduiche = await getSanduiche();
            const bebida = await getBebida();
            const doce = await getDoce();
            const pagamentos = await getFormaPagamento();
            const pedido = [
                {title:'Sanduíche', description: 'Escolha as opções'},
                {title:'Bebidas', description: 'Escolha as opções'},
                {title:'Doces', description: 'Escolha as opções'},
                {title:'Forma de pagamento', description: 'Escolher a opção de pagamento'}
                ,{title:'Endereço de entrega', description: 'Enviar a localização'},
                {title:'Reiniciar pedido', description: 'Escolha essa opção para zerar o seu pedido'},
                {title:'Parcial do pedido', description: 'Consultar pedido parcial'},
                {title:'Finalizar pedido', description: 'Encerrar o pedido e enviar para o atendente'}];


            if(msg.message.conversation !== "" && msg.message.conversation){
                if ( msg.message.conversation.toLocaleLowerCase().includes('oi') || msg.message.conversation.toLocaleLowerCase().includes('olá') || msg.message.conversation.toLocaleLowerCase().includes('ola') || msg.message.conversation.toLocaleLowerCase().includes('boa noite') || msg.message.conversation.toLocaleLowerCase().includes('boa tarde') || msg.message.conversation.toLocaleLowerCase().includes('bom dia') || msg.message.conversation.toLocaleLowerCase().includes('manda o cardapio') || msg.message.conversation.toLocaleLowerCase().includes('ta aberto?') || msg.message.conversation.toLocaleLowerCase().includes('funcionando') ){
                    const solicita_pedido = {
                        title: `${nomeContato}, seja bem vindo a VexLanches😋🍕`,
                        text:'\n\nAqui é a Tati 🤖 assitente virtual da VexLanches! Selecione uma das opções abaixo!',
                        buttons: btn1,
                        footer: '© Vex Lanches 😋🍕'
                    }

                }
            }
            if(msg.message.buttonsResponseMessage){
                if(msg.message.buttonsResponseMessage.selectedDisplayText === 'Fazer pedido'){
                    let sections = [{title:'© Comunidade ZDG',rows:pedido}];
                    let list = new List('Olá ' + nomeContato + ', tudo bem? Escolha os itens do seu pedido selecionando uma das opções do menu','Fazer pedido',sections,'Realize o seu Pedido','© Comunidade ZDG');
                

                }
            }

        
        
        }
    //////
    })
}


Connection()