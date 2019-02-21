class List {
  constructor(){
    // 초기 세팅
    this.setVars();
    this.registerEvents();
    this.getData();
  }

  // 변수 설정
  setVars(){
    const originData = null;
  }

  // 이벤트 핸들러 등록
  registerEvents(){}

  // fetch
  getData(){
    const url = "../resources/json/block.json";
    // const url = '${pageContext.request.contextPath}/json/block_graph.gbj';
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.addEventListener('load', function() {
      if (request.status >= 200 && request.status < 400) {
        this.originData = JSON.parse(request.responseText);

      } else {
        console.log(request.status);
      }
    });

    request.addEventListener('error', function() {
      console.log('error!!');
    });

    request.send();
  }

  channelList(data){}

  blockList(data){}

  blockInfo(data, blockIndex){}

  setActive(index){}

}

export default List;