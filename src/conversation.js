const store = new Map();

function getHistory(phoneNumber) {
  if (!store.has(phoneNumber)) {
    store.set(phoneNumber, []);
  }
  return store.get(phoneNumber);
}

function appendMessage(phoneNumber, role, content) {
  getHistory(phoneNumber).push({ role, content });
}

function resetHistory(phoneNumber) {
  store.set(phoneNumber, []);
}

module.exports = { getHistory, appendMessage, resetHistory };
