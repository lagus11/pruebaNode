const { sendMessage } = require("../core");
const { getClientActivity, updateClientActivity } = require("../global_functions/utilities");
const mimeDb = require('mime-db');
const moment = require('moment');
const fs = require('fs');

module.exports.main = async function (client, msg) {
    let {from, to, body} = msg;
    const clientActivity = getClientActivity(client.telefono);
    if (body == "salir" || body == "Salir" || body == "Menú" || body == "Menu" || body == "menú" || body == "menu") {
        backagendaDayMenu(client, clientActivity, msg);
    } else if(msg.hasMedia) {
        const media = await msg.downloadMedia();
        saveMedia(media,from,body);
        clientActivity.estatus_comprobante = 'enviado';
    } else if(!msg.hasMedia) {
        sendMessage(from, 'Envíe su fotografía de evidencia');
    }
} // listo

const saveMedia = (media,from,body) => {
    number = from.replace('@c.us', '');
    promoId = body.replace('promo','');
    const today = moment().format('DDMMYYYYhhmmss');
    const extensionProcess = mimeDb[media.mimetype];
    const ext = extensionProcess.extensions[0];
    if(ext == 'jpeg' || ext == 'png') {
        fs.writeFile(`./services_evidences/public/img/evidences/${number.concat("-").concat(today)}.${ext}`, media.data, { encoding: 'base64' }, function (err) {       
            if (err) {
            console.log(err);
            console.log('** Error al grabar el Archivo  **');
            } else {
                sendMessage(from, 'Imagen registrada con exito');
            } 
        });
    } else {
        sendMessage(from, 'Formato inválido, ingrese un formato válido para la fotografía (JPEG o PNG)')
    }
} // listo



const backagendaDayMenu = (client, clientActivity, msg) => {
    delete clientActivity.subMenu;
    updateClientActivity(msg.from, clientActivity);
    const agendaDay = require('../bots/agendaDay.js');
    const {from, to} = msg;
    agendaDay.main(client, {from, to, body: ""});
}




