var gb = gb || {};
gb.view = gb.view || {};

gb.view.global = function () {
  this.init();
};

/**
 * global ui prototype
 */
gb.view.global.prototype = {
  leftNavigation: null,
  innerText: null,
  innerWrap: null,
  nPrevIndex: 0,
  init: function () { //initialize
    this.registerBlockListEvent(); // block list click event handler
    this.registerChannelListEvent();
    this.fnLeftNavigation(); // left menu
    this.fnInnerTableLeftTitle(); // inner table title

  },
  registerBlockListEvent: function () {
    var self = this;
    var welList = document.querySelector('.area_block_list ul');

    if (welList) {
      welList.addEventListener('click', function (event) {
        event.preventDefault();
        if (event.target.tagName !== 'DIV') {
          document.querySelectorAll(".area_block_list ul li").forEach(function (value, index) {
            if (value.classList.contains('active')) {
              value.classList.remove('active');
              setTimeout(function () {
                self.nPrevIndex = self.indexInClass(document.querySelectorAll('.box_block_list li'));
              }, 50)
            }
          });

          if (
            event.target.nodeName !== 'UL' ||
            event.target.nodeName !== 'TBODY'
          ) {

            if (event.target.tagName === 'I') {
              event.target.parentElement.parentElement.classList.add('active');

            } else if (event.target.tagName === 'LI') {
              event.target.classList.add('active');
            } else if (event.target.tagName === 'TH' || event.target.tagName === 'TD') {
              event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.classList.add('active');
            }
          }

        }

      }.bind(this));
    }
  },
  registerChannelListEvent: function () {
    var welChList = document.querySelector('.area_channel_list');

    if (welChList) {
      welChList.addEventListener('click', function (event) {
        event.preventDefault();

        if (event.target.tagName !== 'DIV') {
          document.querySelectorAll(".area_channel_list ul li").forEach(function (value, index) {
            if (value.classList.contains('active')) {
              value.classList.remove('active');
            }
          });

          if (event.target.tagName === 'I') {
            event.target.parentElement.parentElement.classList.add('active');

          } else if (event.target.tagName === 'LI') {
            event.target.classList.add('active');

          } else if (event.target.tagName === 'A') {
            event.target.parentElement.classList.add('active');
          }
        }

      });
    }
  },
  indexInClass: function(element) {
    let nActiveIndex = 0;
    for (let array of element) {
      const className = array.className;
      if (className === 'active') {
        break;
      } else {
        nActiveIndex++;
      }
    }
    return nActiveIndex;
  },
  fnBlockListScroll: function () {
    var blockList = document.querySelector('.scroll .area_block_list li');
    var blockListAll = document.querySelectorAll('.scroll .area_block_list li');
    if (blockList) {
      var nWidth = blockList.offsetWidth;
      var nLength = blockListAll.length;

      return document.querySelector('.area_block_list').style.width = nWidth * nLength + 20 + 'px';
    }
  },
  fnTransactionListScroll() {
    var transactionList = document.querySelector('.scroll .area_transaction_list li');
    var transactionListAll = document.querySelectorAll('.scroll .area_transaction_list li');
    if (transactionList) {
      var nWidth1 = transactionList.offsetWidth;
      var nLength1 = transactionListAll.length;

      return document.querySelector('.area_transaction_list').style.width = nWidth1 * nLength1 + 100 + 'px';
    }
  },
  fnInnerTableLeftTitle: function () {
    this.innerText = document.querySelectorAll('.card_inner_list > div > div span');
    this.innerWrap = document.querySelectorAll('.card_inner_list > div');

    if (this.innerText || this.innerWrap) {
      for (var i = 0; i < this.innerText.length; i++) {
        var rectInfo = this.innerText[i].getBoundingClientRect();
        this.innerWrap[i].style.marginRight = (rectInfo.height) * -1;
      }
    }
  },
  fnLeftNavigation: function () {
    this.leftNavigation = document.querySelector('.wrap_contents ._leftNavi ul');
    // console.log(this.leftNavigation.firstElementChild);
    if (this.leftNavigation) {
      this.leftNavigation.addEventListener('click', function (evt) {
        if (
          evt.target.parentNode.classList.contains('_depth') &&
          evt.target.parentNode.classList.contains('active')
        ) {
          // config file
          evt.target.parentNode.classList.remove('active');

          for (var i = 0; i < evt.target.nextElementSibling.getElementsByTagName('LI').length; i++) {
            evt.target.nextElementSibling.getElementsByTagName('LI')[i].classList.remove('active');
          }
          // evt.target.nextElementSibling.getElementsByTagName('LI')[0].classList.add('active');

        } else if (evt.target.parentNode.classList.contains('_depth')) { //a click
          document.querySelectorAll('._leftNavi > ul > li').forEach(function (value, index) {
            value.classList.remove('active');
          });

          document.querySelectorAll('.box_depth01 > ul > li').forEach(function (value, index) {
            value.classList.remove('active');
          });

          if (!evt.target.parentNode.classList.contains('active')) {
            evt.target.parentNode.classList.add('active');
          }

          // evt.target.nextElementSibling.getElementsByTagName('LI')[0].classList.add('active');

        } else {
          document.querySelectorAll('._leftNavi > ul > li').forEach(function (value, index) {
            if (value.classList.contains('active')) {
              if (evt.target.parentNode.parentNode.parentNode.parentNode.classList.contains('_depth')) {
                // console.log('inner');
                var children = value.getElementsByClassName('box_depth01');

                for (var i = 0; i < children[0].getElementsByTagName('LI').length; i++) {
                  if (children[0].getElementsByTagName('LI')[i].classList.contains('active')) {
                    children[0].getElementsByTagName('LI')[i].classList.remove('active')
                  }
                }

                if (!evt.target.parentNode.classList.contains('active')) {
                  evt.target.parentNode.classList.add('active');
                }
              } else {
                value.classList.remove('active');
              }
            }

            if (!evt.target.parentNode.classList.contains('active')) {
              if (evt.target.parentNode.nodeName === "A") {
                evt.target.parentNode.parentNode.classList.add('active');
              } else {
                evt.target.parentNode.classList.add('active');
              }
            }
          });
        }
      });
    }
  },
  fnCircular: function (array) {
    var circle = document.querySelectorAll('.circular-chart .circle');
    var elText = document.querySelectorAll('.circular-chart text');

    if (circle) {
      for (var i = 0; i < circle.length; i++) {
        function setCircular(array) {
          var str = array[i].substring(0, array[i].length - 1);
          var n1 = str *= 1;
          var nSecond = n1 / 60;
          var sSecond = parseInt(nSecond * 100).toString();

          circle[i].setAttribute('stroke-dasharray', sSecond + ',100');
          elText[i].textContent = array[i];
        }
        setCircular(array);
      }
      return setCircular;
    }
  }
};

