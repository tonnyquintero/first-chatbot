const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')


const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer('🙌 Hola bienvenid@ como estas?')
    .addAnswer('Bienvenido a tu restaurante')

const flowWelcome = addKeyword(EVENTS.WELCOME)
    .addAnswer('Este es el flujo welcome', {
        delay: 3000,
        media: 'https://www.sus-medicos.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsus1.e20ce011.jpg&w=640&q=75'
    }, 
async (ctx, ctxFn) => {
    console.log(ctx.body);
    const palabra = ctx.body
    await ctxFn.flowDynamic(`Escribiste ${palabra}`)
})

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal, flowWelcome])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
