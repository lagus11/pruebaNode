const { apiGetProducts, apiGetProduct } = require("../bd/api");
const { sendMessage } = require("../core");
const { updateClientActivity, getClientActivity } = require("../global_functions/utilities");

module.exports.main = async function (client, msg) {
    let {from, to, body} = msg;
    const clientActivity = getClientActivity(client.telefono);
    if (body == "salir" || body == "Salir" || body == "Menú" || body == "Menu" || body == "menú" || body == "menu") {
        backagendaDayMenu(client, clientActivity, msg);
    } else if(clientActivity.subMenu.productos){
        registerProducts(client, msg);
    }else if(!clientActivity.subMenu.productos) {
        addProductsInJson(client, clientActivity, msg);
    } 
}

const backagendaDayMenu = (client, clientActivity, msg) => {
    delete clientActivity.subMenu;
    updateClientActivity(msg.from, clientActivity);
    const agendaDay = require('../bots/agendaDay.js');
    let {from, to} = msg;
    agendaDay.main(client, {from, to, body: ""});
}

const registerProducts = (client, msg) => {
    let {from, to, body} = msg;
    let clientActivity = getClientActivity(client.telefono);

    for (const key in clientActivity.subMenu.productos) {
        if(clientActivity.subMenu.productos[key].mostrado == "no"){
            sendMessage(from, "Este Producto esta agotado? \n" + clientActivity.subMenu.productos[key].Name + "\n *si / no*");
            clientActivity.subMenu.productos[key].mostrado = "si";
            updateClientActivity(from, clientActivity);
            return;
        } else if (clientActivity.subMenu.productos[key].registrado == "no"){
            if(!(body == "si" || body == "no")){
                sendMessage(from, "✋Ingrese una opción *si / no*");
                return;
            }
            clientActivity.subMenu.productos[key].registrado = "si";
            clientActivity.subMenu.productos[key].agotado = body;
            updateClientActivity(from, clientActivity);
        } 
    }
    sendMessage(from, "Productos registrados con exito");
    backagendaDayMenu(client, clientActivity, msg);
}

const addProductsInJson = (client, clientActivity, msg) => {
    let {from, to, body} = msg;
    const products = apiGetProducts(5);
    let productsFilter = products.map(product => {
        return {
            Name: product.Name,
            SKU: product.SKU, 
            registrado: "no",
            mostrado: "no",
            agotado: "no",
        } 
    });
    clientActivity.subMenu.productos = productsFilter;
    updateClientActivity(from, clientActivity);
    registerProducts(client, msg);
}