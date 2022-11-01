const makeWaSocket = require('@adiwajshing/baileys').default
const { delay, DisconnectReason, fetchLatestBaileysVersion, useMultiFileAuthState } = require('@adiwajshing/baileys')
const { unlink } = require('fs')
const P = require('pino')
const fs = require('fs')



const opcoes = [
   { buttonId: 'catalogo', buttonText: { displayText: 'Catálogo' }, type: 1 },
   { buttonId: 'tira_duvida', buttonText: { displayText: 'Tirar Dúvidas' }, type: 1 },
   { buttonId: 'atendente', buttonText: { displayText: 'Falar com Atendente' }, type: 1 },
]
 
const cat = [
   { buttonId: 'juice', buttonText: { displayText: 'Juices' }, type: 1 },
   { buttonId: 'salt', buttonText: { displayText: 'Salts' }, type: 1 },
   { buttonId: 'pod', buttonText: { displayText: 'Pods' }, type: 1 },
]
 

const ZDGGroupCheck = (jid) => {
   const regexp = new RegExp(/^\d{18}@g.us$/)
   return regexp.test(jid)
}

const ZDGUpdate = (ZDGsock) => {
   ZDGsock.on('connection.update', ({ connection, lastDisconnect, qr }) => {
      if (qr){
         console.log('© BOT-ZDG - Qrcode: ', qr);
      };
      if (connection === 'close') {
         const ZDGReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
         if (ZDGReconnect) ZDGConnection()
         console.log(`© BOT-ZDG - CONEXÃO FECHADA! RAZÃO: ` + DisconnectReason.loggedOut.toString());
         if (ZDGReconnect === false) {
            fs.rmSync('vex', { recursive: true, force: true });
            const removeAuth = 'vex'
            unlink(removeAuth, err => {
               if (err) throw err
            })
         }
      }
      if (connection === 'open'){
         console.log('© BOT-ZDG - CONECTADO')
      }
   })
}

const ZDGConnection = async () => {
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
   const ZDGsock = makeWaSocket(config, { auth: state });
   ZDGUpdate(ZDGsock.ev);
   ZDGsock.ev.on('creds.update', saveCreds);

   
   const ZDGSendMessage = async (jid, msg) => {
      await ZDGsock.presenceSubscribe(jid)
      await delay(2000)
      await ZDGsock.sendPresenceUpdate('composing', jid)
      await delay(1500)
      await ZDGsock.sendPresenceUpdate('paused', jid)
      return await ZDGsock.sendMessage(jid, msg)
   }
   function isBlank(str) {
      return (!str || /^\s*$/.test(str));
   }

   ZDGsock.ev.on('messages.upsert', async ({ messages, type }) => {

      const msg = messages[0]
      const cliente = msg.pushName
      const jid = msg.key.remoteJid
      const web = msg.message.extendedTextMessage
      const mobile = msg.message.conversation
      const listRespone = msg.message.listResponseMessage
      const buttonResponse = msg.message.buttonsResponseMessage
   
      if (!msg.key.fromMe && jid !== 'status@broadcast' && !ZDGGroupCheck(jid)) {
   
            console.log("© BOT-ZDG - MENSAGEM : ", msg)
   
         try{
               ZDGsock.readMessages(jid, msg.key.participant, [msg.key.id])
            }
         catch(e){
               console.log('© BOT-ZDG - Não foi possível enviar o ReadReceipt')
            }

         if (msg.message.conversation) {
            if (mobile.toLocaleLowerCase() === 'oi'||'olá'||'boa noite'||'bom dia'||'boa tarde' ) {
               const btn_boasvindas = {
                  text: `Olá, *${cliente}* .Seja bem-vindo a Infinity Vape 💨!\n\nAqui é a Tati 🤖, atendente virtual da Infinity Vape 🌬️💨!  Para poder te atender da melhor forma, por favor digite o número ou nome de uma das opções abaixo:`,
                  footer: '© Infinity Vape 🌬️💨',
                  buttons: opcoes,
                  headerType: 1
               }
               ZDGSendMessage(jid, btn_boasvindas)
                  .then(result => console.log('RESULT: ', result))
                  .catch(err => console.log('ERROR: ', err))
            }}

         if (msg.message.buttonsResponseMessage) {
            if (buttonResponse.selectedDisplayText === 'Catálogo') {
               const categorias = {
                  text : 'Por favor informe qual é categoria desejada: \n\n\n\n_Se deseja encerrar a conversa digite SAIR_',
                  footer: '© Infinity Vape 🌬️💨',
                  buttons: cat,
                  headerType: 1
               }
               ZDGSendMessage(jid,categorias)
                  .then(result => console.log('RESULT: ', result))
                  .catch(err => console.log('ERROR: ', err))
            }
            if (buttonResponse.selectedDisplayText === 'Juices') {
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
                  title: `${cliente}, a nossa lista de *Juices* está logo abaixo:`,
                  text: 'Catálogo de Juices\n',
                  buttonText: 'Catálogo de Juices',
                  footer: '© Infinity Vape 🌬️💨',
                  sections: sec_juices
               }
               ZDGSendMessage(jid,listJuices)
            }

         }
         }
         
         
      }
      
)}
ZDGConnection()