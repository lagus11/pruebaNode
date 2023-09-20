const { sendMessage } = require('../core.js');
const { updateClientActivity, getClientActivity } = require('../global_functions/utilities.js');

module.exports.main = async function (client, msg) {
    let {from, to, body} = msg;
    const clientActivity = getClientActivity(client.telefono);

    if(clientActivity.subMenu.option && clientActivity.subMenu.option == "1"){
        myPendingsActivities(client, clientActivity, msg);
    } else if(clientActivity.subMenu.option && clientActivity.subMenu.option == "2"){
        availableActivities(client, clientActivity, msg);
    } else if(clientActivity.subMenu.option && clientActivity.subMenu.option == "3"){
        closedActivities(client, clientActivity, msg);
    } else if(clientActivity.subMenu.option && clientActivity.subMenu.option == "4"){
        myPaymentDetails(client, clientActivity, msg);
    } else if (!clientActivity.subMenu.option){
        pendingActions(client, clientActivity, msg);
    }
    
} // listo

const showMenu = (from) => {
    let ms = 'Seleccione una Opción \n'
        + '1️⃣ Mis actividades Pendientes \n'
        + '2️⃣ Actividades Disponibles \n'
        + '3️⃣ Actividades Cerradas \n'
        + '4️⃣ Mis Datos de Pago'; 
    ms += '\n\n Escribe *menú o salir* para regresar';
    sendMessage(from, ms);
}

const backagendaDayMenu = (client, clientActivity, msg) => {
    delete clientActivity.subMenu;
    updateClientActivity(msg.from, clientActivity);
    const agendaDay = require('../bots/agendaDay.js');
    const {from, to} = msg;
    agendaDay.main(client, {from, to, body: ""});
}

const pendingActions = (client, clientActivity, msg) => {
    let {from, to, body} = msg;
    if (body == "salir" || body == "Salir" || body == "Menú" || body == "Menu" || body == "menú" || body == "menu") {
        backagendaDayMenu(client, clientActivity, msg);
    } else {
        if(clientActivity.subMenu.menu_acciones_pendiente){
            switch (body) {
                case "1":
                    myPendingsActivities(client, clientActivity, msg);
                    break;
                case "2":
                    availableActivities(client, clientActivity, msg);
                    break;
                case "3":
                    closedActivities(client, clientActivity, msg);
                    break;
                case "4":
                    myPaymentDetails(client, clientActivity, msg);
                    break;
                default:
                    showMenu(from);
                    break;
            }
        } else{ 
            clientActivity.subMenu.menu_acciones_pendiente = true;
            updateClientActivity(from, clientActivity);
            showMenu(from);
        }
    } 
}

const myPendingsActivities = (client, clientActivity, msg) => {
    let {from, to, body} = msg;
    if (clientActivity.subMenu.option && (body == "salir" || body == "Salir" || body == "Menú" || body == "Menu" || body == "menú" || body == "menu")) {
        delete clientActivity.subMenu.option;
        updateClientActivity(from, clientActivity);
        showMenu(from);
    }else{
        clientActivity.subMenu.option = "1";
        updateClientActivity(from, clientActivity);
        let ms = '*⌚ Actividades Pendientes* \n\n';
        ms += `Num actividad: *1* \n`;
                ms += `Actividad: *Entrega* \n`;
                ms += `Cliente: *ESTACION DEL TREN* \n`;
                ms += `Fecha compromiso: *2023-09-03* \n`;
                ms += `Tipo de accion: *URGENTE*`; 
                ms += "\n\nEscribe *cerrar #* para cerrar una actividad pendiente";
        ms += '\n\n Escribe *menú o salir* para regresar';
        sendMessage(from, ms);
    }
}

const availableActivities = (client, clientActivity, msg) => {
    let {from, to, body} = msg;
    if (clientActivity.subMenu.option && (body == "salir" || body == "Salir" || body == "Menú" || body == "Menu" || body == "menú" || body == "menu")) {
        delete clientActivity.subMenu.option;
        updateClientActivity(from, clientActivity);
        showMenu(from);
    }else{
        clientActivity.subMenu.option = "2";
        updateClientActivity(from, clientActivity);
        let ms = '*⌛ Actividades Disponibles* \n\n';
        ms += `Num actividad: *4* \n`;
                ms += `Actividad: *SDF* \n`;
                ms += `Cliente: *PALAPA GEO 2* \n`;
                ms += `Fecha compromiso: *2023-09-05* \n`;
                ms += `Tipo de accion: *Tipo_2*`; 
                ms += " \n\nEscribe *asignar #* para asignar una actividad disponible";
        ms += '\n\nEscribe *menú o salir* para regresar';
        sendMessage(from, ms);
    }
}

const closedActivities = (client, clientActivity, msg) => {
    let {from, to, body} = msg;
    if (clientActivity.subMenu.option && (body == "salir" || body == "Salir" || body == "Menú" || body == "Menu" || body == "menú" || body == "menu")) {
        delete clientActivity.subMenu.option;
        updateClientActivity(from, clientActivity);
        showMenu(from);
    }else{
        clientActivity.subMenu.option = "3";
        updateClientActivity(from, clientActivity);
        let ms = '*✅ Actividades Cerradas* \n\n';
            ms += `Num actividad: *2* \n`;
            ms += `Actividad: *SDF* \n`;
            ms += `Cliente: *PALAPA GEO 1* \n`;
            ms += `Fecha compromiso: *2023-09-01* \n`;
            ms += `Fecha cierre: *2023-09-12* \n`;
            ms += `Tipo de accion: *Tipo_1* \n`;
            ms += `\nMás detalles: *http://services-evidences.com/evidences/*`;
            ms += '\n\nEscribe *menú o salir* para regresar';
        sendMessage(from, ms);
    }
}

const myPaymentDetails = (client, clientActivity, msg) => {
    let {from, to, body} = msg;
    if (clientActivity.subMenu.option && (body == "salir" || body == "Salir" || body == "Menú" || body == "Menu" || body == "menú" || body == "menu")) {
        delete clientActivity.subMenu.option;
        updateClientActivity(from, clientActivity);
        showMenu(from);
    }else{
        clientActivity.subMenu.option = "4";
        updateClientActivity(from, clientActivity);
        let ms = '*📖 Mis Datos de Pago* \n\n';
            ms += `Número de cuenta bancaria: *123456789987654321* \n`;
            ms += `TIN: *321* \n`;
            ms += `CURP: *HEME970311NRTRJG02* \n\n`;
            ms += `Si desea solicitar un cambio, envíe un mensaje al siguiente número *xxxxxxxxxx*`;
            ms += '\n\nEscribe *menú o salir* para regresar';
        sendMessage(from, ms);
    }
}