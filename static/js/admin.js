var items;
var itemsToAdd;
var orderType;
var orderDate;
firebase.database().ref('/adminAccess').once('value', function(snapShot) {
    var dataBaseValue = snapShot.val();
    itemsToAdd = dataBaseValue.itemsToOrder;
    orderType = dataBaseValue.orderType;
    orderDate = dataBaseValue.orderDate;
    if (dataBaseValue) {
        var formEl = document.querySelector('#js-admin-form');
        var statusEl = document.querySelector('#status');
        var saveBtnContainer = document.querySelector('#js-save-container');

        if (formEl && statusEl, saveBtnContainer) {
            if (dataBaseValue.orderSession) {
                statusEl.setAttribute('checked', true);
            } else {
                statusEl.removeAttribute('checked');
            }
            if (dataBaseValue.orderType) {
                var selectEl = document.querySelector('#orderType');
                if (selectEl) {
                    selectEl.setAttribute('value', dataBaseValue.orderType);
                    var optionEl = selectEl.querySelector('option[value="' + dataBaseValue.orderType + '"]');
                    if (optionEl) {
                        optionEl.setAttribute('selected', true);
                    }
                }
            }
            items = dataBaseValue.itemsToOrder;
            Object.keys(items).forEach(function(item) {
                var divEl = document.createElement('div');
                divEl.classList.add('form-group');

                var labelEl = document.createElement('label');
                labelEl.classList.add('custom-control');
                labelEl.classList.add('custom-checkbox');

                var inputEl = document.createElement('input');
                inputEl.classList.add('custom-control-input');
                inputEl.classList.add(item);
                inputEl.setAttribute('type', 'checkbox');
                if (items[item]) {
                    inputEl.setAttribute('checked', true);
                }

                var spanEl1 = document.createElement('span');
                spanEl1.classList.add('custom-control-indicator');

                var spanEl1 = document.createElement('span');
                spanEl1.classList.add('custom-control-indicator');

                var spanEl2 = document.createElement('span');
                spanEl2.classList.add('custom-control-description"');
                spanEl2.innerText = item;

                labelEl.appendChild(inputEl);
                labelEl.appendChild(spanEl1);
                labelEl.appendChild(spanEl2);

                divEl.appendChild(labelEl);

                formEl.appendChild(divEl);
            });
            formEl.classList.remove('hidden');
            saveBtnContainer.classList.remove('hidden');
        }
        var liveUpdateEl = document.querySelector('.js-liveUpdate');
        if (liveUpdateEl) {
            Object.keys(itemsToAdd).forEach(function(item) {
                if (itemsToAdd[item]) {
                    var divEl = document.createElement('div');
                    divEl.classList.add('nv-badge');
                    divEl.classList.add(item);

                    var imageEl = document.createElement('img');
                    imageEl.setAttribute('src', '/static/image/' + item + '.png');
                    imageEl.setAttribute('alt', item);
                    divEl.appendChild(imageEl);
                    var spanEl = document.createElement('span');
                    spanEl.classList.add('badge');
                    spanEl.classList.add('badge-default');
                    spanEl.classList.add(item);
                    spanEl.innerText = 0;
                    divEl.appendChild(spanEl);
                    liveUpdateEl.appendChild(divEl);
                }
            });
        }
        firebase.database().ref().child('/totalOrder/' + orderType).once('value', function(snapShot) {
            var totalCount = snapShot.val();
            updateTotalCount(totalCount);
        })

    }
});

var saveBtn = document.querySelector('#js-save');
if (saveBtn) {
    saveBtn.addEventListener('click', function(evt) {
        evt.preventDefault();
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        var newdate = year + "-" + month + "-" + day;

        var obj = {
            orderSession: document.querySelector('#status:checked') ? true : false,
            orderType: document.querySelector('#orderType') ? document.querySelector('#orderType').value : '',
            orderDate: newdate,
            itemsToOrder: {}
        }
        Object.keys(items).forEach(function(item) {
            obj.itemsToOrder[item] = document.querySelector('.' + item + ':checked') ? true : false;
        });
        firebase.database().ref().child('/adminAccess').update(obj).then(function(res) {
            showMsg('success', 'data has been updated', 5000);
        }).catch(function(err) {
            showMsg('error', err.message, 5000);
        })
    })
}

firebase.database().ref('/totalOrder').on('child_changed', function(childSnapshot, prevChildKey) {
    var data = childSnapshot.val();
    console.log(data);
    updateTotalCount(data);
});