const { apiGetProducts } = require('../bd/api.js');
const { sendMessage } = require('../core.js');
const { getClientActivity, updateClientActivity } = require('../global_functions/utilities.js');

module.exports.main = async function (client, msg) {
    let {from, to, body} = msg;
    const clientActivity = getClientActivity(client.telefono);
    if (body == "salir" || body == "Salir" || body == "Menú" || body == "Menu" || body == "menú" || body == "menu") {
        backagendaDayMenu(client, clientActivity, msg);
    } else if(clientActivity.subMenu.productos){
        registerProducts(client, msg);
    } else if(!clientActivity.subMenu.productos) {
        const products = apiGetProducts(5);
        let productsFilter = products.map(product => {
            return {
                Name: product.Name,
                SKU: product.SKU, 
                registrado: "no",
                mostrado: "no",
                cantidad: 0,
            } 
        });
        clientActivity.subMenu.productos = productsFilter;
        updateClientActivity(from, clientActivity);
        registerProducts(client, msg);
    } 
} // listo

const backagendaDayMenu = (client, clientActivity, msg) => {
    delete clientActivity.subMenu;
    updateClientActivity(msg.from, clientActivity);
    const agendaDay = require('../bots/agendaDay.js');
    const {from, to} = msg;
    agendaDay.main(client, {from, to, body: ""});
}

const registerProducts = (client, msg) => {
    let {from, to, body} = msg;
    let clientActivity = getClientActivity(client.telefono);
    
    for (const key in clientActivity.subMenu.productos) {
        if(clientActivity.subMenu.productos[key].mostrado == "no"){
            sendMessage(from, "Cantidad para el producto: \n" + clientActivity.subMenu.productos[key].Name + "\n");
            clientActivity.subMenu.productos[key].mostrado = "si";
            updateClientActivity(from, clientActivity);
            return;
        } else if (clientActivity.subMenu.productos[key].registrado == "no"){
            if(isNaN(body)){
                sendMessage(from, "✋ Ingrese una cantidad");
                return;
            }
            clientActivity.subMenu.productos[key].registrado = "si";
            clientActivity.subMenu.productos[key].cantidad = body;
            updateClientActivity(from, clientActivity);
        } 
    }

    sendMessage(from, "Productos registrados con exito");
    backagendaDayMenu(client, clientActivity, msg);
}

