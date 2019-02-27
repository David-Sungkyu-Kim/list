class List {
  constructor() {
    // 초기 세팅
    this.setVars();
    this.registerEvents();
    this.init();
  }

  // 변수 설정
  setVars() {
    this.originData = null;
    this.channelIndex = null;
    this.channelContainer = document.getElementById("channelList");
    this.blockContainer = document.getElementById("blockList");
    this.txContainer = document.querySelector("#transactionList ul");

  }

  // 이벤트 핸들러 등록
  registerEvents() {
    this.channelContainer.addEventListener('click', ({target}) => {
      const targetTagName = target.tagName;
      if (targetTagName !== 'LI' && targetTagName !== 'A') return;

    });
  }

  // fetch
  getData() {
    const url = "../resources/json/block.json";
    // const url = '${pageContext.request.contextPath}/json/block_graph.gbj';

    fetch(url).then(function (response) {
      // console.log('loading start...');
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject({
          status: response.status,
          statusText: response.statusText
        });
      }
    }).then(function (responseData) {
      // console.log(responseData);
      // console.log('loading end...');
      document.querySelector('._loader').style.display = 'none';
      this.originData = responseData;
      this.channelList(this.originData, 0);
      this.blockInfo(this.originData[0].blks, 0);
    }.bind(this)).catch(function (error) {  //todo bind this edwith 설명 찾아보기
      console.error(error);
    });
  }

  init() {
    this.getData();
  }

  channelList(data, index) { //todo 배열이 아닌 집합을 배열로 만들어주는 es6
    this.channelIndex = index;
    data.forEach((v) => {
      this.channelContainer.innerHTML += `<li><a href="#">${v.chname}</a></li>`;
    });

    this.blockList(data, index);
    let el = document.querySelectorAll('#channelList li');
    this.setActive(el, this.channelIndex);
  }

  blockList(data, index) {
    this.blockContainer.innerHTML = '';
    data[index].blks.forEach((v) => {
      this.blockContainer.innerHTML +=
        `<li>
          <a href="#"><i class="far fa-folder"></i><i class="far fa-folder-open"></i>
          <div>
            <table>
              <tbody>
              <tr>
                <th>block ID :</th> 
                <td>${v['blockId']}</td>
              </tr>
              <tr>
                <th>Tx amount :</th>
                <td>${v['tx_count']}</td>
              </tr>
              </tbody>
            </table>
          <div>
          </a>
        </li>`;
    });

    let el = document.querySelectorAll('#blockList li');
    this.setActive(el, this.channelIndex);

  }

  blockInfo(data, blockIndex) {
    this.txContainer.innerHTML = '';
    data[blockIndex].detail.forEach((v) => {
      this.txContainer.innerHTML += `
        <li>
          <table class="table table-bordered table-striped">
            <colgroup>
              <col style="width: 30%;">
            </colgroup>
            <tbody>
            <tr>
              <th>Function</th>
              <td>${v.args[0]}</td>
            </tr>
            <tr>
              <th>Argument</th>
              <td>${v.args.slice(1,)}</td>
            </tr>
            <tr>
              <th>Datetime</th>
              <td>${v.datetime}</td>
            </tr>
            <tr>
              <th>TxID</th>
              <td>${v.tx_id}</td>
            </tr>
            </tbody>
          </table>
        </li>`;
    });

  }

  setActive(elements, channelIndex) {
    const el = Array.from(elements);
    // elements[0].setAttribute('class', 'active');

    //todo loop 추상화
    const elementClick = (index) => {
      elements[0].setAttribute('class', 'active');
      el[index].onclick = () => {
        if (el[index].getAttribute('class') !== 'active') {
          for(let i = 0; i < el.length; i++){
            el[i].removeAttribute('class');
          }
          el[index].setAttribute('class', 'active');
        } else {
          return;
        }

        const className = el[index].parentNode.className;
        switch(className) {
          case 'box_channel_list':
            this.channelIndex = index;
            this.blockList(this.originData, index);
            this.blockInfo(this.originData[index].blks, 0);
            break;
          case 'box_block_list':
            this.blockInfo(this.originData[this.channelIndex].blks, index);
            break;
          default:
            break;

        }
      }
    };

    for(let i = 0; i < el.length; i++){
      elementClick(i);
    }

  }

}

export default List;