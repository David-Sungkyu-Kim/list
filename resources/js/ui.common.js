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
  init: function () { //initialize
    this.registerListEvent(); // block list click event handler
  },
  registerListEvent: function () {
    var welList = document.querySelector('.area_block_list');

    if (welList) {
      welList.addEventListener('click', function (event) {
        event.preventDefault();

        if (event.target.tagName !== 'DIV') {
          document.querySelectorAll(".area_block_list ul li").forEach(function (value, index) {
            if (value.classList.contains('active')) {
              value.classList.remove('active');
            }
          });

          if (event.target.tagName === 'I') {
            event.target.parentElement.parentElement.classList.add('active');

          } else if (event.target.tagName === 'LI') {
            event.target.classList.add('active');

          } else if (event.target.tagName === 'TH' || event.target.tagName === 'TD') {
            event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.classList.add('active');
          }
        }

      });
    }
  }
};

