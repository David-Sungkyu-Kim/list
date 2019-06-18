class List {
  constructor() {
    this.setVars();
    this.registerEvents();
    this.init();
  }

  setVars() {
    this.originData = null;
    this.channelIndex = null;
    this.bFirst = null;
    this.nSliceIndex = 0;
    this.channelContainer = document.getElementById("channelList");
    this.blockContainer = document.getElementById("blockList");
    this.txContainer = document.querySelector("#transactionList ul");
    this.elLoader = document.querySelector('._loader');
    this.btnMoreLocation = document.querySelector(".area_block_list .scroll");
    this.btnMore = document.createElement('p');
    this.btnMore.style.display = 'none';
    this.btnMoreText = document.createTextNode('more');
    this.btnMore.appendChild(this.btnMoreText);
    this.btnMore.classList.add('btn', 'btn-outline-orange', 'btn-sm', 'btn_more');
    this.btnMoreLocation.appendChild(this.btnMore);
  }

  registerEvents() {
    this.channelContainer.addEventListener('click', ({target}) => {
      const targetTagName = target.tagName;
      if (targetTagName !== 'LI' && targetTagName !== 'A') return;
    });

    this.btnMore.addEventListener('click', () => {
      this.nSliceIndex += 11;
      this.addList();
    });
  }

  // fetch
  async getData() {
    const url = "../../resources/json/data.json";
    // const url = '${pageContext.request.contextPath}/json/block_graph.gbj';

    const response = await fetch(url);

    try {
      if (response.ok) {
        const responseData = await response.json();

        this.elLoader.style.display = 'none';
        this.originData = responseData;
        this.bFirst = true;
        this.makeChannelList(this.originData, 0);
        this.showIdInfo(this.originData[0].blks, 0);
      } else {
        return console.error({
          status: response.status,
          statusText: response.statusText
        });
      }
    } catch(err) {
      console.log(err);
    }

  }

  init() {
    this.getData();
  }

  makeChannelList(data, index) {
    const makeChannelTemplete = data => this.templeteHtml`
      ${data.map(v => this.templeteHtml`<li><a href="#">${v.chname}</a></li>`)}
    `;

    const promise = new Promise(resolve =>{
      for (let i = 0; i < data.length; i++) {
        if (data[i].chname === '' && data[i].chname !== undefined) {
          resolve(false);
        } else {
          resolve(true);
        }
      }
    });

    promise.then(result => {
      this.channelContainer.innerHTML = '';

      if (result === false) {
        this.channelContainer.insertAdjacentHTML('beforeend', List.emptyList());
        this.channelIndex = 0;
      } else {
        this.channelContainer.insertAdjacentHTML('beforeend', makeChannelTemplete(data));
        this.channelIndex = index;
        const el = document.querySelectorAll('#channelList li');
        this.setActive(el);
      }
      this.makeIdList(data, this.channelIndex);
    });

  }

  makeIdList(data, index, boolean) {
    const makeIdListTemplete = insertData => this.templeteHtml`
        ${insertData.map(v => this.templeteHtml`
          <li>
          <a href="#"><i class="far fa-folder"></i><i class="far fa-folder-open"></i>
            <div>
              <table>
                <tbody>
                <tr>
                  <th>ID :</th>
                  <td>$${v.Id}</td>
                </tr>
                <tr>
                  <th>count :</th>
                  <td>$${v.tx_count}</td>
                </tr>
                </tbody>
              </table>
            <div>
            </a>
          </li>`)}`;

    let insertData = data[index].blks.slice(this.nSliceIndex, this.nSliceIndex + 11);

    if (data[index].blks.length > 0 && insertData.length <= 12 + index) {
      if (boolean !== true || !boolean) this.blockContainer.innerHTML = '';

      if (insertData.length >= 11) {
        this.showBtnMore();
      } else {
        this.hideBtnMore();
        this.nSliceIndex = 0;
      }
      this.blockContainer.insertAdjacentHTML('beforeend', makeIdListTemplete(insertData));
      const el = document.querySelectorAll('#blockList li');
      this.setActive(el);
    } else {
      //empty data
      this.blockContainer.insertAdjacentHTML('beforeend', List.emptyList());
    }
  }

  showIdInfo(data, blockIndex) {
    const makeInfoTemplete = insertData => this.templeteHtml`
        ${insertData[blockIndex].detail.map(v => this.templeteHtml`
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
              <th>Transfer</th>
              <td>${v.transfer}</td>
            </tr>
            </tbody>
          </table>
          </li>`)}`;

    this.txContainer.innerHTML = '';
    if (data.length > 0) {
      this.txContainer.insertAdjacentHTML('beforeend', makeInfoTemplete(data));
    } else {
      // empty data
      this.txContainer.insertAdjacentHTML('beforeend', List.emptyList());
    }
  }

  setActive(elements) {
    const el = Array.from(elements);

    if (this.bFirst === true && el[0].parentNode.className === 'box_channel_list') {
      el[0].setAttribute('class', 'active');
    } else {
      if (this.bFirst === true) {
        el[0].setAttribute('class', 'active');
      }
      this.bFirst = false;
    }

    const elementClick = (index) => {
      el[index].addEventListener('click', () => {
        for (let i = 0; i < el.length; i++) {
          el[i].removeAttribute('class');
        }

        if (el[index].getAttribute('class') !== 'active') {
          el[index].setAttribute('class', 'active');
        } else return;

        const className = el[index].parentNode.className;
        switch (className) {
          case 'box_channel_list':
            this.bFirst = true;
            this.channelIndex = index;
            this.nSliceIndex = 0;
            this.makeIdList(this.originData, index);
            this.showIdInfo(this.originData[index].blks, 0);
            break;
          case 'box_block_list':
            this.showIdInfo(this.originData[this.channelIndex].blks, index);
            break;
          default:
            break;
        }
      });
    };

    for (let i = 0; i < el.length; i++) {
      elementClick(i);
    }
  }

  addList() {
    const bAdd = true;
    this.makeIdList(this.originData, this.channelIndex, bAdd);
  }

  templeteHtml(templateObject, ...substs) {
    const raw = templateObject.raw;
    let result = '';
    substs.forEach((subst, i) => {
      let lit = raw[i];
      if (Array.isArray(subst)) {
        subst = subst.join('');
      }

      if (lit.endsWith('$')) {
        if (typeof subst === 'string') subst = this.htmlEscape(subst);
        lit = lit.slice(0, -1);
      }
      result += lit;
      result += subst;
    });
    result += raw[raw.length - 1];
    return result;
  }

  htmlEscape(str) {
    return str.replace(/&/g, '&amp;')
      .replace(/>/g, '&gt;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/`/g, '&#96;');
  }

  static emptyList(){
    return `<li class="txt_no_data">
              <p>No data available</p>
              <span class="fas fa-database"></span>
            </li>`;
  }

  showBtnMore() {
    this.btnMore.style.display = 'block';
  }

  hideBtnMore() {
    this.btnMore.style.display = 'none';
  }

}

module.exports = List;

const myList = new List();