/* eslint-disable no-undef */

window.onload = function() {
  const messages = document.querySelectorAll('.message__close');

  if (messages.length > 0) {
    for (let i = 0; i < messages.length; i++) {
      messages[i].onclick = function() {
        this.parentNode.parentNode.removeChild(this.parentNode);
      };
    }
  }
};
