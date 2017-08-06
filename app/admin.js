'use strict';


var admin = require("firebase-admin"),
    serviceAccount = require("../private/serviceAccountKey.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chai-770da.firebaseio.com"
});


var initialUserDataLoaded = false;
var initializeOrderList = false;
admin.database().ref("users/").on('child_added', function(childSnapshot, prevChildKey) {
    if (initialUserDataLoaded) {
        var userData = childSnapshot.val();
        admin.database().ref("adminEmails/").once('value', function(snapshot) {
            var adminEmails = snapshot.val();
            var role = 'user';
            var userUid = userData.uid;
            var userEmail = userData.profile.email.replace(/[.$\[\]\/#]/g, ',');
            if (adminEmails[userEmail]) {
                role = 'admin';
            }
            admin.database().ref().child('/roles').update({
                [userUid]: role
            }).then(function(res) {
                console.log('role Updated');
            }).catch(function(err) {
                console.log(err);
            })
        })
    }
});

admin.database().ref("users/").once('value', function(snapshot) {
    initialUserDataLoaded = true;
});


admin.database().ref("orderList/").on('child_added', function(childSnapshot, prevChildKey) {
    if (initializeOrderList) {
        var data = childSnapshot.val();
        calulateTotal(data);
    }
});

admin.database().ref("orderList/").on('child_changed', function(childSnapshot, prevChildKey) {
    if (initializeOrderList) {
        var data = childSnapshot.val();
        calulateTotal(data)
    }
});

function calulateTotal(data) {
    admin.database().ref('/adminAccess').once('value', function(snap) {
        var adminData = snap.val();
        var obj = {};
        Object.keys(data[adminData.orderType]).forEach(function(uid) {
            console.log(uid);
            Object.keys(data[adminData.orderType][uid]).forEach(function(orderItem) {
                if (obj[orderItem]) {
                    obj[orderItem] = obj[orderItem] + data[adminData.orderType][uid][orderItem].value;
                } else {
                    obj[orderItem] = data[adminData.orderType][uid][orderItem].value;
                }
            });
        });
        admin.database().ref('/totalOrder/' + adminData.orderType).set(obj).then(function(res) {
            console.log('total calculated');
        }).catch(function(err) {
            console.log(err);
        });
    });
}

admin.database().ref("orderList/").once('value', function(snapshot) {
    initializeOrderList = true;
});


module.exports = {};