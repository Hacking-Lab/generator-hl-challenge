function fixTerminalHeight() {
  const windowHeight = $(window).height();
  const terminalBegin = $('.terminal').offset().top;
  const bottomSpace = 42;
  const terminalHeight = windowHeight - terminalBegin - bottomSpace;
  $('.terminal').height(`${terminalHeight}px`);
}

function setupWebSocket(task = '') {
  const url = `${$('.terminal').data('wsuri')}/${task}`;
  const verbose = $('.terminal').data('verbose');
  const ws = new WebSocket(url);
  ws.onmessage = (event) => {
    log(event.data);
  };
  if(verbose) {
    ws.onopen = () => {
      log('\nCONNECT');
    };
    ws.onclose = () => {
      log('DISCONNECT');
    };
  }
}

function clear() {
  $('#shell').text('');
}

function log(message) {
  $('#shell').append(`${message}\n`);
  scrollTerminalToBottom();
}

function scrollTerminalToBottom() {
  $('.terminal').scrollTop($('.terminal').prop('scrollHeight'));
}

$(window).on('resize', () => {
  fixTerminalHeight();
});

$(document).ready(() => {
  fixTerminalHeight();
  setupWebSocket();
});

$('#btn-run-task').click(() => {
  clear();
  setupWebSocket('task');
});
