const fs = require('fs');

module.exports.getClientActivity = (phoneNumber) => {
    let fs2 = require('fs');
    let clientSessionData = JSON.parse(fs2.readFileSync('./user_activity.json'));
    const client = clientSessionData.find((client) => client.telefono == phoneNumber );
    return client;
}

module.exports.createClientActivity = (from) => {
    try {
        let fs2 = require('fs');
        let clientSessionData = JSON.parse(fs.readFileSync('./user_activity.json'));
        const newClient = {telefono: from, current_activity: 'menu_principal'};

        clientSessionData.push(newClient);
        fs.writeFileSync('./user_activity.json', JSON.stringify(clientSessionData, null, 2));
    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
}

module.exports.updateClientActivity = (from, activity) => {
    try {
        let fs2 = require('fs');
        let userActivity = JSON.parse(fs2.readFileSync('./user_activity.json'));
        if(userActivity.length > 0){
            const idx_arr = this.getIdxUserActivityJson(from);
            if(idx_arr != null){
                userActivity[idx_arr] = activity;
                fs.writeFileSync('./user_activity.json', JSON.stringify(userActivity, null, 2));
            }
        }
    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
}




// evidencias ----------

module.exports.getIdxClientSessionJson = function(UserId) {
    let fs2 = require('fs');
    let clientSessionData = JSON.parse(fs2.readFileSync('./clients_session.json'));
    var idx_cs = null;
    clientSessionData.forEach((cs, idx) => {
        if(cs.telefono == UserId) {
            idx_cs = idx;
        }
    });

    return idx_cs;
}

module.exports.getIdxUserActivityJson = function(UserId) {
    let fs2 = require('fs');
    let userActivityData = JSON.parse(fs2.readFileSync('./user_activity.json'));
    var idx_cs = null;
    userActivityData.forEach((cs, idx) => {
        if(cs.telefono == UserId) {
            idx_cs = idx;
        }
    });

    return idx_cs;
}