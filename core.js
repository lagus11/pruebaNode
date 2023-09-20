'use strict';
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrCode = require('qrcode-terminal');
const { apiGetClient } = require('./bd/api');
const { getTimeDay } = require('./global_functions/timeDay');
const { getClientActivity, createClientActivity, updateClientActivity } = require('./global_functions/utilities');
const express = require('express');
const app = express();  //ejecuta express obtengo objeto

app.use(express.json()); //llega un dato al servidor, comprueba si es json, si lo es, accedemos codigo en servidor

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one doesn't works in Windows
      '--disable-gpu'] }
});

const listenMessage = () => {
    client.on('message', async msg => {
        let {from,to,body} = msg;
        const client = apiGetClient(from);
        if(client){
            const clientActivity = getClientActivity(client.telefono);
            if(clientActivity){
                if(clientActivity.current_activity == 'menu_principal' || clientActivity.current_activity == ''){
                    switch (body) {
                        case "1":
                            clientActivity.current_activity = 'agenda_dia';
                            updateClientActivity(from, clientActivity);
                            const agendaDay = require('./bots/agendaDay.js');
                            agendaDay.main(client, msg);
                            break;
                        case "2":
                            clientActivity.current_activity = 'mis_tiendas';
                            updateClientActivity(from, clientActivity);
                            const myStores = require('./bots/myStores.js');
                            myStores.main(client, msg);
                            break;
                        default:
                            this.principalMenu(client, msg);
                        break;
                    }
                }else if (clientActivity.current_activity == 'agenda_dia'){
                    const agendaDay = require('./bots/agendaDay.js');
                    agendaDay.main(client, msg);
                }else if (clientActivity.current_activity == 'mis_tiendas'){
                    const myStores = require('./bots/myStores.js');
                    myStores.main(client, msg);
                }
            }else{
                const createClient = createClientActivity(client.telefono);
                if(createClient){
                    this.principalMenu(client, msg);
                }
            }
        }else{
            sendMessage(from, "Sin Acceso!!");
        }
    });
}

module.exports.principalMenu = (client, {from}) => {
    const timeDay = getTimeDay(client.language);
    let ms = "";

    if (client.language == 'es') { ms = '👋 Hola *' + client.name + '*, ' + timeDay + ', bienvenido, enseguida le mostramos las acciones que puede realizar'; }
    if (client.language == 'en') { ms = '👋 Hi *' + client.name + '*, ' + timeDay + ', welcome, now we show you the actions you can do'; }     
    sendMessage(from, ms);
    ms = "*MENÚ PRINCIPAL* \n";
    ms = 'Seleccione una Opción \n'
                + '1️⃣ Agenda del Día \n'
                + '2️⃣ Mis Tiendas';
    sendMessage(from, ms);
}

client.on('qr', (qr) => {
   qrCode.generate(qr, {small: true}); 
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('Client is ready!');
    listenMessage();
});

client.initialize();

const sendMessage = (to, message) => {
    client.sendMessage(to,message);
}

module.exports.sendMessage = function(to, message) {
    client.sendMessage(to,message);
}


app.get('/message', async (req, res) => {
    try{
        res.json("todo bien, funciona la url message");
    }catch(error){
        console.log(error);
    }
});

app.get('/', async (req, res) => {
    try{
        res.json("todo bien, funciona la url principal");
    }catch(error){
        console.log(error);
    }
});

app.listen(process.env.PORT || 9004, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

