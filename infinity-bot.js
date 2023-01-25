const makeWaSocket = require('@adiwajshing/baileys').default
const { delay, DisconnectReason, fetchLatestBaileysVersion, useMultiFileAuthState } = require('@adiwajshing/baileys')
const { unlink } = require('fs')
const P = require('pino')
const fs = require('fs')
const mysql = require('mysql2/promise');

const createConnection = async () => {
	return await mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'bot-delivery'
	});
}

/*                   FUNÇÕES GET                   */
const getUser = async (msg) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT user FROM pedidos WHERE user = ?', [msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.length > 0) return true;
    return false;
}
const getTipoPastel = async (user) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT tipo_pastel FROM pedidos WHERE user = ?', [user]);
	delay(1000).then(async function () {
	await connection.end();
	delay(500).then(async function () {
	connection.destroy();
	});
	});
	if (rows.length > 0) return rows[0].tipo_pastel;
	return false;
}
const getOpcoesSabores = async (msg) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT opcao_sabor FROM pedidos WHERE user = ?', [msg]);
	delay(1000).then(async function () {
	await connection.end();
	delay(500).then(async function () {
	connection.destroy();
	});
	});
	if (rows.length > 0) return rows[0].opcao_sabor;
	return false;
}
	
const getSaborEscolhido = async (msg) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT sabor FROM pedidos WHERE user = ?', [msg]);
	delay(1000).then(async function () {
	await connection.end();
	delay(500).then(async function () {
	connection.destroy();
	});
	});
	if (rows.length > 0) return rows[0].sabor;
	return false;
}
	
const getAdicionais = async (msg) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT adicionais FROM pedidos WHERE user = ?', [msg]);
	delay(1000).then(async function () {
	await connection.end();
	delay(500).then(async function () {
	connection.destroy();
	});
	});
	if (rows.length > 0) return rows[0].adicionais;
	return false;
}
	
const getTotal = async (msg) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT total FROM pedidos WHERE user = ?', [msg]);
	delay(1000).then(async function () {
	await connection.end();
	delay(500).then(async function () {
	connection.destroy();
	});
	});
	if (rows.length > 0) return rows[0].total;
	return false;
}
	
const getPagamento = async (msg) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT pagamento FROM pedidos WHERE user = ?', [msg]);
	delay(1000).then(async function () {
	await connection.end();
	delay(500).then(async function () {
	connection.destroy();
	});
	});
	if (rows.length > 0) return rows[0].pagamento;
	return false;
}
	
const getLocalizacao = async (msg) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT localizacao FROM pedidos WHERE user = ?', [msg]);
	delay(1000).then(async function () {
	await connection.end();
	delay(500).then(async function () {
	connection.destroy();
	});
	});
	if (rows.length > 0) return rows[0].localizacao;
	return false;
}


/*                   FUNÇÕES SET                   */
const setUser = async (user,nome) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('INSERT INTO `pedidos` (`id`, `user`, `nome`, `tipo_pastel`, `opcao_sabor`, `sabor`, `adicionais`, `total`, `pagamento`, `localizacao`) VALUES (NULL, ?, ?, "", "","" , "", 0,"", "")', [user, nome]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.affectedRows > 0) return true;
    return false;
}

const setTipoPastel = async (tipoPastel,user) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pedidos SET tipo_pastel = ? WHERE user = ?', [tipoPastel, user]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.affectedRows > 0) return true;
    return false;
}

const setOpcoesSabores = async (jid, opcao_sabor) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pedidos SET opcao_sabor = ? WHERE user = ?', [opcao_sabor, jid]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.affectedRows > 0) return true;
    return false;
}

const setSabor = async (msg, sabor) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pedidos SET sabor = ? WHERE pedidos.id = ?', [sabor, msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.affectedRows > 0) return true;
    return false;
}

const setAdicionais = async (msg, adicionais) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pedidos SET adicionais = ? WHERE pedidos.id = ?', [adicionais, msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.affectedRows > 0) return true;
    return false;
}
	
const setTotal = async (msg, total) => {
    const connection = await createConnection();
    const [rows] = await connection.execute('UPDATE pedidos SET total = ? WHERE pedidos.id = ?', [total, msg]);
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
    if (rows.affectedRows > 0) return true;
    return false;
}

/*                   FUNÇÕES DIVERSAS                   */


const insertPedido = async (user, tipoPastel, opcoesSabores, sabor, adicionais, total, pagamento, localizacao) => {
    const connection = await createConnection();
    const [rows] = await connection.execute(`SELECT * FROM pedidos WHERE user = ?`, [user]);
    if(rows.length === 0){
        await connection.execute(`INSERT INTO pedidos (user, tipo_pastel, opcao_sabor, sabor, adicionais, total, pagamento, localizacao) VALUES (?,?,?,?,?,?,?,?)`, [user, tipoPastel, opcoesSabores, sabor, adicionais, total, pagamento, localizacao]);
    } else {
        await connection.execute(`UPDATE pedidos SET tipo_pastel = ?, opcao_sabor = ?, sabor = ?, adicionais = ?, total = ?, pagamento = ?, localizacao = ? WHERE user = ?`, [tipoPastel, opcoesSabores, sabor, adicionais, total, pagamento, localizacao, user]);
    }
    delay(1000).then(async function () {
        await connection.end();
        delay(500).then(async function () {
            connection.destroy();
        });
    });
}
const consultaPreco = async (tipo,opcoes_sabor) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT preco FROM pastel_tipos WHERE title = ? AND description = ?', [tipo, opcoes_sabor]);
	delay(1000).then(async function () {
	await connection.end();
	delay(500).then(async function () {
	connection.destroy();
	});
	});
	if (rows.length > 0) return rows[0].preco;
	return false;
}


/*                   FUNÇÕES PARA OBTENÇÃO DAS LISTAS                   */

const tiposPastel = async () => {
   const connection = await createConnection();
   const [rows] = await connection.execute('SELECT title, description FROM pastel_tipos');
   delay(1000).then(async function () {
       await connection.end();
       delay(500).then(async function () {
           connection.destroy();
       });
   });
   if (rows.length > 0) return rows;
   return false;
}
const Sabores = async () => {
   const connection = await createConnection();
   const [rows] = await connection.execute('SELECT title FROM sabores');
   delay(1000).then(async function () {
       await connection.end();
       delay(500).then(async function () {
           connection.destroy();
       });
   });
   if (rows.length > 0) return rows;
   return false;
}


const opcoes = [
   { buttonId: 'cardapio', buttonText: { displayText: 'Ver Cardápio' }, type: 1 },
   { buttonId: 'inicia-pedido', buttonText: { displayText: 'Pedido' }, type: 1 },
   { buttonId: 'promo', buttonText: { displayText: 'Promoções' }, type: 1 },
   { buttonId: 'atendente', buttonText: { displayText: 'Endereço' }, type: 1 },
]

const btn_pedido = [{ buttonId: 'inicia-pedido', buttonText: { displayText: 'Iniciar Pedido' }, type: 1 },]
 
const cat = [
   { buttonId: 'juice', buttonText: { displayText: 'Juices' }, type: 1 },
   { buttonId: 'salt', buttonText: { displayText: 'Salts' }, type: 1 },
   { buttonId: 'pod', buttonText: { displayText: 'Pods' }, type: 1 },
]
 

const GroupCheck = (jid) => {
   const regexp = new RegExp(/^\d{18}@g.us$/)
   return regexp.test(jid)
}

const Update = (sock) => {
   sock.on('connection.update', ({ connection, lastDisconnect, qr }) => {
      if (qr){
         console.log('© Qrcode: ', qr);
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

const Connection = async () => {
   const { version } = await fetchLatestBaileysVersion()
   const { state, saveCreds } = await useMultiFileAuthState('vex')
   const config = {
      auth: state,
      logger: P({ level: 'error' }),
      printQRInTerminal: true,
      version,
      connectTimeoutMs: 60_000,
      async getMessage(key) {
         return { conversation: 'vex' };
      },
   }
   const sock = makeWaSocket(config, { auth: state });
   Update(sock.ev);
   sock.ev.on('creds.update', saveCreds);

   
   const SendMessage = async (jid, msg) => {
      await sock.presenceSubscribe(jid)
      await delay(2000)
      await sock.sendPresenceUpdate('composing', jid)
      await delay(1500)
      await sock.sendPresenceUpdate('paused', jid)
      return await sock.sendMessage(jid, msg)
   }
   function isBlank(str) {
      return (!str || /^\s*$/.test(str));
   }

   sock.ev.on('messages.upsert', async ({ messages, type }) => {

      const msg = messages[0]
      const nomeContato = msg.pushName
      const jid = msg.key.remoteJid
      const buttonResponse = msg.message.buttonsResponseMessage
   
      if (!msg.key.fromMe && jid !== 'status@broadcast' && !GroupCheck(jid)) {
            console.log("MENSAGEM : ", msg)
   
         try{
               sock.readMessages(jid, msg.key.participant, [msg.key.id])
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
         catch(e){
			   console.log('Não foi possível armazenar o usuário' + e)
               console.log('© BOT- Não foi possível enviar o ReadReceipt')
         }

         if (msg.message.conversation) {
            if (msg.message.conversation.toLocaleLowerCase() === 'oi'||msg.message.conversation.toLocaleLowerCase() ==='olá'||msg.message.conversation.toLocaleLowerCase() === 'boa noite'||msg.message.conversation.toLocaleLowerCase() === 'bom dia'||msg.message.conversation.toLocaleLowerCase() === 'boa tarde' ) {
               const boasvindas = {
                  text: 'Seja bem vindo ao *PASTEL DO CABEÇÃO O MELHOR DA REGIÃO*😋🍕\n',
                  footer: '© Pastel do Cabeção 😋🍕'
               }
               SendMessage(jid,boasvindas).then(result => console.log('RESULT: ', result)).catch(err => console.log('ERROR: ', err))
               delay(500).then(async function () {   
                     const getUserFrom = await getUser(jid) 
                     if (getUserFrom === false) {
                           const informa_categoria = {
                              text: `🍕 ${nomeContato},\n\nAcho que você é novo por aqui, estou aqui para ajudar a realizar o seu primeiro pedido pelo atendimento automático! 😋🍕\n\nSelecione abaixo a opção que você desejar 👇🏻`,
                              buttons: opcoes,
                              footer: '© Pastel do Cabeção 😋🍕'
                           }
                           SendMessage(jid, informa_categoria)
                     }
                     if (getUserFrom !== false) {
                        const informa_categoria = {
                           text: `🍕 ${nomeContato},\n\nEstou aqui para ajudar a realizar o seu pedido pelo atendimento automático! 😋🍕\n\nSelecione abaixo a opção que você desejar 👇🏻`,
                           buttons: opcoes,
                           footer: '© Pastel do Cabeção 😋🍕'
                        }
                        SendMessage(jid, informa_categoria)
                     }
      
                  })
            
         }}

         if (msg.message.buttonsResponseMessage) {
            if (buttonResponse.selectedDisplayText === 'Ver Cardápio') {
			      const cardapio = `=========================\n*Pastel Do Cabeção o Melhor Da Região*😋🍕\n\nAqui está o nosso Cardápio…👇🏻\nSabores disponíveis: *Queijo*, *Presunto*, *Frango*, *Carne*, *Calabresa*.\n\n=========================\n        *TIPOS DE PASTEIS*\n=========================\n\n👉🏻 *Pastel Quadradinho:*\n     1 opção sem queijo - (R$ 3,50)\n      2 opções ou Queijo - (R$ 4,50)\n👉🏻 *Pastel Comprido:*\n      1 opção sem queijo - (R$ 3,50)\n      2 opções ou Queijo - (R$ 4,50)\n      3 opções ou Mistão - (R$ 7,00)\n👉🏻 *Pastelão de DUAS Massas:*\n      1 opção sem queijo - (R$ 11,00)\n      2 opções ou Queijo - (R$ R$ 12,00)\n      3 opções ou Mistão - (R$ 13,00)\n👉🏻 *Adicionais:*\n      Catupiry ou Cheddar - (R$: 1,00)\n=========================\n     		   *Bebidas🍹*\n=========================\n👉🏻*Suco de 400ml - (R$ 3,00)*\n_(Manga, Goiaba, Acerola, Graviola,  Cajá, Maracujá e Manga.)_\n👉🏻*Vitamina de 400ml - (R$ 5,00)*\n_(Goiaba, Acerola e Manga.)_\n👉🏻*Vitamina de 400ml - (R$ 6,00)*\n_(Morango, Maracujá, Cajá e Graviola.)_\n👉🏻*Vitamina de 400ml  - (R$ 7,00)*\n_(Açaí.)_\n👉🏻*Refrigerante Lata - (R$ 4,00)*\n👉🏻*Refrigerante de 1l - (R$ 7,00)*\n\n`
               const informa_cardapio = {
						text: cardapio,
						buttons: btn_pedido,
						footer: '© Pastel do Cabeção 😋🍕',
                  
					}
					SendMessage(jid, informa_cardapio)
                  .then(result => console.log('RESULT: ', result))
                  .catch(err => console.log('ERROR: ', err))
            }
            if (msg.message.buttonsResponseMessage.selectedButtonId === 'inicia-pedido') {
	
					SendMessage(jid, { text: `🍕 Ok *${nomeContato}*, vamos lá então!` })
					delay(500).then(async function () {
                  const listaTiposPastel = await tiposPastel()
						let sections = [{ title: 'Selecione o Tipo do Pastel', rows:listaTiposPastel  }];
						const tipo_pastel = {
							text: `🍕 Por favor escolha qual o tipo de Pastel desejado:`,
							buttonText: 'CLIQUE AQUI PARA ESCOLHER',
							footer: '© Pastel do Cabeção 😋🍕',
							sections: sections
						}
						SendMessage(jid, tipo_pastel)
					})
				}

         }

         if(msg.message.listResponseMessage){
            if(msg.message.listResponseMessage.title.includes('Pastel')){
               let X = msg.message.listResponseMessage.title
               let Y = msg.message.listResponseMessage.description
               await setTipoPastel(X,jid)
               await setOpcoesSabores(jid,Y)
               const TipoEscolhido = await getTipoPastel(jid)
               const opcoesSabores = await getOpcoesSabores(jid)
               const sabores = await getSaborEscolhido(jid)
               
               const info_pedido = {
                  text: `🍕 *PARCIAL DO PEDIDO* 🍕\n\n👉🏻${TipoEscolhido}\n👉🏻${opcoesSabores}\n👉🏻${sabores}`,
                  footer: '© Pastel do Cabeção 😋🍕'
               }
               SendMessage(jid, info_pedido)
               delay(1000).then(async function(){
                  const listaSabores = await Sabores()
						let sections = [{ title: 'Sabores Disponíveis:', rows:listaSabores  }];
						const escolhe_sabor = {
							text: `🍕 Entendi, agora por favor escolha qual o *SABOR* desejado:`,
							buttonText: 'CLIQUE AQUI PARA ESCOLHER',
							footer: '© Pastel do Cabeção 😋🍕',
							sections: sections
						}
						SendMessage(jid, escolhe_sabor)
               })
            }
         }
         }
         
         
      }
      
)}
Connection()