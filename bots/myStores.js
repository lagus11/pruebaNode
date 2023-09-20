
const { apiGetCustomers, apiGetCustomer } = require('../bd/api');
const { sendMessage, principalMenu } = require('../core');
const { updateClientActivity, getClientActivity } = require('../global_functions/utilities');

module.exports.main = async function (client, msg) {
    let {from, to, body} = msg;
    const clientActivity = getClientActivity(client.telefono);
    if (body == "salir" || body == "Salir" || body == "Menú" || body == "Menu" || body == "menú" || body == "menu") {
        backMenu(client, clientActivity, msg);
    } else if(clientActivity.clientes_mostrados && clientActivity.clientes_mostrados == "si"){
        // accion
        let bodySplit = body.replace(/\s+/g, '').split("#");
     
        if(bodySplit.length != 2 || bodySplit[0] != "Visita") {
            sendMessage(from, "✋ para iniciar visita es *Visita #número cliente*");    
            return;
        }

        customer = apiGetCustomer(bodySplit[1]);
        if(customer){
            sendMessage(from, "Cliente registrado");
            getCustomers(from, clientActivity);
        }else{
            sendMessage(from, "✋ Seleccione un cliente valido");
        }
    }else{
        getCustomers(from, clientActivity);
    }
} // listo

const getCustomers = (from, clientActivity) => {
    const customers = apiGetCustomers(20);
    let ms = "*Clientes*\n";
    customers.forEach((customer, index) => {
        ms +=   (index + 1) + " - " + customer.Name + " #" + customer.CustomerNumber + "\n";
    });
    ms += "\n para iniciar visita es *Visita #número cliente*";
    ms += '\n\n Escribe *menú o salir* para regresar';
    sendMessage(from, ms);
    
    clientActivity.clientes_mostrados = "si";
    updateClientActivity(from, clientActivity);
}

const backMenu = (client, clientActivity, msg) => {
    delete clientActivity.clientes_mostrados;
    clientActivity.current_activity = "menu_principal";
    updateClientActivity(msg.from, clientActivity);
    principalMenu(client, msg);
}


