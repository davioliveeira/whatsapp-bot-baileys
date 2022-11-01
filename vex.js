const makeWaSocket = require('@adiwajshing/baileys').default
const { delay, DisconnectReason, fetchLatestBaileysVersion, useMultiFileAuthState } = require('@adiwajshing/baileys')
const { unlink } = require('fs')
const P = require('pino')
const fs = require('fs')

const ZDGBtn1 = {
   id: 'ZDGContinuar',
   displayText: 'CONTINUAR',
}

const ZDGBtn2 = {
   id: 'ZDGSair',
   displayText: 'SAIR',
}

const ZDGbtnMD1 = [
   { index: 1, quickReplyButton: ZDGBtn1 },
   { index: 2, quickReplyButton: ZDGBtn2 },
]

const ZDGurlBtn1 = {
   url: 'http://zapdasgalaxias.com.br/',
   displayText: 'Comunidade ZDG',
}

const ZDGurlBtn2 = {
   url: 'http://zapdasgalaxias.com.br/passaporte-zdg',
   displayText: 'Passaporte ZDG',
}

const ZDGreplyBtn1 = {
   id: 'zdg1',
   displayText: 'Curte',
}

const ZDGreplyBtn2 = {
   id: 'zdg2',
   displayText: 'Compartilha',
}

const callButton = {
   displayText: 'Ligar agora ☎️',
   phoneNumber: '+55 35 9 8875-4197',
}

const ZDGbtnMD = [
   { index: 0, urlButton: ZDGurlBtn1 },
   { index: 1, urlButton: ZDGurlBtn2 },
   { index: 2, callButton },
   { index: 3, quickReplyButton: ZDGreplyBtn1 },
   { index: 4, quickReplyButton: ZDGreplyBtn2 },
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
   const ZDGUsuario = msg.pushName
   const jid = msg.key.remoteJid
   const conversation = msg.message.conversation
   const listRespone = msg.message.listResponseMessage
   const buttonResponse = msg.message.templateButtonReplyMessage

      if (!msg.key.fromMe && jid !== 'status@broadcast' && !ZDGGroupCheck(jid)) {

         console.log("© BOT-ZDG - MENSAGEM : ", msg)

         try{
            ZDGsock.readMessages(jid, msg.key.participant, [msg.key.id])
         }
         catch(e){
            console.log('© BOT-ZDG - Não foi possível enviar o ReadReceipt')
         }

         if(isBlank(conversation) && isBlank(listRespone)){
            if (msg.message.templateButtonReplyMessage.selectedId === 'ZDGContinuar'){
               const templateVideo = {
                  // opicional
                  caption: '```ZAP das Galáxias```\n\n😎 *Faça com um dos mais de 900 alunos da Comunidade e consiga a sua independência financeira explorando todo o poder gratuito da API do WhatsApp, mesmo que você não seja programador.*\n',
                  // opicional
                  footer: '© BOT-ZDG',
                  video: {
                     url: './assets/zdg.mp4',
                  },
                  mimetype: 'video/mp4',
                  gifPlayback: true,
                  templateButtons: ZDGbtnMD
               }
               ZDGSendMessage(jid, templateVideo)
                  .then(result => console.log('RESULT: ', result))
                  .catch(err => console.log('ERROR: ', err))
            }
            if (msg.message.templateButtonReplyMessage.selectedId === 'ZDGSair') {     
               ZDGSendMessage(jid, { text: '*' + ZDGUsuario + '* , muito obrigado pelo seu contato.' })
                  .then(result => console.log('RESULT: ', result))
                  .catch(err => console.log('ERROR: ', err))
            }
         }

         if(isBlank(conversation) && isBlank(buttonResponse)){
            if (msg.message.listResponseMessage.title === '#1 - COMUNIDADE ZDG'){
               const ZDGbtnImage = {
                  caption: '\nOlá *'+  ZDGUsuario +  '*, Pedrinho da NASA aqui \n\nVocê deseja continuar o seu atendimento?!\n',
                  footer: '✅ Ao continuar você concorda com os Termos de Uso e Política de Privacidade',
                  image: {
                     url: './assets/card.jpg',
                  },
                  templateButtons: ZDGbtnMD1
               }
               ZDGSendMessage(jid, ZDGbtnImage)
                  .then(result => console.log('RESULT: ', result))
                  .catch(err => console.log('ERROR: ', err))
            }
         }

         if(isBlank(listRespone) && isBlank(buttonResponse)) {
            const sections = [
               {
                  title: '🔥 TREINAMENTOS MAIS VENDIDOS',
                  rows: [
                     { title: '#1 - COMUNIDADE ZDG', description: '\n+ de 200 vídeo-aulas, suporte pessoal e grupo de alunos. Todas as soluções para copiar e colar. \n 👉 https://zapdasgalaxias.com.br/', rowId: 'zdg1' },
                     { title: '#2 - PASSAPORTE ZDG', description: '\nCurso avançado de Whaticket com chatbot via mysql, dialogflow texto e áudio, n8n, agendamento de mensagem, horário de atendimento e limite de conexões e usuários. \n 👉 https://zapdasgalaxias.com.br/passaporte-zdg/', rowId: 'zdg2' },
                  ],
               },
               {
                  title: '💎 Treinamentos Básicos ',
                  rows: [
                     { title: '#3 - WHATICKET ZDG', description: '\nIncluso na Comunidade ZDG \n👉 https://zapdasgalaxias.com.br/contabo-whaticket/', rowId: 'zdg3' },
                     { title: '#4 - BAILEYS ZDG', description: '\nIncluso na Comunidade ZDG \n👉 https://zapdasgalaxias.com.br/oferta-baileys/', rowId: 'zdg5' },
                     { title: '#5 - VENOM-BOT ZDG', description: '\nIncluso na Comunidade ZDG \n👉 https://zapdasgalaxias.com.br/oferta-venombot/', rowId: 'zdg6' },
                     { title: '#6 - WOOCOMMERCE + ELEMENTOR ZDG', description: '\nIncluso na Comunidade ZDG \n👉 https://zapdasgalaxias.com.br/oferta-woocommerce/', rowId: 'zdg7' },
                     { title: '#7 - BUBBLE ZDG', description: '\nIncluso na Comunidade ZDG \n👉 https://zapdasgalaxias.com.br/oferta-bubble/', rowId: 'zdg8' },
                     { title: '#8 - API + CHATBOT ZDG', description: '\nIncluso na Comunidade ZDG \n👉 https://zapdasgalaxias.com.br/oferta-api/', rowId: 'zdg9' },
                  ],
               },
               {
                  title: '📱 Números virtuais pré-ativado',
                  rows: [
                     { title: '#9 - ZDGNumbers', description: '\nLink \n👉 https://zdg.numbersbr.com/', rowId: 'zdg10' },
                  ],
               },
            ]
            const sendList = {
               title: ZDGUsuario + ', seja bem vindo ao atendimento\n🚀 *ZAP das Galáxias* 🚀\n',
               text: 'Clique no botão para conhecer nossos treinamentos\n',
               buttonText: 'Clique aqui mesmo que você não seja programador',
               footer: '©BOT-ZDG',
               sections: sections
            }
            ZDGSendMessage(jid, sendList)
               .then(result => console.log('RESULT: ', result))
               .catch(err => console.log('ERROR: ', err))
         } 

      }
   })
}

ZDGConnection()






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
      title: cliente + ', a nossa lista de *Juices* está logo abaixo:',
      text: 'Catálogo de Juices\n',
      buttonText: 'Catálogo de Juices',
      footer: '© Infinity Vape 🌬️💨',
      sections: sec_juices
   }
   ZDGSendMessage(jid,listJuices)

}