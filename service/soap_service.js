var fs = require("fs");
var UserModel = require('../models/users');

var myService = {
  MessengerService: {
    MessengerServicePort: {
      getData: function (args, callback) {
        console.log('SOAP_SERVICE: args: '+_V(args._id));

        var _id = _V(args._id);

        UserModel.findById(_id, (err, user)=>{
          if(err){
            console.log('SOAP_SERVICE: error in findById');
            callback(null, {error: 'occured'});
          } else {
            var responseData = {
              first_name: user.personal_data.first_name,
              last_name: user.personal_data.last_name,
              email: user.personal_data.email
            };

            console.log("SOAP_SERVICE: data to reply: \n "+JSON.stringify(responseData, null, 2)+'\n');
            callback(null, responseData);
          }
        });
      }
    }
  }
};

// Because ksoap2 lib throws an object
function _V(val) {
    var isObject = (a) => (!!a) && (a.constructor === Object);
    if (isObject(val)) {
        return val.$value;
    } else {
        return val;
    }
}

var xml = fs.readFileSync(__dirname + '/my_service.wsdl', 'utf8');

module.exports.xml = xml;
module.exports.myService = myService;
