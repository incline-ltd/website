import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const script = readFileSync(new URL('../_landing/js/contact-form.js', import.meta.url), 'utf8');

function fixture({ valid = true, missingForm = false, missingStatus = false } = {}) {
  const events = {};
  let enabledAfterHandlers = false;
  let disabled = true;
  const fields = {
    get disabled() { return disabled; },
    set disabled(value) {
      enabledAfterHandlers = Boolean(events.submit && events.reset);
      disabled = value;
    },
  };
  const status = {
    textContent: '',
    classList: { toggle() {} },
  };
  const form = {
    querySelector(selector) {
      if (selector === '[data-form-status]') return missingStatus ? null : status;
      if (selector === '[data-form-fields]') return fields;
      throw new Error('Unexpected form access');
    },
    addEventListener(type, handler) { events[type] = handler; },
    reportValidity() { return valid; },
    get elements() { throw new Error('The demo must not collect field values'); },
    submit() { throw new Error('Native submission must not be called'); },
  };
  const forbidden = () => { throw new Error('Network and storage are forbidden'); };
  vm.runInNewContext(script, {
    document: { querySelector() { return missingForm ? null : form; } },
    fetch: forbidden,
    XMLHttpRequest: forbidden,
    WebSocket: forbidden,
    FormData: forbidden,
    navigator: { sendBeacon: forbidden },
    get localStorage() { return forbidden(); },
    get sessionStorage() { return forbidden(); },
  });
  return { events, fields, status, enabledAfterHandlers };
}

test('the HTML disables the form before JavaScript runs', () => {
  const html = readFileSync(new URL('../contact/index.html', import.meta.url), 'utf8');
  assert.match(html, /<fieldset[^>]*data-form-fields[^>]*disabled/);
  assert.doesNotMatch(html, /data-endpoint|action=|formaction=/i);
});

test('fields are enabled only after both local handlers exist', () => {
  const result = fixture();
  assert.equal(result.fields.disabled, false);
  assert.equal(result.enabledAfterHandlers, true);
});

test('valid input is blocked from submission without collection, network or storage', () => {
  const { events, status } = fixture();
  let prevented = false;
  events.submit({ preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(status.textContent, 'Demo complete. Nothing was sent or saved.');
});

test('invalid input is blocked without a success claim', () => {
  const { events, status } = fixture({ valid: false });
  let prevented = false;
  events.submit({ preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.doesNotMatch(status.textContent, /Demo complete/);
});

test('reset clears the success feedback', () => {
  const { events, status } = fixture();
  events.submit({ preventDefault() {} });
  events.reset();
  assert.equal(status.textContent, 'Demo only. Use sample details to try the form.');
});

test('incomplete markup stays disabled and other pages are ignored', () => {
  assert.equal(fixture({ missingStatus: true }).fields.disabled, true);
  assert.deepEqual(fixture({ missingForm: true }).events, {});
});
