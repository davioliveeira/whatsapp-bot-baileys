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
		database: 'vex'
	});
}

const getUser = async (msg) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT user FROM pedido WHERE user = ?', [msg]);
  delay(1000).then(async function() {
		await connection.end();
		delay(500).then(async function() {
		connection.destroy();
		});
	});
	if (rows.length > 0) return true;
	return false;
}

const setUser = async (msg, nome) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('INSERT INTO `pedido` (`id`, `user`, `nome`, `itens`, `total`) VALUES (NULL, ?, ?, "", 0)', [msg, nome]);
  delay(1000).then(async function() {
		await connection.end();
		delay(500).then(async function() {
		connection.destroy();
		});
	});
	if (rows.length > 0) return rows[0].user;
	return false;
}

const getItens = async (msg) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT itens FROM pedido WHERE user = ?', [msg]);
    delay(1000).then(async function() {
		await connection.end();
		delay(500).then(async function() {
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows[0].itens;
	return false;
}

const setItens = async (itens, msg) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('UPDATE pedido SET itens = ? WHERE pedido.user = ?;', [itens, msg]);
    delay(1000).then(async function() {
		await connection.end();
		delay(500).then(async function() {
		connection.destroy();
		});
	});
	if (rows.length > 0) return true;
	return itens;
}

const delItens = async (msg) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('UPDATE pedido SET itens = "" WHERE pedido.user = ?;', [msg]);
    delay(1000).then(async function() {
		await connection.end();
		delay(500).then(async function() {
		connection.destroy();
		});
	});
	if (rows.length > 0) return true;
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
        const web = msg.message.extendedTextMessage
        const mobile = msg.message.conversation
        const listResponse = msg.message.listResponseMessage
        const buttonResponse = msg.message.buttonsResponseMessage

        
        
        try{
            const nomeContato = msg.pushName;
            const user = msg.key.remoteJid;
            const getUserFrom = await getUser(user);
        
            if (getUserFrom === false) {
              await setUser(user, nomeContato);
              console.log('Usuário armazenado: ' + user + ' - ' + nomeContato)
            }
        
            if (getUserFrom !== false) {
              console.log('Usuário já foi armazenado')
            }
          }
        catch(e){
            console.log('Não foi possível armazenar o usuário' + e)
          }

        if (!msg.key.fromMe && jid !== 'status@broadcast' && !GroupCheck(jid)) {
            sock.readMessages(jid, msg.key.participant, [msg.key.id]);
            const user = msg.key.remoteJid.replace(/\D/g, '');
            // console.log("MENSAGEM : ", msg)

            //================= ÁREAS DE BUTTONS =============//
            const opcoes = [
                { buttonId: 'catalogo', buttonText: { displayText: 'Catálogo' }, type: 1.0 },
                { buttonId: 'tira_duvida', buttonText: { displayText: 'Tirar Dúvidas' }, type: 1.1 },
                { buttonId: 'atendente', buttonText: { displayText: 'Falar com Atendente' }, type: 1.2 },
            ];

            const cart = [
                // { buttonId: 'continua', buttonText: { displayText: 'Adicionar ao Carrinho' }, type: 1.0 },
                { buttonId: 'finaliza', buttonText: { displayText: 'Finalizar Pedido' }, type: 1.1 },
                { buttonId: 'exit', buttonText: { displayText: 'Sair' }, type: 1.2 },
            ];
            const btns_finaliza = [
                { buttonId: 'continua', buttonText: { displayText: 'Continuar' }, type: 1.1 },
                { buttonId: 'finaliza', buttonText: { displayText: 'Finalizar Pedido' }, type: 1.1 },
                { buttonId: 'exit', buttonText: { displayText: 'Sair' }, type: 1.2 },
            ]

            const cat = [
                { buttonId: 'juice', buttonText: { displayText: 'Juices' }, type: 1.3 },
                { buttonId: 'salt', buttonText: { displayText: 'Salts' }, type: 1.4 },
                { buttonId: 'pod', buttonText: { displayText: 'Pods' }, type: 1.5 },
            ];

            //======================================================//

            // TRATANDO RESPONSES TEXTS
            if (msg.message.conversation) {
                if (mobile.toLocaleLowerCase() === 'oi' || 'olá' || 'boa noite' || 'bom dia' || 'boa tarde') {
                    const btn_boasvindas = {
                        text: `Olá, *${cliente}* .Seja bem-vindo a Infinity Vape 💨!\n\nAqui é a Tati 🤖, atendente virtual da Infinity Vape 🌬️💨!  Para poder te atender da melhor forma, por favor digite o número ou nome de uma das opções abaixo:`,
                        footer: '© Infinity Vape 🌬️💨',
                        buttons: opcoes,
                        headerType: 1
                    };
                    await SendMessage(jid, btn_boasvindas);
                }
            }




        // TRATANDO RESPONSES BUTTONS
            if (msg.message.buttonsResponseMessage) {
                if (buttonResponse.selectedDisplayText === 'Catálogo') {
                    const categorias = {
                        text: 'Por favor informe qual é categoria desejada: \n\n\n\n_Se deseja encerrar a conversa digite SAIR_',
                        footer: '© Infinity Vape 🌬️💨',
                        buttons: cat,
                        headerType: 1
                    };
                    SendMessage(jid, categorias)
                        .then(result => console.log('RESULT: ', result))
                        .catch(err => console.log('ERROR: ', err))
                }
                if (buttonResponse.selectedDisplayText === 'Juices') {
                    const sec_juices = [
                        {
                            title: 'Mago - R$35,00',
                            rows: [
                                { title: 'Arctic Mango 3mg 🥭❄', description: '\nJuice de manga com um leve frescor.', rowId: 'mago' },
                                { title: 'Cold grape 3mg 🍇❄', description: '\nJuice de uva refrescante.', rowId: 'mago' },
                                { title: 'Artic Pine 3mg 🍇❄', description: '\nJuice de uva refrescante.', rowId: 'mago' },
                                { title: 'Artic Mint  3mg🍃❄', description: '\nJuice de menta refrescante.', rowId: 'mago' },
                                { title: 'Ice Melons 3mg🍉🍈❄', description: '\nJuice docinho de melão e melancia.', rowId: 'mago' },
                                { title: 'Artic Mint  6mg🍃❄', description: '\nJuice de menta refrescante.', rowId: 'mago' },
                                { title: 'Cold Grape 6mg 🍇❄', description: '\nJuice de uva refrescante.', rowId: 'mago' },
                                { title: 'Arctic Mango 6mg 🥭❄', description: '\nJuice de manga com um leve frescor.', rowId: 'mago'},
                                { title: 'Ice Melons 3mg🍉🍈❄', description: '\nJuice docinho de melão e melancia.', rowId: 'mago' },
                                { title: 'Artic Red  6mg🍓❄', description: '\nJuice de morango refrescante.', rowId: 'mago' },
                            
                            ],
                        },
                        {
                            title: 'Mestre - R$35,00',
                            rows: [
                                { title: 'Fantástico 3mg🍊❄', description: '\nJuice Laranja com um toque de refrescância.', rowId: 'mestre' },
                                { title: 'Halls Cereja 3mg 🍒❄', description: '\nJuice de cereja com um frescor inigualável.', rowId: 'mestre' },
                                { title: 'Frutas Vermelhas 3mg🍓🍉🍒❄', description: '\nJuice de morango framboesa e amora com um toque refrescante', rowId: 'mestre' },
                                { title: 'Manga Ice 3mg🥭❄', description: '\nJuice de manga docinha com um toque refrescante', rowId: 'mestre' },
                                { title: 'Grapette 3mg🍇❄', description: '\njuice de uva refrescante', rowId: 'mestre' },
                                { title: 'Tridente 3mg🍃❄', description: '\nJuice de hortelã muito refrescante.', rowId: 'mestre' },
                                { title: 'Frutas Vermelhas com Morango 3mg🍓🍎🍒🍉❄', description: '\nJuice de morango framboesa e amora com um toque a mais de morango.', rowId: 'mestre' },
                                { title: 'Limão Ice 3mg 🍋❄', description: '\nJuice de limao refrescante.', rowId: 'mestre' },
                                { title: 'Halls Cereja 6mg 🍒❄', description: '\nJuice de cereja com um frescor inigualável.', rowId: 'mestre' },
                                { title: 'Frutas Vermelhas 3mg🍓🍉🍒❄', description: '\nJuice de morango franboesa e amora com um toque refrescante', rowId: 'mestre' },                        ],
                        },
                        {
                            title: 'Nomad - R$35,00',
                            rows: [
                                { title: 'Miami 3mg 🍊❄', description: '\nJuice de goiaba e tangerina refrescante.', rowId: 'nomad1' },
                                { title: 'Miami 6mg 🍊❄', description: '\nJuice de goiaba e tangerina refrescante.', rowId: 'nomad1' },
                                { title: 'Barcelona 6mg🍓🍌', description: '\nJuice de chiclete de morango com banana refrescante.', rowId: 'nomad2' },
                            ],
                        }
                    ];
                    const listJuices = {
                        text: 'Nosso Catálogo de *Juices* está logo abaixo!\n\n',
                        buttonText: 'Ver Catálogo de Juices',
                        footer: '© Infinity Vape 🌬️💨',
                        sections: sec_juices,
                        type:1
                    };
                    SendMessage(jid, listJuices)
                        .then(result => console.log('RESULT: ', result))
                        .catch(err => console.log('ERROR: ', err));
                }
                if (buttonResponse.selectedDisplayText === 'Salts') {
                    const sec_salts = [
                        {
                            title: 'Mago - R$40,00',
                            rows: [
                             { title: 'ARCTIC MANGO 50mg 🥭❄', description: '\nSalt de manga com um leve frescor.', rowId: 'mago' },
                             { title: 'COLD MINT 50mg 🍃❄', description: '\nNicksalt de menta muito refrescante. ', rowId: 'mago' },
                             { title: 'ARCTIC RED 50mg🍓❄', description: '\nNicksalt de morango refrescante.', rowId: 'mago' },
                             { title: 'BANANA ICE 35mg🍌❄', description: '\nNicksalt de banana refrescante.', rowId: 'mago' },
                             { title: 'ICE MELONS 35mg🍈🍉❄', description: '\nNicksalt de melão e melancia refrescante.', rowId: 'mago' },
                            ],
                        },
                        {
                            title: 'Mestre - R$40,00',
                            rows: [
                                { title: 'TRIDENT 35mg 🍃❄', description: '\nNicksalt de hortelã refrescante.', rowId: 'mestre' },
                                { title: 'MAÇÃ VERDE 35mg🍏❄', description: '\nNicksalt de maçã verde deliciosa ', rowId: 'mestre' },
                                { title: 'HALLS CEREJA 35mg🍒❄', description: '\nNicksalt de cereja muito refrescante.', rowId: 'mestre' },
                                { title: 'MANGA ICE 50mg🥭❄', description: '\nNicksalt de maga docinha e refrescante.', rowId: 'mestre' },
                                { title: 'MAÇÃ VERDE 50mg🍏❄', description: '\nNicksalt de maçã verde deliciosa ', rowId: 'mestre' },
                            ],
                        },
                    ];
                        const listSalt = {
                            text: 'Nosso Catálogo de *Salts* está logo abaixo!\n\n',
                            buttonText: 'Ver Catálogo de Salts',
                            footer: '© Infinity Vape 🌬️💨',
                            sections: sec_salts
                        };
                        SendMessage(jid, listSalt)
                            .then(result => console.log('RESULT: ', result))
                            .catch(err => console.log('ERROR: ', err));
                }
                if (buttonResponse.selectedDisplayText === 'Pods') {
                    const sec_pod = [
                    {
                        title: 'THE BLACK SHEEP 600 PUFFS - R$ 60,00 ( 2 por R$ 100,00)',
                        rows: [
                            { title: 'Morango 🍓❄', description: '\n_Pod de morango refrescante._.', rowId: 'tbs600' },
                            { title: 'Frutas Vermelhas 🍎🍇🍒❄',  description: '\n_Pod de morango amora e framboesa._', rowId: 'tbs600' },
                            { title: 'Pêssego 🍑', description: '\n_Pod refrescante de pessego_.', rowId: 'tbs600' },
                            // {title: '',description:'',rowId:''},
                        ],
                    },
                    {
                        title: 'THE BLACK SHEEP 1.500 PUFFS - R$ 90,00 ( 2 por R$ 160)',
                        rows: [
                            { title: 'Pêssego 🍑', description: '\n_Pod refrescante de pessego_.', rowId: 'tbs1500' },
                            // { title: 'MAÇÃ VERDE 35mg🍏❄', description: '\n_DESCRIÇÂO_.', rowId: 'tbs1500' }
                        ],
                    },
                    {
                        title: 'IGNITE 1.500 PUFFS- R$ 90,00 ',
                        rows: [
                            { title: 'Morango, Maçã e Melancia 🍓🍎🍉❄', description: '\n_Pod refrescante de morango maçã e melancia_.', rowId: 'elf4000' },
                            { title:  'Morango com goiaba 🍓❄', description: '\n_Pod saboroso de Morango e Goiaba_.', rowId: 'elf4000' },
                            { title: 'Fruit Splash', description: '\n_Pod de skittles um ótimo chocolate _.', rowId: 'elf4000' },
                        ],
                    },
                    {
                        title: 'ELFBAR 4.000 PUFFS - R$ 130,00 ',
                        rows: [
                            { title: 'Kiwi passion frut guava 🥝❄', description: '\n_Pod de goiaba kiwi e maracuja refrescante_.', rowId: 'elf4000' },
                            { title: 'Energy ⚡', description: '\n_Pod saboroso de energético_.', rowId: 'elf4000' },
                            { title: 'Sakura grape 🍇❄', description: '\n_Pod de cereja e uva refrescante_.', rowId: 'elf4000' },
                            { title: 'Blue razz 🫐🫐❄', description: '\n_Pod de blueberry e amora refrescante_.', rowId: 'elf4000' },
                        ],
                    },
                    {
                        title: 'ELFBAR 5.000 PUFFS - R$ 150,00 ',
                        rows: [
                            { title: 'Cherry peach lemonade 🍒🍑🍋❄', description: '\n_Pod de  pessego cereja e um toque de limonada refrescante_.', rowId: 'elf4000' },
                            // { title: 'Kiwi passion frut guava 🥝❄', description: '\n_Pod de goiaba kiwi e maracuja refrescante_.', rowId: 'elf4000' },
                            // { title: 'Energy ⚡', description: '\n_Pod saboroso de energético_.', rowId: 'elf4000' },
                            // { title: 'Sakura grape 🍇❄', description: '\n_Pod de cereja e uva refrescante_.', rowId: 'elf4000' },
                            // { title: 'Blue razz 🫐🫐❄', description: '\n_Pod de blueberry e amora refrescante_.', rowId: 'elf4000' },
                        ],
                    },
                    ];
                    const listPod = {
                        text: 'Nosso Catálogo de *Pods* está logo abaixo!\n\n',
                        buttonText: 'Ver Catálogo de Pods',
                        footer: '© Infinity Vape 🌬️💨',
                        sections: sec_pod
                    };
                    SendMessage(jid, listPod)
                        .then(result => console.log('RESULT: ', result))
                        .catch(err => console.log('ERROR: ', err));
                }
                if(buttonResponse.selectedDisplayText === 'Adicionar ao Carrinho'){ //terminar!!
                    const carrinho = {
                                title:'*Seu carrinho 🛒*',
                                text: `Itens:\n\n➡️${itens_pedido.toString()}`,
                                footer: '© Infinity Vape 🌬️💨',
                                buttons: btns_finaliza,
                            };
                            SendMessage(jid, carrinho)
                                .then(result => console.log('RESULT: ', result))
                                .catch(err => console.log('ERROR: ', err));
                }
                if (buttonResponse.selectedDisplayText === 'Finalizar Pedido') { //terminar !!
                    delay(1000).then(async function() {
                        const itens = await getItens(user);
                        
                        const pedido_finalizado = {
                            title: 'Seu pedido foi finalizado e enviado para um atendente.🛒',
                            text: '\n\n*Itens do pedido*: ' + itens ,
                            footer: '© Infinity Vape 🌬️💨',
                        };
                        SendMessage(jid, {text:'Seu pedido foi finalizado e enviado para um atendente.🛒\n\n\n*Itens do pedido*:\n'+itens})
                            .then(result => console.log('RESULT: ', result))
                            .catch(err => console.log('ERROR: ', err));
                    });

                }
                if (buttonResponse.selectedDisplayText === 'Sair') { //terminar !!
                
                const listPod = {
                    text: 'Nosso Catálogo de *Pods* está logo abaixo!\n\n',
                    buttonText: 'Ver Catálogo de Pods',
                    footer: '© Infinity Vape 🌬️💨',
                    sections: sec_pod
                };
                SendMessage(jid, listPod)
                    .then(result => console.log('RESULT: ', result))
                    .catch(err => console.log('ERROR: ', err));
                }

        }
        if (listResponse) {
            if (listResponse.description.includes('Juice')) {
                delay(1000).then(async function() {
                    const itens = await getItens(user);
                    await setItens(itens + ', ' + msg.message.listResponseMessage.title, user);
                });
                delay(2000).then(async function() {
                    const itens = await getItens(user);
                    
                    const pedido = {
                        title: 'Seu pedido é até o momento:',
                        text:`*Itens*: \n➡️${itens}`,
                        footer: '© Infinity Vape 🌬️💨',
                        buttons: cart,
                    } 
                    SendMessage(jid, pedido)
                        .then(result => console.log('RESULT: ', result))
                        .catch(err => console.log('ERROR: ', err));
                    // SendMessage(jid, '*Itens do pedido*: ' + itens.replace(',',''));
                });
            }
            
            if (listResponse.description.includes('Nicksalt')) {
                const pedido_provisorio = {
                    title: 'Seu pedido é até o momento:',
                    text:`Item: \n➡️${listResponse.title}`,
                    footer: '© Infinity Vape 🌬️💨',
                    buttons: cart,
                } 
                SendMessage(jid, pedido_provisorio)
                    .then(result => console.log('RESULT: ', result))
                    .catch(err => console.log('ERROR: ', err));
            }
            if (listResponse.description.includes('Pod')) {
                const pedido_provisorio = {
                    title: 'Seu pedido é até o momento:',
                    text:`Item: \n➡️${listResponse.title}`,
                    footer: '© Infinity Vape 🌬️💨',
                    buttons: cart,
                    headerType: 1
                } 
                SendMessage(jid, pedido_provisorio)
                    .then(result => console.log('RESULT: ', result))
                    .catch(err => console.log('ERROR: ', err));
            }
        }
    }
    });
}


Connection()