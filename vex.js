const makeWaSocket = require('@adiwajshing/baileys').default
const { delay, DisconnectReason, fetchLatestBaileysVersion, useMultiFileAuthState, } = require('@adiwajshing/baileys')
const { unlink, existsSync, mkdirSync } = require('fs');
const P = require('pino');
const fs = require('fs');
const mysql = require('mysql2/promise');
const { title } = require('process');


const createConnection = async () => {
    return await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'test'
    });
}
// GROUP USER 
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
    const [rows] = await connection.execute('INSERT INTO `pedido` (`id`, `user`, `nome`, `itens`, `total`) VALUES (NULL, ?, ?, "", 0)', [msg, nome]);
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
    const [rows] = await connection.execute('SELECT data FROM pedido WHERE user = ?', [msg]);
    delay(1000).then(async function () {
         await connection.end();
         delay(500).then(async function () {
             connection.destroy();
         });
     });
     if (rows.length > 0) return rows[0].data;
     return false;   
}
const setData = async (data, msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pedido SET data = ? WHERE pedido.user = ?;', [data, msg]);
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
    const [rows] = await connection.execute('UPDATE pedido SET data = "" WHERE pedido.user = ?;', [msg]);
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
        const mobile = msg.message.conversation
        const listResponse = msg.message.listResponseMessage
        const buttonResponse = msg.message.buttonsResponseMessage
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
            const url_pacotes = 'https://tinyurl.com/mago-dos-drinks-pacotes'
            console.log("MENSAGEM : ", msg)

            //================= ÁREAS DE BUTTONS =============//
            const opcoes = [
                { buttonId: 'orcamento', buttonText: { displayText: 'Solicitar Orçamento' }, type: 1.0 },
                { buttonId: 'tira_duvida', buttonText: { displayText: 'Dúvidas Sobre Pacotes' }, type: 1.1 },
                { buttonId: 'atendente', buttonText: { displayText: 'Redes Sociais' }, type: 1.2 },
            ];


            const btn_continue = [
                { buttonId: 'continua', buttonText: { displayText: 'Continuar Orçamento' }, type: 1.1 },

            ]
            //======================================================//

            // TRATANDO RESPONSES TEXTS
            if (msg.message.conversation || msg.message.extendedTextMessage) {
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
                        const step_one = {
                            text: '*Show! Ficamos muito felizes com o seu interesse de fazer um orçamento com a gente!* 🤩😍\n👉🏻'+ url_pacotes +'\n_Após verificar o link, é so clicar em Continuar para seguir com a solicitação.',
                            buttons: btn_continue,
                            footer: '© Mago Dos Drinks 🧙🏼‍♂️🍹',
                        }
                        await SendMessage(jid,step_one)
                    }
                    if(buttonResponse === 'Continuar Orçamento'){
                        const pessoas = [ 
                            {
                                title: 'Selecione a quantidade de pessoas do Evento',
                                rows: [
                                    { title: '50 pessoas'},
                                    { title: '100 pessoas'},
                                    { title: '150 pessoas'},
                                    { title: '200 pessoas'},
                                    { title: '250 pessoas'},
                                    { title: '300 pessoas'},
                                    { title: '+350 pessoas'},
                                ]
                            }
                        ]
                        SendMessage(jid, {msg:'Massa! Então vamos lá! Vou te encaminhar apenas algumas perguntas para facilitar o seu atendimento!'})
                        const step_qntPessoas ={
                            text:`${cliente},\nPor favor, selecione abaixo a *Quantidade de Convidados* do seu evento.\n_*Obs.:* Se não houver a opção desejada basta selecionar a que mais aproxima-se à sua necessidade!.🧙🏻‍♂️🍹`,
                            buttonText:'CLIQUE AQUI PARA ESCOLHER',
                            footer: '© Mago Dos Drinks 🧙🏼‍♂️🍹',
                            sections: pessoas
                        }
                        SendMessage(jid,step_qntPessoas)
                    }

                }
                
            // TRATANDO AS LIST RESPONSES
                    if(listResponse){
                        if(listResponse.title.includes('pessoas')){
                            delay(1000).then(async function() {
                               const qntPessoas = await setPessoas(jid)
                               console.dir(qntPessoas) 
                            });
                            delay(1000).then(async function(){
                                const qntPessoas = await getPessoas(jid)
                                const localEvento = await getLocal(jid)
                                const pacote = await getPacote(jid)
                                const dataEvento = await getdata(jid)
                                const progress = {
                                    text: `*INFORMAÇÕES DO SEU EVENTO:*\n➡️Quantidade de Convidados:\n${qntPessoas}\n➡️Local do Evento:\n${localEvento}\n➡️Data do Evento:\n${dataEvento}\n➡️Pacote:\n${pacote}`, 
                                }
                                SendMessage(jid,progress)
                            });
                            const location = {
                                text: 'Agora informe o *Local* onde será realizado seu Evento.\nPor favor, nos envie o endereço através da *Localização Fixa* do seu Whatsapp.\n_*Obs*.: Para enviar a localização fixa do local basta ir em localização no seu Whatsapp e digitar o endereço na barra de pesquisa.🧙🏻‍♂️🍹'
                            }
                            SendMessage(jid,location)
                        }
                    }

            }
        }
    });
}


Connection()