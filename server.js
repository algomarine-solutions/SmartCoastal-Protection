//===========================================================================================================================    
//                                            SERVER CONFIGURATION
//===========================================================================================================================   

const express = require('express');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

//===========================================================================================================================    
//                                            SCRIPT STATUS
//===========================================================================================================================

/*
Note :
dev = in development mode
prod = in production/hosted mode

*/

const ENV = "dev";

//===========================================================================================================================    
//                                            ROUTING PAGE
//===========================================================================================================================

const adminroute = require('./routing/admin.js');
const userroute = require('./routing/user.js');

app.use(adminroute);
app.use(userroute);

app.get("*", (req, res) => {
    res.sendStatus(404);
})

if(ENV === "dev") {
    app.listen(2200, () => console.log("app listen in port 2200"));
}
else {
    app.listen();
}