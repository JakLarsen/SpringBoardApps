let serverNameInput = document.getElementById('serverName');
let serverForm = document.getElementById('serverForm');

let serverTbody = document.querySelector('#serverTable tbody');
let serverTrs = document.querySelectorAll('#serverTable tbody tr');
let serverTrsCount = 0;

let allServers = {};
let serverId = 0;

serverForm.addEventListener('submit', submitServerInfo);

// create server object and add to allServers, update html and reset input
function submitServerInfo(evt) {
  if (evt) evt.preventDefault(); // when running tests there is no event

  let serverName = serverNameInput.value;

  if (serverName !== '') {
    serverId++;
    allServers['server' + serverId] = { serverName };

    updateServerTable();

    serverNameInput.value = '';
  }
}

// Create table row element and pass to appendTd function with input value
function updateServerTable() {
  serverTbody.innerHTML = '';

  for (let key in allServers) {
    let curServer = allServers[key];

    let newTr = document.createElement('tr');
    newTr.setAttribute('id', key);

    let tipAverage = sumPaymentTotal('tipAmt') / Object.keys(allServers).length;

    appendTd(newTr, curServer.serverName);
    appendTd(newTr, '$' + tipAverage.toFixed(2));
    appendDeleteBtn(newTr);

    serverTbody.append(newTr);

    serverTrs = document.querySelectorAll('#serverTable tbody tr');
  }
}


function removeServerFromAllServers(serverKey){
  delete allServers[serverKey];
}

//Remove tr from DOM and the server property from the allServers object
serverTbody.addEventListener('click', function(e){
  let childOfTargetToRemove = e.target
  let serverKey = e.target.parentElement.id;

  if(childOfTargetToRemove.innerText === 'X'){
    removeFromTable(childOfTargetToRemove);
    removeServerFromAllServers(serverKey);
  }
})