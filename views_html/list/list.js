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
  getData() {
    const url = "../../resources/json/block.json";
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
      this.elLoader.style.display = 'none';
      this.originData = responseData;
      this.bFirst = true;
      this.channelList(this.originData, 0);
      this.blockInfo(this.originData[0].blks, 0);

    }.bind(this)).catch(function (error) {
      console.error(error);
    });
  }

  init() {
    this.getData();
  }

  channelList(data, index) {
    const tmpl = data => this.tmplHtml`
      ${data.map(v => this.tmplHtml`<li><a href="#">${v.chname}</a></li>`)}
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
        this.channelContainer.insertAdjacentHTML('beforeend', this.emptyList());
        this.channelIndex = 0;
      } else {
        this.channelContainer.insertAdjacentHTML('beforeend', tmpl(data));
        this.channelIndex = index;
        const el = document.querySelectorAll('#channelList li');
        this.setActive(el);
      }
      this.blockList(data, this.channelIndex);
    });

  }

  blockList(data, index, boolean) {
    const tmpl = insertData => this.tmplHtml`
        ${insertData.map(v => this.tmplHtml`
          <li>
          <a href="#"><i class="far fa-folder"></i><i class="far fa-folder-open"></i>
            <div>
              <table>
                <tbody>
                <tr>
                  <th>block ID :</th>
                  <td>$${v.blockId}</td>
                </tr>
                <tr>
                  <th>Tx amount :</th>
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
      this.blockContainer.insertAdjacentHTML('beforeend', tmpl(insertData));
      const el = document.querySelectorAll('#blockList li');
      this.setActive(el);
    } else {
      //empty data
      this.blockContainer.insertAdjacentHTML('beforeend', this.emptyList());
    }
  }

  blockInfo(data, blockIndex) {
    const tmpl = insertData => this.tmplHtml`
        ${insertData[blockIndex].detail.map(v => this.tmplHtml`
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
          </li>`)}`;

    this.txContainer.innerHTML = '';
    if (data.length > 0) {
      this.txContainer.insertAdjacentHTML('beforeend', tmpl(data));
    } else {
      // empty data
      this.txContainer.insertAdjacentHTML('beforeend', this.emptyList());
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
            this.blockList(this.originData, index);
            this.blockInfo(this.originData[index].blks, 0);
            break;
          case 'box_block_list':
            this.blockInfo(this.originData[this.channelIndex].blks, index);
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
    this.blockList(this.originData, this.channelIndex, bAdd);
  }

  tmplHtml(templateObject, ...substs) {
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

  emptyList(){
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