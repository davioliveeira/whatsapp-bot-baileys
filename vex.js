const makeWaSocket = require('@adiwajshing/baileys').default
const { delay, DisconnectReason, fetchLatestBaileysVersion, useMultiFileAuthState, } = require('@adiwajshing/baileys')
const { unlink, existsSync, mkdirSync } = require('fs');
const P = require('pino');
const fs = require('fs');
const mysql = require('mysql2/promise');


// const createConnection = async () => {
//     return await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: '',
//         database: 'vex'
//     });
// }

// const getUser = async (msg) => {
//     const connection = await createConnection();
//     const [rows] = await connection.execute('SELECT user FROM pedido WHERE user = ?', [msg]);
//     delay(1000).then(async function () {
//         await connection.end();
//         delay(500).then(async function () {
//             connection.destroy();
//         });
//     });
//     if (rows.length > 0) return true;
//     return false;
// }

// const setUser = async (msg, nome) => {
//     const connection = await createConnection();
//     const [rows] = await connection.execute('INSERT INTO `pedido` (`id`, `user`, `nome`, `itens`, `total`) VALUES (NULL, ?, ?, "", 0)', [msg, nome]);
//     delay(1000).then(async function () {
//         await connection.end();
//         delay(500).then(async function () {
//             connection.destroy();
//         });
//     });
//     if (rows.length > 0) return rows[0].user;
//     return false;
// }

// const getItens = async (msg) => {
//     const connection = await createConnection();
//     const [rows] = await connection.execute('SELECT itens FROM pedido WHERE user = ?', [msg]);
//     delay(1000).then(async function () {
//         await connection.end();
//         delay(500).then(async function () {
//             connection.destroy();
//         });
//     });
//     if (rows.length > 0) return rows[0].itens;
//     return false;
// }

// const setItens = async (itens, msg) => {
//     const connection = await createConnection();
//     const [rows] = await connection.execute('UPDATE pedido SET itens = ? WHERE pedido.user = ?;', [itens, msg]);
//     delay(1000).then(async function () {
//         await connection.end();
//         delay(500).then(async function () {
//             connection.destroy();
//         });
//     });

//     if (rows.affectedRows > 0) return true;
//     return false;
// }

// const delItens = async (msg) => {
//     const connection = await createConnection();
//     const [rows] = await connection.execute('UPDATE pedido SET itens = "" WHERE pedido.user = ?;', [msg]);
//     delay(1000).then(async function () {
//         await connection.end();
//         delay(500).then(async function () {
//             connection.destroy();
//         });
//     });
//     if (rows.affectedRows > 0) return true;
//     return false;
// }

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


    sock.ev.on('messages.upsert', async ({ messages, type }) => {

        const msg = messages[0];
        const jid = msg.key.remoteJid;
        const cliente = msg.pushName
        // const mobile = msg.message.conversation
        // const listResponse = msg.message.listResponseMessage
        // const buttonResponse = msg.message.buttonsResponseMessage
        const atendente = '558596322910@s.whatsapp.net'



        try {
            const nomeContato = msg.pushName;
            const user = msg.key.remoteJid;
            const getUserFrom = await getUser(user);

            if (getUserFrom === false) {
                await setUser(user, nomeContato);
                //   console.log('Usuário armazenado: ' + user + ' - ' + nomeContato)
            }

            if (getUserFrom !== false) {
                //   console.log('Usuário já foi armazenado')
            }
        }
        catch (e) {
            console.log('Não foi possível armazenar o usuário' + e)
        }

        if (!msg.key.fromMe && jid !== 'status@broadcast' && !GroupCheck(jid)) {
            sock.readMessages(jid, msg.key.participant, [msg.key.id]);
            const user = msg.key.remoteJid.replace(/\D/g, '');
            console.log("MENSAGEM : ", msg)

            //================= ÁREAS DE BUTTONS =============//
            const opcoes = [
                { buttonId: 'orcamento', buttonText: { displayText: 'Solicitar Orçamento' }, type: 1.0 },
                { buttonId: 'tira_duvida', buttonText: { displayText: 'Dúvidas Sobre Pacotes' }, type: 1.1 },
                { buttonId: 'atendente', buttonText: { displayText: 'Redes Sociais' }, type: 1.2 },
            ];

            const pacotes = [
                {url: 'https://drive.google.com/file/d/1RNC5gXkOF7KCfSLxouj-0gr0IFIVlo_K/view',buttonText: {displayText:'Pacotes Mago Dos Drinks 🧙🏼‍♂️'}, type: 1},
                { buttonId: 'continua', buttonText: { displayText: 'Continuar Orçamento' }, type: 1.1 },

            ]
            //======================================================//

            // TRATANDO RESPONSES TEXTS
            if (msg.message.conversation) {
                if (msg.message.conversation.toLocaleLowerCase() === 'oi' || 'olá' || 'boa noite' || 'bom dia' || 'boa tarde' || 'ei' || 'ei bb' || 'tem pod?') {
                    const btn_boasvindas = {
                        text: `Olá, *${cliente}* seja bem-vindo!\n\nAqui é a Tati 🤖, atendente virtual do Mago dos Drinks🍸!  Para poder te atender da melhor forma, por favor selecione uma das opções abaixo:`,
                        footer: '© Mago Dos Drinks 🧙🏼‍♂️🍹',
                        buttons: opcoes,
                        headerType: 1
                
                    };
                    await SendMessage(jid, btn_boasvindas);
                }




            // TRATANDO RESPONSES BUTTONS
                if (msg.message.buttonsResponseMessage) {
                
                    if(msg.message.buttonsResponseMessage.selectedDisplayText === 'Solicitar Orçamento'){
                        const info_pacotes = {
                            caption: 'Show! Ficamos muito felizes com o seu interesse de fazer um orçamento com a gente!🤩😍',
                            text: 'Clique no botão abaixo para acessar o nosso *Catálogo*\n\n',
                            buttons: pacotes,
                            footer: '© Mago Dos Drinks 🧙🏼‍♂️🍹',
                        }

                    }

                }  
            }
        }
    });
}


Connection()