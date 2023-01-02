const makeWaSocket = require('@adiwajshing/baileys').default
const { delay, DisconnectReason, fetchLatestBaileysVersion, useMultiFileAuthState, } = require('@adiwajshing/baileys')
const { unlink, existsSync, mkdirSync } = require('fs');
const P = require('pino');  
const fs = require('fs');
const mysql = require('mysql2/promise');

function delay(t, v) {
    return new Promise(function(resolve) { 
        setTimeout(resolve.bind(null, v), t)
    });
  }
const createConnection = async () => {
    return await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'bot-delivery'
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
// Captura Sanduiches
const getSanduiche = async () => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT title, description FROM sanduiche');
  delay(1000).then(async function() {
		await connection.end();
		delay(500).then(async function() {
			connection.destroy();
		});
	});
    if (rows.length > 0) return rows[0].itens;
    return false;
}


const getItens = async (msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT itens FROM pedido WHERE user = ?', [msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return rows[0].itens;
    return false;
}

const setItens = async (itens, msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pedido SET itens = ? WHERE pedido.user = ?;', [itens, msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });

    if (rows.affectedRows > 0) return true;
    return false;
}

const delItens = async (msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pedido SET itens = "" WHERE pedido.user = ?;', [msg]);
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
        const web = msg.message.extendedTextMessage
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
                { buttonId: 'orcamento', buttonText: { displayText: 'Solicitar um Orçamento' }, type: 1.0 },
                { buttonId: 'tira_duvida', buttonText: { displayText: 'Dúvidas Sobre Pacotes' }, type: 1.1 },
                { buttonId: 'atendente', buttonText: { displayText: 'Redes Sociais' }, type: 1.2 },
            ];

            const opcao_pedido = [
                { buttonId: 'exit', buttonText: { displayText: 'Adicionar mais itens' }, type: 1.2 },
                { buttonId: 'finaliza', buttonText: { displayText: 'Finalizar Pedido' }, type: 1.1 },
            ];
            const pagamento = [
                { buttonId: 'credito', buttonText: { displayText: 'Cartão de Débito' }, type: 1.2 },
                { buttonId: 'debito', buttonText: { displayText: 'Cartão de Crédito' }, type: 1.2 },
                { buttonId: 'pix', buttonText: { displayText: 'Pix' }, type: 1.1 },
            ];

            const cat = [
                { buttonId: 'juice', buttonText: { displayText: 'Juices' }, type: 1.3 },
                { buttonId: 'salt', buttonText: { displayText: 'Salts' }, type: 1.4 },
                { buttonId: 'pod', buttonText: { displayText: 'Pods' }, type: 1.5 },
                { buttonId: 'exit', buttonText: { displayText: 'Sair' }, type: 1.2 }
            ];

            //======================================================//

            // TRATANDO RESPONSES TEXTS
            if (msg.message.conversation) {
                if (mobile.toLocaleLowerCase() === 'oi' || 'olá' || 'boa noite' || 'bom dia' || 'boa tarde') {
                    const btn_boasvindas = {
                        text: `Olá, *${cliente}* seja bem-vindo!\n\nAqui é a Tati 🤖, atendente virtual do Mago dos Drinks🍸!  Para poder te atender da melhor forma, por favor selecione uma das opções abaixo:`,
                        footer: '© Mago Dos Drinks 🧙🏼‍♂️🍹',
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
                        text: 'Por favor informe qual é categoria desejada: \n\n\n\n_Se deseja encerrar a conversa clique em SAIR_',
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
                            title: 'Mago - 1 und. R$35,00 || 3 und. R$90,00',
                            rows: [
                                { title: 'Arctic Mango 3mg 🥭❄', description: '\nJuice de manga com um leve frescor.', rowId: 'mago' },
                                // { title: 'Cold grape 3mg 🍇❄', description: '\nJuice de uva refrescante.', rowId: 'mago' },
                                { title: 'Artic Pine 3mg 🍍❄', description: '\nJuice de uva refrescante.', rowId: 'mago' },
                                { title: 'Artic Red  3mg🍓❄', description: '\nJuice de morango refrescante.', rowId: 'mago' },
                                { title: 'Artic Mint  3mg🍃❄', description: '\nJuice de menta refrescante.', rowId: 'mago' },
                                { title: 'Banana 3mg 🍌', description: '\nJuice Delicioso De Banana.', rowId: 'mago' },
                                { title: 'Arctic Apple 3mg 🍎❄', description: '\nJuice Refrescante De Maçã.', rowId: 'mago' },
                                { title: 'Arctic Lemon 3mg🍋❄', description: '\nJuice Refrescante de Limão.', rowId: 'mago' },
                                { title: 'Ice Melons 3mg🍉🍈❄', description: '\nJuice docinho de melão e melancia.', rowId: 'mago' },
                                                             
                                                            // Juices -- 6mg                                                
                
                                { title: 'Artic Mint  6mg🍃❄', description: '\nJuice de menta refrescante.', rowId: 'mago' },
                                { title: 'Cold Grape 6mg 🍇❄', description: '\nJuice de uva refrescante.', rowId: 'mago' },
                                { title: 'Arctic Mango 6mg 🥭❄', description: '\nJuice de manga com um leve frescor.', rowId: 'mago' },
                                { title: 'Ice Melons 6mg🍉🍈❄', description: '\nJuice docinho de melão e melancia.', rowId: 'mago' },
                                { title: 'Artic Red  6mg🍓❄', description: '\nJuice de morango refrescante.', rowId: 'mago' },

                            ],
                        },
                        {
                            title: 'Mestre - 1 und. R$35,00 || 3 und. R$90,00',
                            rows: [
                            
                                { title: 'Fantástico 3mg🍊❄', description: '\nJuice Laranja com um toque de refrescância.', rowId: 'mestre' },
                                { title: 'Halls Cereja 3mg 🍒❄', description: '\nJuice de cereja com um frescor inigualável.', rowId: 'mestre' },
                                { title: 'Maçã Verde Ice 3mg🍏❄', description: '\nJuice De Maçã Verde Refrescante ', rowId: 'mestre' },
                                { title: 'Frutas Vermelhas 3mg🍓🍉🍒❄', description: '\nJuice de morango framboesa e amora com um toque refrescante', rowId: 'mestre' },
                                { title: 'Manga Ice 3mg🥭❄', description: '\nJuice de manga docinha com um toque refrescante', rowId: 'mestre' },
                                { title: 'Grapette 3mg🍇❄', description: '\njuice de uva refrescante', rowId: 'mestre' },
                                // { title: 'Tridente 3mg🍃❄', description: '\nJuice de hortelã muito refrescante.', rowId: 'mestre' },
                                { title: 'Frutas Vermelhas com Morango 3mg🍓🍎🍒🍉❄', description: '\nJuice de morango framboesa e amora com um toque a mais de morango.', rowId: 'mestre' },
                                { title: 'Limão Ice 3mg 🍋❄', description: '\nJuice de limao refrescante.', rowId: 'mestre' },
                                { title: 'Halls Cereja 3mg 🍒❄', description: '\nJuice de cereja com um frescor inigualável.', rowId: 'mestre' },
                                // { title: 'Halls Cereja 6mg 🍒❄', description: '\nJuice de cereja com um frescor inigualável.', rowId: 'mestre' },
                                { title: 'Manga Ice 6mg🥭❄', description: '\nJuice de manga docinha com um toque refrescante', rowId: 'mestre' },
                                // { title: 'Frutas Vermelhas 6mg🍓🍉🍒❄', description: '\nJuice de morango franboesa e amora com um toque refrescante', rowId: 'mestre' },
                            ],
                        },
                        {
                            title: 'Nomad - 1 und. R$35,00 || 3 und. R$90,00',
                            rows: [
                                { title: 'Dubai 3mg🍇🍎❄', description: '\nJuice Refrescante De Uva Com Maçã.', rowId: 'nomad1' },
                                { title: 'Miami 3mg 🍊❄', description: '\nJuice de goiaba e tangerina refrescante.', rowId: 'nomad1' },
                                // { title: 'Barcelona 3mg🍌🍓🍬❄', description: '\nJuice de chiclete de morango com banana refrescante.', rowId: 'nomad2' },
                                { title: 'Miami 6mg 🍊❄', description: '\nJuice de goiaba e tangerina refrescante.', rowId: 'nomad1' },
                                // { title: 'Dubai 6mg🍇🍎❄', description: '\nJuice Refrescante De Uva Com Maçã.', rowId: 'nomad1' },
                                { title: 'Barcelona 6mg🍌🍓🍬❄', description: '\nJuice de chiclete de morango com banana refrescante.', rowId: 'nomad2' },
                            ],
                        }
                    ];
                    const listJuices = {
                        text: 'Nosso Catálogo de *Juices * está logo abaixo!\n\n*PROMOÇÃO IMPERDÍVEL NOS JUICES 🤑🏃‍♂️💨*\n\n3 unidades de qualquer marca por R$90,00 😱😱\n\n*CORRE! APROVEITA ESSA PROMOÇÃO!🏃‍♂️💨 *\n_Válida até dia 15/11/22_ ',
                        buttonText: 'Ver Catálogo de Juices',
                        footer: '© Infinity Vape 🌬️💨',
                        sections: sec_juices,
                        type: 1
                    };
                    SendMessage(jid, listJuices)
                }
            if (buttonResponse.selectedDisplayText === 'Salts') {
                    const sec_salts = [
                        {
                            title: 'Mago - R$40,00 ',
                            rows: [
                                //  { title: 'ARCTIC MANGO 50mg 🥭❄', description: '\nSalt de manga com um leve frescor.', rowId: 'mago' },
                                { title: 'Cold Mint 50mg 🍃❄', description: '\nNicksalt de menta muito refrescante. ', rowId: 'mago' },
                                // { title: 'Arctic Red 50mg🍓❄', description: '\nNicksalt de morango refrescante.', rowId: 'mago' },
                                // { title: 'Cold Mint 35mg 🍃❄', description: '\nNicksalt de menta muito refrescante. ', rowId: 'mago' },
                                { title: 'Arctic Red 35mg🍓❄', description: '\nNicksalt de morango refrescante.', rowId: 'mago' },
                                // { title: 'Banana 35mg🍌❄', description: '\nNicksalt de banana refrescante.', rowId: 'mago' },
                                // { title: 'Ice Melons 35mg🍈🍉❄', description: '\nNicksalt de melão e melancia refrescante.', rowId: 'mago' },
                            ],
                        },
                        {
                            title: 'Mestre - R$40,00',
                            rows: [
                                { title: 'Trident 35mg 🍃❄', description: '\nNicksalt de hortelã refrescante.', rowId: 'mestre' },
                                // { title: 'Maçã Verde 35mg🍏❄', description: '\nNicksalt de maçã verde deliciosa ', rowId: 'mestre' },
                                { title: 'Halls Cereja 35mg🍒❄', description: '\nNicksalt de cereja muito refrescante.', rowId: 'mestre' },
                                // { title: 'Manga Ice 50mg🥭❄', description: '\nNicksalt de maga docinha e refrescante.', rowId: 'mestre' },
                                // { title: 'Frutas Vermelhas 50mg🍓🍉🍒❄', description: '\nJuice de morango franboesa e amora com um toque refrescante', rowId: 'mestre' },
                                { title: 'Maçã Verde 50mg🍏❄', description: '\nNicksalt de maçã verde deliciosa ', rowId: 'mestre' },
                            ]
                        }
                    ]
                

                const listSalt = {
                    text: 'Nosso Catálogo de *Salts* está logo abaixo!\n\n*PROMOÇÃO IMPERDÍVEL NOS SALTS 🤑🏃‍♂️💨*\n\n3 unidades de qualquer marca por R$90,00 😱😱\n\n*CORRE! APROVEITA ESSA PROMOÇÃO!🏃‍♂️💨 *\n_Válida até dia 15/11/22_ ',
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
                        title: 'THE BLACK SHEEP 600 PUFFS - R$ 60,00 ( 2x por R$ 100,00)',
                        rows: [
                            { title: 'Tbs - 600 - Morango 🍓❄', description: '\n_Pod de morango refrescante._.', rowId: 'tbs600' },
                            { title: 'Tbs - 600 - Frutas Vermelhas 🍎🍇🍒❄', description: '\n_Pod de morango amora e framboesa._', rowId: 'tbs600' },
                            { title: 'Tbs- 600 - Abacaxi 🍍❄', description: '\n_Pod de abacaxi com um toque refrescante_.', rowId: 'tbs600' },
                            { title: 'Tbs - 600 - Pêssego 🍑', description: '\n_Pod refrescante de pessego_.', rowId: 'tbs600' },
                            // {title: '',description:'',rowId:''},
                        ],
                    },
                    {
                        title: 'THE BLACK SHEEP 1.500 PUFFS - R$ 90,00 ( 2x por R$ 160,00)',
                        rows: [
                            { title: 'Tbs - 1500 - Uva 🍇 ❄ ', description: '\n_Pod refrescante de Uva_.', rowId: 'tbs1500' },
                            { title: 'Tbs - 1500 - Frutas Vermelhas 🍎🍇🍒❄', description: '\n_Pod de morango amora e framboesa._', rowId: 'tbs600' },
                            // { title: 'Tbs - 1500 - Abacaxi 🍍❄', description: '\n_Pod refrescante de Abacaxi.', rowId: 'tbs1500' },
                            { title: 'Tbs - 1500 - Menta 🍃❄ ', description: '\n_Pod refrescante de Menta.', rowId: 'tbs1500' },
                            // { title: 'Tbs - 1500 - Morango 🍓❄', description: '\n_Pod refrescante de Morango_.', rowId: 'tbs1500' },
                            { title: 'Tbs - 1500 - Melancia 🍉❄', description: '\n_Pod refrescante de Melancia.', rowId: 'tbs1500' },
                            // { title: 'Pêssego 🍑', description: '\n_Pod refrescante de pessego_.', rowId: 'tbs1500' },
                        ],
                    },
                    {
                        title: 'IGNITE 1.500 PUFFS- R$ 90,00 ( 2x por R$ 160,00) ',
                        rows: [
                            { title: 'Morango, Maçã e Melancia 🍓🍎🍉❄', description: '\n_Pod refrescante de morango maçã e melancia_.', rowId: 'elf4000' },
                            { title: 'Morango com goiaba 🍓❄', description: '\n_Pod saboroso de Morango e Goiaba_.', rowId: 'elf4000' },
                            { title: 'Fruit Splash', description: '\n_Pod de skittles um ótimo chocolate _.', rowId: 'elf4000' },
                        ],
                    },
                    // {
                    //     title: 'ELFBAR 4.000 PUFFS - R$ 130,00 ',
                    //     rows: [
                    //         { title: 'Kiwi passion frut guava 🥝❄', description: '\n_Pod de goiaba kiwi e maracuja refrescante_.', rowId: 'elf4000' },
                    //         { title: 'Energy ⚡', description: '\n_Pod saboroso de energético_.', rowId: 'elf4000' },
                    //         { title: 'Sakura grape 🍇❄', description: '\n_Pod de cereja e uva refrescante_.', rowId: 'elf4000' },
                    //         { title: 'Blue razz 🫐🫐❄', description: '\n_Pod de blueberry e amora refrescante_.', rowId: 'elf4000' },
                    //     ],
                    // },
                    {
                        title: 'ELFBAR 5.000 PUFFS - R$ 150,00 ',
                        rows: [
                            { title: 'Energy ⚡', description: '\n_Pod saboroso de energético_.', rowId: 'elf5000' },
                            // { title: 'Cherry peach lemonade 🍒🍑🍋❄', description: '\n_Pod de  pessego cereja e um toque de limonada refrescante_.', rowId: 'elf4000' },
                            { title: 'Morango com Blueberry🍓🫐❄', description: '\n_Pod de mojito clássico, que adquiriu algumas notas mais aromáticas graças à fruta perfumada agridoce (morango)_.', rowId: 'elf4000' },
                            // { title: 'Red Mojito 🍓🍃❄', description: '\n_Pod de mojito clássico, que adquiriu algumas notas mais aromáticas graças à fruta perfumada agridoce (morango)_.', rowId: 'elf4000' },
                            { title: 'Blueberry Ice 🫐❄', description: '\n_Pod um suave sabor de mirtilo com um toque de refrescância._', rowId: 'elf4000' },
                            { title: 'Sakura grape 🍇❄', description: '\n_Pod de cereja e uva refrescante_.', rowId: 'elf4000' },
                            { title: 'Creme de Morango 🍓🍦', description: '\n_Pod de morango com um toque adocicado de creme_.', rowId: 'elf4000' },
                            { title: 'Abacaxi 🍍❄', description: '\n_Pod de abacaxi com um toque refrescante_.', rowId: 'elf4000' },
                            { title: 'Melancia 🍉❄', description: '\n_Pod de melancia com um toque refrescante_.', rowId: 'elf4000' },
                        ],
                    },
                ];
                const listPod = {
                    text: 'Nosso Catálogo de *Pods * está logo abaixo!\n\n*PROMOÇÃO IMPERDÍVEL NOS SALTS 🤑🏃‍♂️💨*\n\nNa compra de 2 unidades de qualquer POD de 1500 puff a unidade sai por R$80,00 😱😱\n\n*CORRE! APROVEITA ESSA PROMOÇÃO!🏃‍♂️💨 *\n_Válida até dia 15/11/22_ ',
                    buttonText: 'Ver Catálogo de Pods',
                    footer: '© Infinity Vape 🌬️💨',
                    sections: sec_pod
                };
                SendMessage(jid, listPod)
            }
            if (buttonResponse.selectedDisplayText === 'Adicionar mais itens') {
                const carrinho = {
                    text: '*Escolha uma Categoria:* ',
                    footer: '© Infinity Vape 🌬️💨',
                    buttons: cat,
                };
                SendMessage(jid, carrinho)
            }
            if (buttonResponse.selectedDisplayText === 'Falar com Atendente') {
                const atendente = {
                    text: 'Ok! Aguarde alguns instantes enquanto te encaminho para um dos Atendentes Infinity.',
                    footer: '© Infinity Vape 🌬️💨'
                }
                SendMessage(jid, atendente)
            }
            if (buttonResponse.selectedDisplayText === 'Finalizar Pedido') {
                const formaPagamento = {
                    text: 'Por favor informe qual é a forma de pagamento desejada: \n\n\n',
                    footer: '© Infinity Vape 🌬️💨',
                    buttons: pagamento,

                };
                SendMessage(jid, formaPagamento)
            }
            if (buttonResponse.selectedDisplayText === 'Dinheiro') {
                delay(1000).then(async function () {
                    const itens = await getItens(jid);
                    const pedido = itens.replace(/,/g, '\n➡️')
                    const num_cliente = jid.replace('@s.whatsapp.net', '')

                    SendMessage(jid, { text: 'Seu pedido foi finalizado e enviado para um dos Atendentes Infinity.🛒\n\n*Itens do pedido*:\n➡️' + pedido + '\n\n*Forma de Pagamento:* ' + buttonResponse.selectedDisplayText })
                    SendMessage(jid, { text: '_A Infinity Vape agrade a preferência e volte sempre.😍🎉_\n\n\n_Para realizar um novo pedido basta dizer "Oi"_' })
                    SendMessage('558588209354@s.whatsapp.net', { text: `*Um cliente acabou de finalizar o pedido.*\n*Informações do Pedido:*\n\n*Produto(s):*\n➡️${pedido}\n\n*Nome do Cliente:* ${cliente}\n*Forma de Pagamento:* ${msg.message.buttonsResponseMessage.selectedDisplayText}\n*Link:* https://wa.me/${num_cliente}\n` })
                    delItens(jid)
                });

            }

            if (buttonResponse.selectedDisplayText === 'Pix') {
                delay(1000).then(async function () {
                    const itens = await getItens(jid);
                    const pedido = itens.replace(/,/g, '\n➡️')
                    const num_cliente = jid.replace('@s.whatsapp.net', '')

                    SendMessage(jid, { text: 'Seu pedido foi finalizado e enviado para um dos Atendentes Infinity.🛒\n\n*Itens do pedido*:\n➡️' + pedido + '\n\n*Forma de Pagamento:* ' + buttonResponse.selectedDisplayText })
                    SendMessage(jid, { text: '_A Infinity Vape agrade a preferência e volte sempre.😍🎉_\n\n\n_Para realizar um novo pedido basta dizer "Oi"_' })
                    SendMessage('558588209354@s.whatsapp.net', { text: `*Um cliente acabou de finalizar o pedido.*\n*Informações do Pedido:*\n\n*Produto(s):*\n➡️${pedido}\n\n*Nome do Cliente:* ${cliente}\n*Forma de Pagamento:* ${msg.message.buttonsResponseMessage.selectedDisplayText}\n*Link:* https://wa.me/${num_cliente}\n` })
                    delItens(jid)
                });

            }

            if (buttonResponse.selectedDisplayText === 'Cartão de Débito') {
                delay(1000).then(async function () {
                    const itens = await getItens(jid);
                    const pedido = itens.replace(/,/g, '\n➡️')
                    const num_cliente = jid.replace('@s.whatsapp.net', '')

                    SendMessage(jid, { text: 'Seu pedido foi finalizado e enviado para um dos Atendentes Infinity.🛒\n\n*Itens do pedido*:\n➡️' + pedido + '\n\n*Forma de Pagamento:* ' + buttonResponse.selectedDisplayText })
                    SendMessage(jid, { text: '_A Infinity Vape agrade a preferência e volte sempre.😍🎉_\n\n\n_Para realizar um novo pedido basta dizer "Oi"_' })
                    SendMessage('558588209354@s.whatsapp.net', { text: `*Um cliente acabou de finalizar o pedido.*\n*Informações do Pedido:*\n\n*Produto(s):*\n➡️${pedido}\n\n*Nome do Cliente:* ${cliente}\n*Forma de Pagamento:* ${msg.message.buttonsResponseMessage.selectedDisplayText}\n*Link:* https://wa.me/${num_cliente}\n` })
                    delItens(jid)
                });
            }
            if (buttonResponse.selectedDisplayText === 'Cartão de Crédito') {
                delay(1000).then(async function () {
                    const itens = await getItens(jid);
                    const pedido = itens.replace(/,/g, '\n➡️')
                    const num_cliente = jid.replace('@s.whatsapp.net', '')

                    SendMessage(jid, { text: 'Seu pedido foi finalizado e enviado para um dos Atendentes Infinity.🛒\n\n*Itens do pedido*:\n➡️' + pedido + '\n\n*Forma de Pagamento:* ' + buttonResponse.selectedDisplayText })
                    SendMessage(jid, { text: '_A Infinity Vape agrade a preferência e volte sempre.😍🎉_\n\n\n_Para realizar um novo pedido basta dizer "Oi"_' })
                    SendMessage('558588209354@s.whatsapp.net', { text: `*Um cliente acabou de finalizar o pedido.*\n*Informações do Pedido:*\n\n*Produto(s):*\n➡️${pedido}\n\n*Nome do Cliente:* ${cliente}\n*Forma de Pagamento: *${msg.message.buttonsResponseMessage.selectedDisplayText}\n*Link:* https://wa.me/${num_cliente}\n` })
                    delItens(jid)
                });
            }

            if (buttonResponse.selectedDisplayText === 'Sair') {
                const encerrar = {
                    text: 'A Infinity Vape agradece seu contato e até Breve.😊❤️',
                }
                SendMessage(jid, encerrar)
            }

        }
        if (listResponse) {
            if (listResponse.description.includes('Juice')) {
                delay(1000).then(async function () {
                    const itens = await getItens(jid);
                    console.dir(itens)
                    if (itens == '') {
                        await setItens(msg.message.listResponseMessage.title, jid)
                    }
                    else {
                        await setItens(itens + '\n➡️' + msg.message.listResponseMessage.title, jid)
                    }
                });
                delay(2000).then(async function () {
                    const itens = await getItens(jid);
                    const pedido = {
                        title: 'Seu pedido é até o momento:',
                        text: `Seu pedido é até o momento:\n\n*Itens*: \n➡️${itens}`,
                        footer: '© Infinity Vape 🌬️💨',
                        buttons: opcao_pedido,
                    }
                    SendMessage(jid, pedido)
                });
            }

            if (listResponse.description.includes('Nicksalt')) {
                delay(1000).then(async function () {
                    const itens = await getItens(jid);
                    console.dir(itens)
                    if (itens == '') {
                        await setItens(msg.message.listResponseMessage.title, jid)
                    }
                    else {
                        await setItens(itens + '\n➡️' + msg.message.listResponseMessage.title, jid)
                    }
                })
                delay(2000).then(async function () {
                    const itens = await getItens(jid);
                    const pedido = {
                        title: 'Seu pedido é até o momento:',
                        text: `Seu pedido é até o momento:\n\n*Itens*: \n➡️${itens}`,
                        footer: '© Infinity Vape 🌬️💨',
                        buttons: opcao_pedido,
                    }
                    SendMessage(jid, pedido)
                })
            }
            if (listResponse.description.includes('Pod')) {
                delay(1000).then(async function () {
                    const itens = await getItens(jid);
                    console.dir(itens)
                    if (itens == '') {
                        await setItens(msg.message.listResponseMessage.title, jid)
                    }
                    else {
                        await setItens(itens + '\n➡️' + msg.message.listResponseMessage.title, jid)
                    }
                })
                delay(2000).then(async function () {
                    const itens = await getItens(jid);
                    const pedido = {
                        title: 'Seu pedido é até o momento:',
                        text: `Seu pedido é até o momento:\n\n*Itens*: \n➡️${itens}`,
                        footer: '© Infinity Vape 🌬️💨',
                        buttons: opcao_pedido,
                    }
                    SendMessage(jid, pedido)
                })
            }
        }
    }
  });
}


Connection()