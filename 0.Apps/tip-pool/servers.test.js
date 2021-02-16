describe("Servers test (with setup and tear-down)", function() {
  beforeEach(function () {
    // initialization logic
    serverNameInput.value = 'Alice';
  });

  it('should add a new server to allServers on submitServerInfo()', function () {
    submitServerInfo();

    expect(Object.keys(allServers).length).toEqual(1);
    expect(allServers['server' + serverId].serverName).toEqual('Alice');
  });

  it('creates one new tr using updateServerTable() called from submitServerInfo()', function () {
    submitServerInfo();
    
    for (let server of serverTrs){
      serverTrsCount ++;
    }
    expect(serverTrsCount).toEqual(1);

  });

  it('creates a new tr in the correct place: table body with id = serverTBody; using updateServerTable() called from submitServerInfo()', function () {
    submitServerInfo();

    for(let server of serverTrs){
      expect(server.parentElement.id).toEqual('serverTBody');
    }
  });

  afterEach(function() {
    // teardown logic
    //target server entry in table and remove it after each test creates one to test on
    for (let server of serverTrs){
      server.remove();
    }
    allServers = {};
    serverId = 0;
  });
});
