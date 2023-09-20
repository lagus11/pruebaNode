module.exports.apiGetClient = (phoneNumber) => {
    let fs2 = require('fs');
    let clientSessionData = JSON.parse(fs2.readFileSync('./clients_session.json'));

    const client = clientSessionData.find((client) => client.telefono == phoneNumber );
    return client;
}

module.exports.apiGetCustomers = (quantity = 10) => {
    let fs2 = require('fs');
    let customersData = JSON.parse(fs2.readFileSync('./bd/customers.json')).data;
    const customers_slice = customersData.slice(0, quantity);
    const customers = customers_slice.map((customer) => {
        return { 
            Name: customer.Name, 
            CustomerNumber: customer.CustomerNumber
        }
    });

    return customers;
}

module.exports.apiGetCustomer = (customerFind) => {
    let fs2 = require('fs');
    let customersData = JSON.parse(fs2.readFileSync('./bd/customers.json')).data;
    const customer_find = customersData.find((customer) => customer.CustomerNumber == customerFind);
    return customer_find;
}

module.exports.apiGetProducts = (quantity) => {
    let fs2 = require('fs');
    let productsData = JSON.parse(fs2.readFileSync('./bd/Products.json')).data;
    const products_slice = productsData.slice(0, quantity);
    const products = products_slice.map((product) => {
        return { SKU: product.SKU, Name: product.Name}
    });

    return products;
}

module.exports.apiGetProduct = (productFind) => {
    let fs2 = require('fs');
    let productsData = JSON.parse(fs2.readFileSync('./bd/Products.json')).data;
    const product_find = productsData.find((product) => product.SKU == productFind);
    return product_find;
}