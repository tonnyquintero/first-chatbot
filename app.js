const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const path = require('path')
const fs = require('fs')
const { delay } = require('@whiskeysockets/baileys')

const menuPath = path.join(__dirname, 'mensajes', 'menu.txt')
const menu = fs.readFileSync(menuPath, 'utf-8')


const flowMenuRest = addKeyword(EVENTS.ACTION)
    .addAnswer('Aqui está nuestro Menú 😋', {
        media: 'https://www.sus-medicos.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FmenuRestaurante.2e9ef668.png&w=1080&q=75',
        delay: 2000
    })


const flowPReservar = addKeyword(EVENTS.ACTION)
    .addAnswer('Haz tu reserva desde nuestra página web 🏠: www.tu-restaurante.com')


const flowConsulta = addKeyword(EVENTS.ACTION)
    .addAnswer('Este es la zona de Consultas aún en construcción')



// -----------------------FUNCION BIENVENIDA-----------------------

const flowWelcome = addKeyword(EVENTS.WELCOME)
    .addAnswer('Bienvenido a tu restaurante 👨🏻‍🍳 estamos para servirte 🍝🥤   ESCRIBE LA PALABRA "MENU"', {
        delay: 1000,
        media: 'https://www.sus-medicos.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FlogoRestaurante.bf592f7c.png&w=1080&q=75'
    })

const menuFlow = addKeyword('menu').addAnswer(
    menu,
    {capture: true},
    async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
        if (!['1', '2', '3', '0'].includes(ctx.body)) {
            return fallBack (
                'Respuesta no válida, por favor selecciona una de las opciones'
            );
        }
        switch (ctx.body) {
            case '1': 
                return gotoFlow(flowMenuRest)
            case '2': 
                return gotoFlow(flowPReservar)
            case '3': 
                return gotoFlow(flowConsulta)
            case '0':
                return await flowDynamic(
                    'Saliendo... Puedes volver a acceder a este menú escribiendo *menu*'
                )
                
        }
    }
    
)


const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([ flowWelcome, menuFlow, flowMenuRest, flowPReservar, flowConsulta])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
