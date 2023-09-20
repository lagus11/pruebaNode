const { apiGetCustomers } = require("../bd/api");
const { sendMessage, principalMenu } = require("../core");
const { updateClientActivity, getClientActivity } = require("../global_functions/utilities");

module.exports.main = async function (client, msg) {
    let {from, to, body} = msg;
    const clientActivity = getClientActivity(client.telefono);
        if(clientActivity.subMenu && clientActivity.subMenu.activity == "chequeo_precio"){
            goToPriceCheck(client, clientActivity, msg);
        } else if(clientActivity.subMenu && clientActivity.subMenu.activity == "reporte_agotado"){
            goToSoldOutReport(client, clientActivity, msg);
        } else if(clientActivity.subMenu && clientActivity.subMenu.activity == "inventario"){
            goToInventory(client, clientActivity, msg);
        } else if(clientActivity.subMenu && clientActivity.subMenu.activity == "acciones_pendientes"){
            goToPendingActions(client, clientActivity, msg);
        } else if(clientActivity.subMenu && clientActivity.subMenu.activity == "fotos_ejecucion"){
            goToExecutionPhoto(client, clientActivity, msg);
        } else if (!clientActivity.subMenu && clientActivity.current_activity == "agenda_dia"){
            agendaDay(client, clientActivity, msg);
        }
} // listo

const agendaDay = (client, clientActivity, msg) => {
    let {from, to, body} = msg;
    if(!clientActivity.subMenu && (body == "salir" || body == "Salir" || body == "Menú" || body == "Menu" || body == "menú" || body == "menu")){
        backMenu(client, clientActivity, msg);
    } else if (clientActivity.cliente_seleccionado) {
        switch (body) {
            case "1":
                goToPriceCheck(client, clientActivity, msg);
                break;
            case "2":
                goToSoldOutReport(client, clientActivity, msg);
                break;
            case "3":
                goToInventory(client, clientActivity, msg);
                break;
            case "4":
                goToPendingActions(client, clientActivity, msg);
                break;
            case "5":
                goToExecutionPhoto(client, clientActivity, msg);
                break;
            default:
                showMenu(from);
                break;
        }
    } else if(clientActivity.clientes_mostrados && clientActivity.clientes_mostrados == "si" && !clientActivity.cliente_seleccionado){
        // accion
        const numberOption = body.split(" ");
        if(numberOption.length != 2) {
            sendMessage(from, "✋ Para iniciar escriba la palabra *Iniciar + Num visita*");
            return;
        }
        if(numberOption[0].replace(/\s+/g, '') != "Iniciar") {
            sendMessage(from, "✋ Ingrese palabra Iniciar");
            return;
        }
        if(isNaN(numberOption[1].replace(/\s+/g, ''))) {
            sendMessage(from, "✋ Ingrese Num visita");
            return;
        }
        customer = clientSelect(numberOption[1], clientActivity.clientes);
        if(customer){
            delete clientActivity.clientes;
            clientActivity.cliente_seleccionado = customer.CustomerNumber;
            updateClientActivity(from, clientActivity);
            sendMessage(from, "*" + customer.Name + "* registrado");
            showMenu(from);
        }else{
            sendMessage(from, "✋ Seleccione un cliente valido");
        }
    } else if(clientActivity.cliente_seleccionado &&  clientActivity.cliente_seleccionado != ''){
        showMenu(from);
    } else{
        getCustomers(from, clientActivity);
    }
}

const getCustomers = (from, clientActivity) => {
    const customers = apiGetCustomers(4);
    addCustomersInJson(from, clientActivity, customers);
    let ms = "*Clientes*\n";
    customers.forEach((customer, index) => {
        ms += (index + 1) + " - " + customer.Name + " #" + customer.CustomerNumber+ "\n";
    });
    ms += "\n para iniciar escriba la palabra *Iniciar + Num visita*";
    ms += '\n\n Escribe *menú o salir* para regresar';
    sendMessage(from, ms);
    
    clientActivity.clientes_mostrados = "si";
    updateClientActivity(from, clientActivity);
}

const addCustomersInJson = (from, clientActivity, customers) => {
    clientActivity.clientes = customers;
    updateClientActivity(from, clientActivity);
}

const clientSelect = (indexFind, clients) => {
    const indexOriginalFind = indexFind - 1;
    const clientFind = clients.find((client, index) => index === indexOriginalFind);
    return clientFind;
};

const backMenu = (client, clientActivity, msg) => {
    delete clientActivity.clientes_mostrados;
    if(clientActivity.cliente_seleccionado){
        delete clientActivity.cliente_seleccionado;
    }
    if(clientActivity.clientes){
        delete clientActivity.clientes;
    }
    clientActivity.current_activity = "menu_principal";
    updateClientActivity(msg.from, clientActivity);
    principalMenu(client, msg);
}

const showMenu = (from) => {
    ms = 'Seleccione una Opción \n'
                + '1️⃣ Chequeo de Precios \n'
                + '2️⃣ Reporte Agotados \n'
                + '3️⃣ Inventario \n'
                + '4️⃣ Acciones Pendientes \n'
                + '5️⃣ Fotos Ejecución \n';
    ms += '\n\n Escribe *menú o salir* para regresar';
    sendMessage(from, ms);
}

const goToPriceCheck = (client, clientActivity, msg) => {
    let {from, to, body} = msg;
    if(!clientActivity.subMenu){
        clientActivity.subMenu= { activity: 'chequeo_precio'};
        updateClientActivity(from, clientActivity);
    }
    const priceCheck = require('../bots/priceCheck.js');
    priceCheck.main(client, msg);
}

const goToSoldOutReport = (client, clientActivity, msg) => {
    let {from, to, body} = msg;
    if(!clientActivity.subMenu){
        clientActivity.subMenu= { activity: 'reporte_agotado'};
        updateClientActivity(from, clientActivity);
    }
    const soldOutReport = require('../bots/soldOutReport.js');
    soldOutReport.main(client, msg);
}

const goToInventory = (client, clientActivity, msg) => {
    let {from, to, body} = msg;
    if(!clientActivity.subMenu){
        clientActivity.subMenu= { activity: 'inventario'};
        updateClientActivity(from, clientActivity);
    }
    const inventory = require('../bots/inventory.js');
    inventory.main(client, msg);
}

const goToPendingActions = (client, clientActivity, msg) => {
    let {from, to, body} = msg;
    if(!clientActivity.subMenu){
        clientActivity.subMenu= { activity: 'acciones_pendientes'};
        updateClientActivity(from, clientActivity);
    }
    const pendingActions = require('../bots/pendingActions.js');
    pendingActions.main(client, msg);
}

const goToExecutionPhoto = (client, clientActivity, msg) => {
    let {from, to, body} = msg;
    if(!clientActivity.subMenu){
        clientActivity.subMenu= { activity: 'fotos_ejecucion'};
        updateClientActivity(from, clientActivity);
    }
    const executionPhoto = require('../bots/executionPhoto.js');
    executionPhoto.main(client, msg);
}

