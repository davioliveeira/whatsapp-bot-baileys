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


    sock.ev.on('messages.upsert', async ({ messages, type }) => {

        const msg = messages[0];
        const jid = msg.key.remoteJid;
        const numero = jid.replace(/\D/g, '');
        const cliente = msg.pushName
        const mobile = msg.message.conversation
        const listResponse = msg.message.listResponseMessage
        const buttonResponse = msg.message.buttonsResponseMessage



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
                // {url: 'https://drive.google.com/file/d/1RNC5gXkOF7KCfSLxouj-0gr0IFIVlo_K/view',buttonText: {displayText:'Pacotes Mago Dos Drinks 🧙🏼‍♂️'}, type: 1},
                { buttonId: 'continua', buttonText: { displayText: 'Continuar Orçamento' }, type: 1.1 },
            ]
            
            const confirma = [
                {buttonId:'sair', buttonText:{displayText:'Confirmar Solicitação'}},
            ]

            //======================================================//

            // TRATANDO RESPONSES TEXTS
            if (msg.message.conversation) {
                if (msg.message.conversation === 'Oi' || 'Olá' || 'Boa noite' || 'Bom dia' || 'Boa tarde' && msg.message.conversation !== 'Data:') {
                    await delAll(jid)
                    const btn_boasvindas = {
                        text: `Olá, *${cliente}* seja bem-vindo!\n\nAqui é a Tati 🤖, atendente virtual do Mago dos Drinks🍸!  Para poder te atender da melhor forma, por favor selecione uma das opções abaixo:`,
                        footer: '© Mago Dos Drinks 🧙🏼‍♂️🍹',
                        buttons: opcoes,
                       
                    };
                    await SendMessage(jid, btn_boasvindas);
                }
                if(mobile.toLocaleLowerCase().includes('data:')){
                    const fullData = mobile.split(':')
                    const data = fullData[1]
                    await setdataEvento(data,jid)
                    delay(1000).then(async function () {
                        const qntPessoa = await getqntPessoas(jid);
                        const local = await getLocal(jid)
                        const data = await getdataEvento(jid)
                        // const hora = await getHorario(jid)
                        const pacote = await getPacote(jid)
                        const pedido_mago = {
                            text: `*INFORMAÇÕES DO SEU EVENTO:*\n\n➡️ *Quantidade de Convidados*:\n${qntPessoa}\n➡️ *Local*:\n${local}\n➡️ *Data*:\n${data}\n➡️ *Pacote*:\n${pacote}`,
                            footer: '© Infinity Vape 🌬️💨',
                        }
                        SendMessage(jid, pedido_mago)
                    });
                    delay(2000).then(async function () {
                        const pacoteEvento = [
                            {
                                title: 'PACOTES DISPONÍVEIS',
                                rows: [
                                    {title: 'Pacote - 1',},
                                    {title: 'Pacote - 2',},
                                    {title: 'Pacote - 3',},
                                    {title: 'Pacote - 4',},
                                    {title: 'Pacote - Chopp',},
                                ]
                            }
                        ]
                        const pacote = {
                            text:'Por fim, selecione o *Pacote* desejado.\n\n_*Obs.:* Se não houver a opção desejada basta marcar uma que mais se aproxime à sua necessidade.🧙🏼‍♂️🍹_',
                            buttonText: 'CLIQUE AQUI PARA ESCOLHER',
                            footer: '© Mago Dos Drinks 🧙🏼‍♂️🍹',
                            sections: pacoteEvento
                        }
                        SendMessage(jid,pacote)
                    })

                }
            }

            // TRATANDO RESPONSES BUTTONS
            if (msg.message.buttonsResponseMessage) {
            if (buttonResponse.selectedDisplayText === 'Solicitar Orçamento') {
                const categorias = {
                    text: '*Show! Ficamos muito felizes com o seu interesse de fazer um orçamento com a gente*!🤩😍\n\n👉https://tinyurl.com/mago-dos-drinks-pacotes\n\n_Após verificar o link, é so clicar em Continuar para seguir com a solicitação._',
                    footer: '© Mago Dos Drinks 🧙🏼‍♂️🍹',
                    buttons: pacotes
                };
                    SendMessage(jid,categorias)
                        .then(result => console.log('RESULT: ', result))
                        .catch(err => console.log('ERROR: ', err))
                }
            if(buttonResponse.selectedDisplayText === 'Continuar Orçamento') {
                const pessoasEvento = [
                    {
                        title: 'QUANTIDADE DE PESSOAS',
                        rows: [
                            {title: '50 pessoas',},
                            {title: '100 pessoas',},
                            {title: '150 pessoas',},
                            {title: '200 pessoas',},
                            {title: '250 pessoas',},
                            {title: '300 pessoas',},
                            {title: '350 pessoas',},
                            {title: '400 pessoas',},
                            {title: '+ 450 pessoas',},
                        ]
                    }
                ]
                const listaPessoas = {
                  title: `${cliente},`,
                  text: 'Por favor selecione abaixo a *Quantidade* de pessoas do seu Evento.\n\n_*Obs.:* Se não houver a opção desejada basta marcar uma que mais se aproxime à sua necessidade.🧙🏼‍♂️🍹_',
                  buttonText: 'CLIQUE AQUI PARA ESCOLHER',
                  footer: '© Mago Dos Drinks 🧙🏼‍♂️🍹',
                  sections: pessoasEvento
                };
                SendMessage(jid,{text: 'Massa! Vou te encaminhar apenas algumas perguntas padrões para facilitar seu atendimento!'})
                delay(2000).then(async function () {
                    SendMessage(jid,listaPessoas)
                })
                }
            
            }
            if(msg.message.locationMessage){
                delay(1000).then(async function () {
                const local = 'https://www.google.com/maps/search/?api=1&query='+msg.message.locationMessage.degreesLatitude+','+msg.message.locationMessage.degreesLongitude;
                await setLocal(local,jid)
                })
                delay(1000).then(async function () {
                    const qntPessoa = await getqntPessoas(jid);
                    const local = await getLocal(jid)
                    const data = await getdataEvento(jid)
                    
                    const pacote = await getPacote(jid)
                    const pedido_mago = {
                        text: `*INFORMAÇÕES DO SEU EVENTO:*\n\n➡️ *Quantidade de Convidados*:\n${qntPessoa}\n➡️ *Local*:\n${local}\n➡️ *Data*:\n${data}\n➡️ *Pacote*:\n${pacote}`,
                        footer: '© Infinity Vape 🌬️💨',
                    }
                    SendMessage(jid, pedido_mago)
                });
                delay(2000).then(async function () {
                    const local = {
                        text:'Estamos quase lá, informe a *Data* na qual será realizado seu Evento.\n(Ex: "Data: 23/03/2023")\n\n_Obs.: Por favor siga o modelo informado no exemplo.🧙🏼‍♂️🍹_'
                    }
                    SendMessage(jid,local)
                })
            }
            if (listResponse) {
              if (listResponse.title.includes('pessoas')) {
                const titleList =  msg.message.listResponseMessage.title
                delay(1000).then(async function () {
                    const pessoas = await getqntPessoas(jid)
                    if(pessoas == ''){
                        await setqntPessoas(titleList,jid)
                    }
                    else{
                        await setqntPessoas(titleList,jid)  
                    }
                   
                });
                delay(1000).then(async function () {
                    const qntPessoa = await getqntPessoas(jid);
                    const local = await getLocal(jid)
                    const data = await getdataEvento(jid)
                    // const hora = await getHorario(jid)
                    const pacote = await getPacote(jid)
                    const pedido_mago = {
                        text: `*INFORMAÇÕES DO SEU EVENTO:*\n\n➡️ *Quantidade de Convidados*:\n${qntPessoa}\n➡️ *Local*:\n${local}\n➡️ *Data*:\n${data}\n➡️ *Pacote*:\n${pacote}`,
                    }
                    SendMessage(jid, pedido_mago)
                });
                delay(2000).then(async function () {
                const local = {
                    text:'Agora informe o *Local* onde será realizado seu Evento.\n\nPor favor, envie a localização através da Localização fixa do seu WhatsApp.\n\n_Obs.: Para enviar a localização fixa do local basta ir em localização e digitar o endereço na barra de pesquisa.🧙🏼‍♂️🍹_'
                }
                SendMessage(jid,local)
                })

            }

            if (listResponse.title.includes('Pacote')) {
                delay(1000).then(async function () {
                    const pacote = await getPacote(jid);
                    // console.dir(pacote)
                    if (pacote == '') {
                        await setPacote(msg.message.listResponseMessage.title, jid)
                    }
                    else {
                        await setPacote(msg.message.listResponseMessage.title, jid)
                    }
                })
                delay(2000).then(async function () {
                    const qntPessoa = await getqntPessoas(jid);
                    const local = await getLocal(jid)
                    const data = await getdataEvento(jid)
                    // const hora = await getHorario(jid)
                    const pacote = await getPacote(jid)
                    const pedido_mago = {
                        title: '*Seu solicitação de Orçamento foi finalizada e enviada para um dos Atendentes!*',
                        text: `*INFORMAÇÕES DO SEU EVENTO:*\n\n➡️ *Quantidade de Convidados*:\n${qntPessoa}\n➡️ *Local*:\n${local}\n➡️ *Data*:\n${data}\n➡️ *Pacote*:\n${pacote}`,
                        footer: '© Mago Dos Drinks 🧙🏼‍♂️🍹',
                        buttons: confirma,
                    }
                    SendMessage(jid, pedido_mago)
                })
            }
           
            }
    }
  });
}


Connection()