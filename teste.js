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
    const [rows] = await connection.execute('SELECT user FROM pedidos WHERE user = ?', [msgfom]);
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
    const [rows] = await connection.execute('INSERT INTO `pedidos` (`id`, `user`, `nome`, `tipo_pastel`, `opcao_sabor`, `sabor`, `bebidas`, `adicionais`, `total`, `pagamento`, `localizacao`) VALUES (NULL, ?, ?, "","","","","", 0, 0, 0)', [msgfom, nome]);
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
    const [rows] = await connection.execute('UPDATE pedidos SET tipo_pastel = ? WHERE pedidos.user = ?;', [tipo, msgfom]);
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
    const [rows] = await connection.execute('SELECT tipo_pastel FROM pedidos WHERE user = ?', [msgfom]);
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
    const [rows] = await connection.execute('UPDATE pedidos SET tipo_pastel = "" WHERE pedidos.user = ?;', [msgfom]);
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
    const [rows] = await connection.execute('UPDATE pedidos SET opcao_sabores = ? WHERE pedidos.user = ?;', [opcao, msgfom]);
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
    const [rows] = await connection.execute('SELECT opcao_sabores FROM pedidos WHERE user = ?', [msgfom]);
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
    const [rows] = await connection.execute('UPDATE pedidos SET opcao_sabores = "" WHERE pedidos.user = ?;', [msgfom]);
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
    const [rows] = await connection.execute('UPDATE tipo_pastel SET title = ? WHERE pedidos.user = ?;', [total, msgfom]);
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
    const [rows] = await connection.execute('SELECT total FROM pedidos WHERE user = ?', [msgfom]);
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
    const [rows] = await connection.execute('UPDATE pedidos SET total = ? WHERE pedidos.user = ?;', [total, msgfom]);
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
    const [rows] = await connection.execute('UPDATE pedidos SET total = 0 WHERE pedidos.user = ?;', [msgfom]);
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
    const [rows] = await connection.execute('SELECT itens FROM pedidos WHERE user = ?', [msgfom]);
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
    const [rows] = await connection.execute('UPDATE pedidos SET itens = ? WHERE pedidos.user = ?;', [itens, msgfom]);
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
    const [rows] = await connection.execute('UPDATE pedidos SET itens = "" WHERE pedidos.user = ?;', [msgfom]);
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
    const [rows] = await connection.execute('SELECT forma_pagamento FROM pedidos WHERE user = ?', [msgfom]);
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
    const [rows] = await connection.execute('UPDATE pedidos SET forma_pagamento = ? WHERE pedidos.user = ?;', [pagamento, msgfom]);
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
    const [rows] = await connection.execute('UPDATE pedidos SET forma_pagamento = "" WHERE pedidos.user = ?;', [msgfom]);
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
    const [rows] = await connection.execute('UPDATE pedidos SET localizacao = ? WHERE pedidos.user = ?;', [localizacao, msgfom]);
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
    const [rows] = await connection.execute('UPDATE pedidos SET localizacao = "" WHERE pedidos.user = ?;', [msgfom]);
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
    const [rows] = await connection.execute('SELECT localizacao FROM pedidos WHERE user = ?', [msgfom]);
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
    const [rows] = await connection.execute('INSERT INTO `pedidos_full` (`id`, `user`, `nome`, `itens`, `forma_pagamento`, `localizacao`,  `total`) VALUES (NULL, ?, ?, ?, ?, ?, ?)', [msgfom, nome, itens, pagamento, localizacao, total]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.affectedRows > 0) return rows[0].user;
    return false;
}


const GroupCheck = (jid) => {
	const regexp = new RegExp(/^\d{18}@g.us$/)
	return regexp.test(jid)
}

const Update = (sock) => {
	sock.on('connection.update', ({ connection, lastDisconnect, qr }) => {
		if (qr) {
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
		if (connection === 'open') {
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


	sock.ev.on('messages.upsert', async ({ messages, type }) => {

		const msg = messages[0];
		const jid = msg.key.remoteJid;
		const cliente = msg.pushName
		const atendente = '558588364324@s.whatsapp.net'



		try {
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
		}
		catch (e) {
			console.log('Não foi possível armazenar o usuário' + e)
		}

		if (!msg.key.fromMe && jid !== 'status@broadcast' && !GroupCheck(jid)) {
			sock.readMessages(jid, msg.key.participant, [msg.key.id]);
			console.log("MENSAGEM : ", msg)
	
	
			/* ================================================================ */
			/*=========================== BUTTONS  ============================ */
			/* ================================================================ */
			const btn1 = [{ buttonId: 'pedido', buttonText: { displayText: 'Fazer pedido' } },
			{ buttonId: 'atendente', buttonText: { displayText: 'Redes Sociais' } }]
			const btn3 = [{ buttonId: 'inicia_pedido', buttonText: { displayText: 'Iniciar Pedido' } },]
	
			const btn2 = [{ buttonId: 'opcoes', buttonText: { displayText: 'Ver Cardápio' } },
			{ buttonId: 'opcoes', buttonText: { displayText: 'Pedido' } },
			{ buttonId: 'opcoes', buttonText: { displayText: 'Promoções' } },
			{ buttonId: 'opcoes', buttonText: { displayText: 'Endereço' } },]
			const btn4 = [{ buttonId: 'continua_pedido', buttonText: { displayText: 'Adicionar Itens' } }, { buttonId: 'opcoes', buttonText: { displayText: 'Finalizar Pedido' } }, { buttonId: 'opcoes', buttonText: { displayText: 'Parcial do Pedido' } }]
	
			const btn5 = [{ buttonId: 'bebidas', buttonText: { displayText: 'Bebidas' } },
			{ buttonId: 'inicia_pedido', buttonText: { displayText: 'Pasteis' } },
			{ buttonId: 'opcoes', buttonText: { displayText: 'Finalizar Pedido' } },]
	
			const cardapio = `=========================\n*Pastel Do Cabeção o Melhor Da Região*😋🍕\n\nAqui está o nosso Cardápio…👇🏻\nSabores disponíveis: *Queijo*, *Presunto*, *Frango*, *Carne*, *Calabresa*.\n\n=========================\n        *TIPOS DE PASTEIS*\n=========================\n\n👉🏻 *Pastel Quadradinho:*\n     1 opção sem queijo - (R$ 3,50)\n      2 opções ou Queijo - (R$ 4,50)\n👉🏻 *Pastel Comprido:*\n      1 opção sem queijo - (R$ 3,50)\n      2 opções ou Queijo - (R$ 4,50)\n      3 opções ou Mistão - (R$ 7,00)\n👉🏻 *Pastelão de DUAS Massas:*\n      1 opção sem queijo - (R$ 11,00)\n      2 opções ou Queijo - (R$ R$ 12,00)\n      3 opções ou Mistão - (R$ 13,00)\n👉🏻 *Adicionais:*\n      Catupiry ou Cheddar - (R$: 1,00)\n=========================\n     		   *Bebidas🍹*\n=========================\n👉🏻*Suco de 400ml - (R$ 3,00)*\n_(Manga, Goiaba, Acerola, Graviola,  Cajá, Maracujá e Manga.)_\n👉🏻*Vitamina de 400ml - (R$ 5,00)*\n_(Goiaba, Acerola e Manga.)_\n👉🏻*Vitamina de 400ml - (R$ 6,00)*\n_(Morango, Maracujá, Cajá e Graviola.)_\n👉🏻*Vitamina de 400ml  - (R$ 7,00)*\n_(Açaí.)_\n👉🏻*Refrigerante Lata - (R$ 4,00)*\n👉🏻*Refrigerante de 1l - (R$ 7,00)*\n\n`
	
			/* ================================================================ */
			/*=========================== CONSULTAS =========================== */
			/* ================================================================ */
			const nomeContato = msg.pushName;
			const user = msg.key.remoteJid;
			const pastel = await getPastel(jid);
			const bebida = await getBebida(jid);
			const tipoPastel = await get_tipo_pastel(jid)
			const Tipo = await getTipo(jid)
			const pagamentos = await getFormaPagamento(jid);
			const pedido = [
				{ title: 'Sanduíche', description: 'Escolha as opções' },
				{ title: 'Bebidas', description: 'Escolha as opções' },
				{ title: 'Doces', description: 'Escolha as opções' },
				{ title: 'Forma de pagamento', description: 'Escolher a opção de pagamento' }
				, { title: 'Endereço de entrega', description: 'Enviar a localização' },
				{ title: 'Reiniciar pedido', description: 'Escolha essa opção para zerar o seu pedido' },
				{ title: 'Parcial do pedido', description: 'Consultar pedido parcial' },
				{ title: 'Finalizar pedido', description: 'Encerrar o pedido e enviar para o atendente' }];
	
	
			if (msg.message.conversation) {
				if (msg.message.conversation.toLocaleLowerCase() === 'oi' || msg.message.conversation.toLocaleLowerCase().includes('olá') || msg.message.conversation.toLocaleLowerCase().includes('ola') || msg.message.conversation.toLocaleLowerCase().includes('boa noite') || msg.message.conversation.toLocaleLowerCase().includes('boa tarde') || msg.message.conversation.toLocaleLowerCase().includes('bom dia') || msg.message.conversation.toLocaleLowerCase().includes('manda o cardapio') || msg.message.conversation.toLocaleLowerCase().includes('ta aberto?') || msg.message.conversation.toLocaleLowerCase().includes('funcionando')) {
					const solicita_pedido = {
						text: 'Seja bem vindo ao *PASTEL DO CABEÇÃO O MELHOR DA REGIÃO*😋🍕\n\nEstou aqui para auxiliar você. Como posso ajudar?',
						footer: '© Pastel do Cabeção 😋🍕'
					}
					SendMessage(jid, solicita_pedido)
					delay(500).then(async function () {
						const getUserFrom = await getUser(user)
						if (getUserFrom === false) {
							const informa_categoria = {
								text: `🍕 ${nomeContato},\n\nAcho que você é novo por aqui, estou aqui para ajudar a realizar o seu primeiro pedido pelo atendimento automático! 😋🍕\n\nSelecione abaixo a opção que você desejar 👇🏻`,
								buttons: btn2,
								footer: '© Pastel do Cabeção 😋🍕'
							}
							SendMessage(jid, informa_categoria)
						}
	
						if (getUserFrom !== false) {
							const informa_categoria = {
								text: `🍕 ${nomeContato},\n\nEstou aqui para ajudar a realizar o seu pedido pelo atendimento automático! 😋🍕\n\nSelecione abaixo a opção que você desejar 👇🏻`,
								buttons: btn2,
								footer: '© Pastel do Cabeção 😋🍕'
							}
							SendMessage(jid, informa_categoria)
						}
	
					})
			
	
				}
			}
			if (msg.message.buttonsResponseMessage) {
				if (msg.message.buttonsResponseMessage.selectedDisplayText === 'Ver Cardápio') {
					const informa_cardapio = {
						text: cardapio,
						buttons: btn3,
						footer: '© Pastel do Cabeção 😋🍕'
					}
					SendMessage(jid, informa_cardapio)
				}
				if (msg.message.buttonsResponseMessage.selectedButtonId === 'inicia_pedido') {
	
					SendMessage(jid, { text: `🍕 Okay ${nomeContato}, vamos lá então!` })
					delay(500).then(async function () {
						let sections = [{ title: 'Selecione o Tipo do Pastel', rows: tipoPastel }];
						const tipo_pastel = {
							text: `🍕 Por favor escolha qual o tipo de Pastel desejado:`,
							buttonText: 'CLIQUE AQUI PARA ESCOLHER',
							footer: '© Pastel do Cabeção 😋🍕',
							sections: sections
						}
						SendMessage(jid, tipo_pastel)
					})
				}
				if (msg.message.buttonsResponseMessage.selectedDisplayText === 'Adicionar mais Itens') {
					const adc_carrinho = {
						text: '🍕 Ok! Escolha o item que você quer *Adicionar*.\n',
						buttons: btn5,
                        footer:'© Pastel do Cabeção 😋🍕'
					}
                    SendMessage(jid, adc_carrinho)
				}

			}
			if (msg.message.listResponseMessage) {
				if (msg.message.listResponseMessage.title.includes('Past.')) {
					await setTipo(msg.message.listResponseMessage.title, jid)
					const sec = [{
						title: '© Pastel do Cabeção 😋🍕', rows: [
							{ title: '👉🏻1 Opção e Sem queijo', description: '\nR$3,50' },
							{ title: '👉🏻2 Opções ou Queijo', description: '\nR$4,50' },
							{ title: '👉🏻3 Opções ou Mistão', description: '\nR$7,00' }
						],
					}]
					SendMessage(jid, { text: '🍕 Agora escolha a *quantidade de sabores* do seu pastel.\n', sections: sec, buttonText: 'CLIQUE AQUI PARA ESCOLHER', footer: '© Pastel do Cabeção 😋🍕' })
				}
				if (msg.message.listResponseMessage.title.includes('1')) {
					let sections = [{ title: 'Selecione o Tipo do Pastel', rows: pastel }];
					await setOpcao(msg.message.listResponseMessage.title, jid)
					const Tipo = await getTipo(jid)
					const men = {
						text: '🍕 Agora escolha o *Sabor* do seu Pastel:\n\n',
						buttonText: 'CLIQUE AQUI PARA ESCOLHER',
						footer: '© Pastel do Cabeção 😋🍕',
						sections: sections
					}
					SendMessage(jid, men)
				}
				if (msg.message.listResponseMessage.title.includes('2')) {
					let sections = [{ title: 'Selecione o Tipo do Pastel', rows: pastel }];
					await setOpcao(msg.message.listResponseMessage.title, jid)
					
					const men = {
						text: '🍕 Agora escolha o *Primeiro Sabor* do seu Pastel:\n\n',
						buttonText: 'CLIQUE AQUI PARA ESCOLHER',
						footer: '© Pastel do Cabeção 😋🍕',
						sections: sections
					}
					SendMessage(jid, men)
				}
				if (msg.message.listResponseMessage.title.includes('3')) {
					let sections = [{ title: 'Selecione o Tipo do Pastel', rows: pastel }];
					await setOpcao(msg.message.listResponseMessage.title, jid)
					const Tipo = await getTipo(jid)
					const men = {
						text: '🍕 Agora escolha o *Primeiro Sabor* do seu Pastel:\n\n',
						buttonText: 'CLIQUE AQUI PARA ESCOLHER',
						footer: '© Pastel do Cabeção 😋🍕',
						sections: sections
					}
					SendMessage(jid, men)
				}
                
				if (msg.message.listResponseMessage.title.includes('Carne')) {
					delay(500).then(async function() {
                        const itens = await getItens(user);
                        const total = await getTotal(user);
                        await setItens(itens + ', ' +msg.message.listResponseMessage.title , jid);
                        await setTotal(parseFloat(total) + parseFloat(msg.message.listResponseMessage.description.split('$')[1]), jid);
                    });
					const op = await getOpcao(jid)
					if (op == "👉🏻1 Opção e Sem queijo") {
						const next = {
								title: `🍕 ${nomeContato},`,
								text: '\nEscolhe uma das Opções abaixo:',
								buttons: btn4,
								footer: '© Pastel do Cabeção 😋🍕'
							}
							SendMessage(jid, next)
					}
				}
	
	
	
			}
	
	
		}
	}

	)
}


Connection()