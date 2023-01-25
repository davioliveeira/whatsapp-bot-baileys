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
		database: 'bot-delivery'
	});
}

const getUser = async (msgfom) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT user FROM pedido WHERE user = ?', [msgfom]);
  delay(1000).then(async function() {
		await connection.end();
		delay(500).then(async function() {
			connection.destroy();
		});
	});
	if (rows.length > 0) return true;
	return false;
}

const setUser = async (msgfom, nome) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('INSERT INTO `pedido` (`id`, `user`, `nome`, `itens`, `pagamento`, `localizacao`,  `total`) VALUES (NULL, ?, ?, "", 0, 0, 0)', [msgfom, nome]);
  delay(1000).then(async function() {
		await connection.end();
		delay(500).then(async function() {
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows[0].user;
	return false;
}

const getSanduiche = async () => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT title, description FROM sanduiche');
  delay(1000).then(async function() {
		await connection.end();
		delay(500).then(async function() {
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows;
	return false;
}

const getBebida = async () => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT title, description FROM bebida');
  delay(1000).then(async function() {
		await connection.end();
		delay(500).then(async function() {
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows;
	return false;
}

const getDoce = async () => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT title, description FROM doce');
  delay(1000).then(async function() {
		await connection.end();
		delay(500).then(async function() {
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows;
	return false;
}

const getFormaPagamento = async () => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT title, description FROM pagamento');
  delay(1000).then(async function() {
		await connection.end();
		delay(500).then(async function() {
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows;
	return false;
}

const getTotal = async (msgfom) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT total FROM pedido WHERE user = ?', [msgfom]);
  delay(1000).then(async function() {
		await connection.end();
		delay(500).then(async function() {
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows[0].total;
	return false;
}

const setTotal = async (total, msgfom) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('UPDATE pedido SET total = ? WHERE pedido.user = ?;', [total, msgfom]);
  delay(1000).then(async function() {
		await connection.end();
		delay(500).then(async function() {
			connection.destroy();
		});
	});
	if (rows.affectedRows > 0) return true;
	return false;
}

const delTotal = async (msgfom) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('UPDATE pedido SET total = 0 WHERE pedido.user = ?;', [msgfom]);
  delay(1000).then(async function() {
		await connection.end();
		delay(500).then(async function() {
			connection.destroy();
		});
	});
	if (rows.length > 0) return true;
	return false;
}

const getItens = async (msgfom) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT itens FROM pedido WHERE user = ?', [msgfom]);
  delay(1000).then(async function() {
		await connection.end();
		delay(500).then(async function() {
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows[0].itens;
	return false;
}

const setItens = async (itens, msgfom) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('UPDATE pedido SET itens = ? WHERE pedido.user = ?;', [itens, msgfom]);
  delay(1000).then(async function() {
		await connection.end();
		delay(500).then(async function() {
			connection.destroy();
		});
	});
	if (rows.affectedRows > 0) return true;
	return false;
}

const delItens = async (msgfom) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('UPDATE pedido SET itens = "" WHERE pedido.user = ?;', [msgfom]);
  delay(1000).then(async function() {
		await connection.end();
		delay(500).then(async function() {
			connection.destroy();
		});
	});
	if (rows.length > 0) return true;
	return false;
}

const getPagamento = async (msgfom) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT pagamento FROM pedido WHERE user = ?', [msgfom]);
  delay(1000).then(async function() {
		await connection.end();
		delay(500).then(async function() {
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows[0].pagamento;
	return false;
}

const setPagamento = async (pagamento, msgfom) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('UPDATE pedido SET pagamento = ? WHERE pedido.user = ?;', [pagamento, msgfom]);
  delay(1000).then(async function() {
		await connection.end();
		delay(500).then(async function() {
			connection.destroy();
		});
	});
	if (rows.affectedRows > 0) return true;
	return false;
}

const delPagamento = async (msgfom) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('UPDATE pedido SET pagamento = "" WHERE pedido.user = ?;', [msgfom]);
  delay(1000).then(async function() {
		await connection.end();
		delay(500).then(async function() {
			connection.destroy();
		});
	});
	if (rows.length > 0) return true;
	return false;
}

const setLocalizacao = async (localizacao, msgfom) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('UPDATE pedido SET localizacao = ? WHERE pedido.user = ?;', [localizacao, msgfom]);
  delay(1000).then(async function() {
		await connection.end();
		delay(500).then(async function() {
			connection.destroy();
		});
	});
	if (rows.affectedRows > 0) return true;
	return false;
}

const delLocalizacao = async (msgfom) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('UPDATE pedido SET localizacao = "" WHERE pedido.user = ?;', [msgfom]);
  delay(1000).then(async function() {
		await connection.end();
		delay(500).then(async function() {
			connection.destroy();
		});
	});
	if (rows.length > 0) return true;
	return false;
}

const getLocalizacao = async (msgfom) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT localizacao FROM pedido WHERE user = ?', [msgfom]);
  delay(1000).then(async function() {
		await connection.end();
		delay(500).then(async function() {
			connection.destroy();
		});
	});
	if (rows.length > 0) return rows[0].localizacao;
	return false;
}

const setPedido = async (msgfom, nome, itens, pagamento, localizacao, total) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('INSERT INTO `pedido_full` (`id`, `user`, `nome`, `itens`, `pagamento`, `localizacao`,  `total`) VALUES (NULL, ?, ?, ?, ?, ?, ?)', [msgfom, nome, itens, pagamento, localizacao, total]);
  delay(1000).then(async function() {
		await connection.end();
		delay(500).then(async function() {
			connection.destroy();
		});
	});
	if (rows.affectedRows > 0) return rows[0].user;
	return false;
}


//Check Groups 
const GroupCheck = (jid) => {
    const regexp = new RegExp(/^\d{18}@g.us$/)
    return regexp.test(jid)
}

//Conexão 
const Update = (sock) => {
    sock.on('connection.update', ({ connection, lastDisconnect, qr }) => {
        if (qr){
           console.log('© BOT - Qrcode: ', qr);
        };
        if (connection === 'close') {
           const Reconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
           if (Reconnect) Connection()
           console.log(`© BOT - CONEXÃO FECHADA! RAZÃO: ` + DisconnectReason.loggedOut.toString());
           if (Reconnect === false) {
              fs.rmSync('vex', { recursive: true, force: true });
              const removeAuth = 'vex'
              unlink(removeAuth, err => {
                 if (err) throw err
              })
           }
        }
        if (connection === 'open'){
           console.log('© BOT - CONECTADO')
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


            if(msg.message.conversation){
                if ( msg.message.conversation.toLocaleLowerCase()=== 'oi' || msg.message.conversation.toLocaleLowerCase().includes('olá') || msg.message.conversation.toLocaleLowerCase().includes('ola') || msg.message.conversation.toLocaleLowerCase().includes('boa noite') || msg.message.conversation.toLocaleLowerCase().includes('boa tarde') || msg.message.conversation.toLocaleLowerCase().includes('bom dia') || msg.message.conversation.toLocaleLowerCase().includes('manda o cardapio') || msg.message.conversation.toLocaleLowerCase().includes('ta aberto?') || msg.message.conversation.toLocaleLowerCase().includes('funcionando') ){
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
                    let list = new list('Olá ' + nomeContato + ', tudo bem? Escolha os itens do seu pedido selecionando uma das opções do menu','Fazer pedido',sections,'Realize o seu Pedido','© Comunidade ZDG');
                

                }
            }

        
        
        }
    //////
    })
//////
}

Connection()