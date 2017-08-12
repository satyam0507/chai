// Initialize Firebase
var config = {
    apiKey: "AIzaSyA0dixZ3TY68p4H5msfqkmBwHav4nPFiFw",
    authDomain: "chai-770da.firebaseapp.com",
    databaseURL: "https://chai-770da.firebaseio.com",
    projectId: "chai-770da"
};

firebase.initializeApp(config);

var provider = new firebase.auth.GoogleAuthProvider();
var logedIn;


const signUpEl = document.querySelectorAll('.signUp');
const logBtnElArray = document.querySelectorAll('.js-userInfo');
const mainView = document.querySelector('#js-main-view');
if (logBtnElArray && logBtnElArray.length > 0) {
    logBtnElArray.forEach(function(logBtnEl) {
        logBtnEl.addEventListener('click', function(evt) {
            evt.preventDefault();
            const logModelEl = document.querySelector('.model-userInfo');
            if (logModelEl) {
                logModelEl.classList.toggle('hidden');
            }
        });
    })


}

function changeAuthText(logedIn) {
    if (signUpEl) {
        if (logedIn) {
            signUpEl.forEach(function(element) {
                element.innerText = 'logout';
            }, this);
            loggedIn();
        } else {
            signUpEl.forEach(function(element) {
                element.innerText = 'login';
            }, this);
            loggedOut();
        }
    }
}

function loggedIn() {
    var user = firebase.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;

    showMainView();
    if (user != null) {
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid; // The user's ID, unique to the Firebase project. Do NOT use
        // this value to authenticate with your backend server, if
        // you have one. Use User.getToken() instead.
    }
    var userInfoEl = document.querySelectorAll('.userInfo');
    if (userInfoEl && userInfoEl.length > 0) {
        var userIamgeEl = document.querySelectorAll('.js-userImage');
        var userNameEl = document.querySelectorAll('.js-userName');
        var userEmailEl = document.querySelectorAll('.js-userEmail');
        if (userIamgeEl) {
            userIamgeEl.forEach(function(element) {
                element.setAttribute('src', photoUrl);
                element.classList.remove('hidden');
            }, this);
        }
        if (userNameEl) {
            userNameEl.forEach(function(element) {
                element.innerText = name;
            }, this);
        }
        if (userEmailEl) {
            userEmailEl.forEach(function(element) {
                element.innerText = email;
            }, this);
        }
    }

}

function loggedOut() {
    var userInfoEl = document.querySelectorAll('.userInfo');
    hideMainView();
    if (userInfoEl && userInfoEl.length > 0) {
        var userIamgeEl = document.querySelectorAll('.js-userImage');
        var userNameEl = document.querySelectorAll('.js-userName');
        var userEmailEl = document.querySelectorAll('.js-userEmail');
        if (userIamgeEl) {
            userIamgeEl.forEach(function(element) {
                element.setAttribute('src', '/static/image/avatar.png');
                // element.classList.add('hidden');
            }, this);
        }
        if (userNameEl) {
            userNameEl.forEach(function(element) {
                element.innerText = '';
            }, this);
        }
        if (userEmailEl) {
            userEmailEl.forEach(function(element) {
                element.innerText = '';
            }, this);
        }
    }
}

function signInHandler(evt) {
    evt.preventDefault();
    if (!logedIn) {
        firebase.auth().signInWithPopup(provider).then(function(result) {
            var token = result.credential.accessToken;
            var user = result.user;
            if (result.user.uid) {
                result.additionalUserInfo.uid = result.user.uid;
                firebase.database().ref().child('users/' + result.user.uid).update(result.additionalUserInfo).then(function(res) {
                    console.log('userUpdated');
                }).catch(function(err) {
                    console.log(err);
                })
            }
            // ...
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            showMsg('error', errorMessage, 5000);
            // ...
        });
    } else {
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
        }).catch(function(error) {
            // An error happened.
        });
    }

}

if (signUpEl) {
    signUpEl.forEach(function(element) {
        element.addEventListener('click', signInHandler)
    }, this);

}

firebase.auth().onAuthStateChanged(function(user) {
    if (user != null) {
        logedIn = true;
        changeAuthText(logedIn);
        var name, email, photoUrl, emailVerified;
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        // User is signed in.
    } else {
        logedIn = false;
        changeAuthText(logedIn);

        // No user is signed in.
    }
});

function showMsg(type, msg, timeout) {
    var msgEl = document.querySelectorAll('.js-alert');
    if (msgEl) {
        const msgType = ['alert-warning', 'alert-success', 'alert-warning', 'alert-info', 'hide'];
        var msgTypeSelected;
        switch (type) {
            case 'error':
                msgTypeSelected = msgType[0];
                break;
            case 'success':
                msgTypeSelected = msgType[1];
                break;
            case 'warning':
                msgTypeSelected = msgType[2];
                break;
            case 'info':
                msgTypeSelected = msgType[3];
                break;
            case 'hide':
                msgTypeSelected = 'hide';
                break;
            default:
                msgTypeSelected = 'hide';
        }
        msgEl.forEach(function(element) {
            removePreviousClass(element, msgType);
            element.classList.add(msgTypeSelected);
            element.innerHTML = msg;
            element.classList.add('nvShow');

        }, this);
    }
    if (timeout) {
        setTimeout(function(element) {
            var msgEl = document.querySelectorAll('.js-alert');
            if (msgEl) {
                msgEl.forEach(function(element) {
                    element.classList.remove('nvShow');
                })
            }
        }, timeout);
    }

}

function showMainView() {
    mainView.classList.remove('hidden');
}

function hideMainView() {
    mainView.classList.add('hidden');
}

function removePreviousClass(element, classArray) {
    classArray.forEach(function(cl) {
        element.classList.remove(cl);
    }, this);
}

function updateTotalCount(totalCountObj, initial) {
    // console.log(totalCountObj);
    if (totalCountObj && typeof totalCountObj === 'object' && Object.keys(totalCountObj).length > 0) {
        var liveUpdateEl = document.querySelector('.js-liveUpdate');
        if (liveUpdateEl) {
            Object.keys(totalCountObj).forEach(function(item) {
                if (typeof totalCountObj[item] === 'object') {
                    var el = liveUpdateEl.querySelector('.nv-badge.' + item + ' span.badge.' + item);
                    if (el) {
                        el.innerText = totalCountObj[item].value;
                    }
                    if (initial) {
                        addItemInPlate(item, totalCountObj[item].value);
                    }
                } else {
                    var el = liveUpdateEl.querySelector('.nv-badge.' + item + ' span.badge.' + item);
                    if (el) {
                        el.innerText = totalCountObj[item];
                    }
                    if (initial) {
                        addItemInPlate(item, totalCountObj[item]);
                    }
                }
            });
        }
    }
}

function addItemInPlate(item, total) {
    var palteEl = document.querySelector('.js-plate');
    var itemsToAdd = [];

    if (palteEl) {
        for (var i = 0; i < total; i++) {
            itemsToAdd.push({
                [item]: true
            });
        }
        itemsToAdd.forEach(function(itemObj) {
            if (itemObj[item]) {
                var liEl = document.createElement('li');
                liEl.setAttribute('data-draggable', 'item');
                liEl.classList.add('nv-item');
                liEl.classList.add(item);
                liEl.setAttribute('draggable', true);
                liEl.setAttribute('aria-grabbed', false);
                liEl.setAttribute('tabindex', 0);

                var imageEl = document.createElement('img');
                imageEl.setAttribute('src', '/static/image/' + item + '.png');
                imageEl.setAttribute('alt', item);
                liEl.appendChild(imageEl);
                palteEl.appendChild(liEl);
            }
        });
    }
}