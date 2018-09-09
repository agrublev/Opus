const { quill } = require('./quill');
const find = require('./find');

const editor = document.querySelector('.ql-editor');

const el = document.querySelector('.goto');
const input = document.querySelector('.goto-input');
const form = document.querySelector('.goto-form');

let active = false;

module.exports = {
  activate() {
    if (active) {
      input.focus();
    }

    find.deactivate();
    el.classList.add('show');
    input.value = '';
    input.focus();
    active = true;

    window.addEventListener('keydown', module.exports.keydown);
    form.addEventListener('submit', module.exports.submit);
  },
  keydown(e) {
    if (e.keyCode === 27) {
      module.exports.deactivate();
    }
  },
  deactivate() {
    form.removeEventListener('submit', module.exports.submit, false);
    window.removeEventListener('keydown', module.exports.keydown, false);

    el.classList.remove('show');
    input.value = '';
    active = false;
  },
  submit(e) {
    e.preventDefault();
    module.exports.goto();
  },
  toggle() {
    el.classList.toggle('show');
  },
  goto() {
    const line = parseInt(input.value, 10) - 1;

    if (line >= editor.children.length || line < 0) {
      input.classList.add('error');
      setTimeout(() => {
        input.classList.remove('error');
      }, 1000);
      return;
    }

    const text = quill.getText();
    const lines = text.split('\n');

    // This is pretty hacky, have to count all the characters
    // up to the current line to find the correct start position
    let i = 0;
    let total = 0;
    for (i = 0; i < line; i += 1) {
      total += lines[i].length + 1;
    }

    // Set the editor selection
    quill.setSelection(total, lines[line].length);

    // Deactivate the goto element
    module.exports.deactivate();
  },
};