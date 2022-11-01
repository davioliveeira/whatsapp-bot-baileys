
const makeWaSocket = require('@adiwajshing/baileys').default
const { delay, DisconnectReason, fetchLatestBaileysVersion, useMultiFileAuthState, } = require('@adiwajshing/baileys')
const { unlink, existsSync, mkdirSync } = require('fs');
const P = require('pino');
const fs = require('fs');


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
            console.log(CONEXÃO FECHADA! RAZÃO:  + DisconnectReason.loggedOut.toString());
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
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const config = {
        auth: state,
        logger: P({ level: 'error' }),
        printQRInTerminal: true,
        version,
        connectTimeoutMs: 60000,
        auth: state,
        async getMessage(key) {
            return { conversation: 'Oi' };
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
        const nomeUsuario = msg.pushName;
        const jid = msg.key.remoteJid;
        const numero = jid.replace(/\D/g, '');

        if (!msg.key.fromMe && jid !== 'status@broadcast' && !GroupCheck(jid)) {
            sock.readMessages(jid, msg.key.participant, [msg.key.id]);

            const opcoes = [
                { buttonId: 'catalogo', buttonText: { displayText: 'Catálogo' }, type: 1 },
                { buttonId: 'tira_duvida', buttonText: { displayText: 'Tirar Dúvidas' }, type: 1 },
                { buttonId: 'atendente', buttonText: { displayText: 'Falar com Atendente' }, type: 1 },
            ];

            const cat = [
                { buttonId: 'juice', buttonText: { displayText: 'Juices' }, type: 1 },
                { buttonId: 'salt', buttonText: { displayText: 'Salts' }, type: 1 },
                { buttonId: 'pod', buttonText: { displayText: 'Pods' }, type: 1 },
            ];

            if (msg.message.conversation) {
                
            }

            await SendMessage(jid, buttonMessage14);
            if (msg.message.buttonsResponseMessage) {
                if (msg.message.buttonsResponseMessage.selectedDisplayText === 'Catálogo') {
                    const categorias = {
                        text: 'Por favor informe qual é categoria desejada: \n\n\n\n_Se deseja encerrar a conversa digite SAIR_',
                        footer: '© Infinity Vape 🌬💨',
                        buttons: cat,
                        headerType: 1
                    };
    
                    SendMessage(jid, categorias)
                        .then(result => console.log('RESULT: ', result))
                        .catch(err => console.log('ERROR: ', err));
                }
                if (msg.message.buttonsResponseMessage.selectedDisplayText === 'Juices') {
                    const sec_juices = [
                        {
                           title: '*Mago - R$35,00*',
                           rows: [
                              { title: 'Arctic mango 3mg 🥭❄', description: '\nManga docinha com um leve toque de Refrescância', rowId: 'mago1' },
                              { title: 'Cold grape 3mg 🍇❄', description: '\nUvas com um toque de Refrescância', rowId: 'mago2' },
                           ],
                        },
                        {
                           title: '*Mestre - R$35,00*',
                           rows: [
                              { title: 'Fantástico 3mg🍊❄', description: '\nLaranja com um toque de refrescância', rowId: 'mestre1' },
                              { title: 'Halls Cereja 3mg 🍒❄', description: '\nHalls de Cereja', rowId: 'mestre2' },
                           ],
                        },
                        {
                           title: '*Nomad - R$35,00*',
                           rows: [
                              { title: 'Miami 3mg 🍊❄', description: '\nLaranja com um toque de refrescância', rowId: 'nomad1' },
                              { title: 'Barcelona 6mg🍓🍌', description: '\nMorango com Banana', rowId: 'nomad2' },
                           ],
                        }
                     ]
                    const listJuices = {
                        title: cliente + ', a nossa lista de *Juices* está logo abaixo:',
                        text: 'Catálogo de Juices\n',
                        buttonText: 'Catálogo de Juices',
                        footer: '© Infinity Vape 🌬️💨',
                        sections: sec_juices
                     }
                    SendMessage(jid,listJuices)
                }
            }
            // if (msg.message.listResponseMessage) {
    
            //     if (msg.message.listResponseMessage.title === 'Option 1') {
            //         await SendMessage(jid, { text: msg.message.listResponseMessage.title });
            //     }
            // }
    };
}

)}
Connection()
