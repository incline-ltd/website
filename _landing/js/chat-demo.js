/*
 * Incline AI chat demo (How Incline builds).
 * A scripted, non-interactive autoplay modeled on the pridie/tradign landing
 * demos: a soft cursor clicks the composer, the request is typed, the AI
 * streams a reply, and a builder proposal card lands with staggered rows.
 * The cursor then sends the proposal for approval — the human gate the copy
 * keeps promising. Loops through three scenarios while on screen; pauses
 * off-screen; reduced-motion users get the finished scene, still.
 */
(() => {
  'use strict';

  const mount = document.querySelector('[data-chat-demo]');

  if (!mount || mount.dataset.demoInit) return;
  mount.dataset.demoInit = 'true';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const SCENARIOS = [
    {
      prompt: 'Build an agent that triages our support inbox and drafts replies for approval.',
      reply:
        'I would classify each email by intent and urgency, draft a reply grounded in your help docs, and queue everything for your yes before it sends.',
      proposal: {
        title: 'Support Triage Agent · drafts only',
        meta: 'Inbox · 24/7',
        rows: [
          ['Classify', 'Intent + urgency from the live inbox'],
          ['Draft', 'Replies grounded in your help docs'],
          ['Approval', 'Nothing sends without your yes'],
        ],
        action: 'Send for approval',
      },
      done: 'Approved — running on drafts',
      status: ['Drafting', 'Needs approval', 'Approved · drafts'],
    },
    {
      prompt: 'Build a BTC strategy that uses trend confirmation and waits for Telegram approval.',
      reply:
        'I would start with a 4H EMA ribbon trend engine, then add volatility and liquidity filters before any execution step.',
      proposal: {
        title: '4H EMA Ribbon Trend · BTC long',
        meta: '4H · BTC/USDT',
        rows: [
          ['Entry', 'Ribbon reclaim + volume expansion'],
          ['Risk', '0.7% per trade · trail after 1.2R'],
          ['Approval', 'Telegram card before live orders'],
        ],
        action: 'Send for approval',
      },
      done: 'Approved — paper run started',
      status: ['Drafting', 'Needs approval', 'Approved · paper'],
    },
    {
      prompt: 'Watch our ad spend across accounts and flag anomalies before they burn budget.',
      reply:
        'A monitor agent fits: pull spend hourly, baseline every campaign, and alert with context the moment something drifts — no account changes, ever.',
      proposal: {
        title: 'Spend Monitor · alerts only',
        meta: 'Hourly · all accounts',
        rows: [
          ['Watch', 'Hourly spend vs campaign baseline'],
          ['Flag', 'Anomalies with context, to Telegram'],
          ['Mode', 'Alerts only — no account changes'],
        ],
        action: 'Start monitoring',
      },
      done: 'Monitoring live — alerts on',
      status: ['Drafting', 'Ready to start', 'Monitoring'],
    },
  ];

  /* ---- shell ---- */
  mount.innerHTML =
    '<div class="chat-demo__cursor" data-cursor>' +
    '<svg class="chat-demo__cursor-arrow" viewBox="0 0 16 20" aria-hidden="true">' +
    '<path d="M1 1 L1 14.8 L4.9 11.9 L7.4 17.7 L10.1 16.5 L7.6 10.7 L13.2 10.3 Z"></path>' +
    '</svg>' +
    '<span class="chat-demo__cursor-ring"></span>' +
    '</div>' +
    '<div class="chat-demo__card">' +
    '<header class="chat-demo__head">' +
    '<div><p>Scripted demo</p><h3>Incline AI</h3></div>' +
    '<span class="chat-demo__status" data-status>Demo</span>' +
    '</header>' +
    '<div class="chat-demo__thread" data-thread></div>' +
    '<div class="chat-demo__composer" data-composer>' +
    '<span class="chat-demo__composer-text" data-input></span>' +
    '<span class="chat-demo__composer-hint" data-hint>Message Incline AI…</span>' +
    '<span class="chat-demo__send" data-send aria-hidden="true">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/>' +
    '<path d="m5 12 7-7 7 7"/></svg></span>' +
    '</div>' +
    '</div>';

  const cursor = mount.querySelector('[data-cursor]');
  const statusEl = mount.querySelector('[data-status]');
  const thread = mount.querySelector('[data-thread]');
  const composer = mount.querySelector('[data-composer]');
  const inputEl = mount.querySelector('[data-input]');
  const hintEl = mount.querySelector('[data-hint]');
  const sendBtn = mount.querySelector('[data-send]');
  let cursorPlaced = false;

  /* ---- helpers ---- */
  const esc = (value) =>
    String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const el = (html) => {
    const wrap = document.createElement('div');
    wrap.innerHTML = html.trim();
    return wrap.firstElementChild;
  };

  // The loop only advances while the section is on screen: every sleep waits
  // out its delay, then blocks until the demo is visible again.
  let visible = false;
  let waiters = [];
  const whenVisible = () =>
    visible ? Promise.resolve() : new Promise((resolve) => waiters.push(resolve));
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)).then(whenVisible);

  const scrollThread = () => {
    thread.scrollTop = thread.scrollHeight;
  };

  const reveal = (node) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        node.classList.add('is-in');
        scrollThread();
      });
    });
  };

  const setStatus = (text) => {
    statusEl.textContent = text;
  };

  // The build steps beside the demo light up with the act being played.
  const buildSteps = [...document.querySelectorAll('[data-build-step]')];
  const setStep = (key) => {
    buildSteps.forEach((step) => {
      step.classList.toggle('flow__step--active', step.dataset.buildStep === key);
    });
  };

  const moveCursorTo = (target, xRatio = 0.5, yRatio = 0.5) => {
    const frame = mount.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    const x = rect.left + rect.width * xRatio - frame.left;
    const y = rect.top + rect.height * yRatio - frame.top;
    const transform = `translate(${x}px,${y}px)`;

    if (!cursorPlaced) {
      cursor.style.transition = 'none';
      cursor.style.transform = transform;
      cursor.classList.add('is-visible');
      void cursor.offsetWidth;
      cursor.style.transition = '';
      cursorPlaced = true;
      return;
    }

    cursor.classList.add('is-visible');
    cursor.style.transform = transform;
  };

  const clickAt = async (target, xRatio, yRatio) => {
    moveCursorTo(target, xRatio, yRatio);
    await sleep(620);
    cursor.classList.remove('is-click');
    void cursor.offsetWidth;
    cursor.classList.add('is-click');
    await sleep(300);
  };

  const typeInto = async (text) => {
    hintEl.style.opacity = '0';
    inputEl.classList.add('is-typing');

    for (let i = 1; i <= text.length; i += 1) {
      inputEl.textContent = text.slice(0, i);
      await sleep(24);
    }

    inputEl.classList.remove('is-typing');
  };

  const streamText = async (node, text) => {
    for (let i = 1; i <= text.length; i += 1) {
      node.textContent = text.slice(0, i);
      if (i % 2 === 0) scrollThread();
      await sleep(18);
    }
  };

  const proposalHtml = (proposal, revealed) => {
    const rows = proposal.rows
      .map(
        (row) =>
          `<div class="chat-demo__row${revealed ? ' is-in' : ''}" data-row>` +
          `<span>${esc(row[0])}</span><strong>${esc(row[1])}</strong></div>`,
      )
      .join('');

    return (
      `<div class="chat-demo__proposal${revealed ? ' is-in' : ''}">` +
      '<div class="chat-demo__proposal-head">' +
      '<span class="chat-demo__proposal-eyebrow">Builder proposal</span>' +
      `<span class="chat-demo__proposal-meta">${esc(proposal.meta)}</span>` +
      '</div>' +
      `<p class="chat-demo__proposal-title">${esc(proposal.title)}</p>` +
      rows +
      `<button class="chat-demo__action${revealed ? ' is-done' : ''}" data-action type="button" tabindex="-1">` +
      `${esc(proposal.action)}</button>` +
      '</div>'
    );
  };

  /* ---- acts ---- */
  const playScenario = async (scenario) => {
    thread.innerHTML = '';
    inputEl.textContent = '';
    hintEl.style.opacity = '';
    setStatus('Demo');
    setStep('ask');
    await sleep(700);

    // Someone asks.
    await clickAt(composer, 0.2, 0.5);
    await typeInto(scenario.prompt);
    await sleep(360);
    await clickAt(sendBtn);

    inputEl.textContent = '';
    hintEl.style.opacity = '';
    const userMsg = el(`<div class="chat-demo__msg chat-demo__msg--user"><p>${esc(scenario.prompt)}</p></div>`);
    thread.appendChild(userMsg);
    reveal(userMsg);
    setStatus(scenario.status[0]);
    setStep('draft');
    await sleep(650);

    // Trading AI thinks, then answers.
    const reply = el(
      '<div class="chat-demo__msg chat-demo__msg--ai">' +
        '<span class="chat-demo__eyebrow">Incline AI' +
        '<span class="chat-demo__dots" data-dots><i></i><i></i><i></i></span></span>' +
        '<p data-reply></p></div>',
    );
    thread.appendChild(reply);
    reveal(reply);
    await sleep(1150);

    reply.querySelector('[data-dots]').remove();
    await streamText(reply.querySelector('[data-reply]'), scenario.reply);
    await sleep(420);

    // The builder proposal lands, rows settling one by one.
    const proposal = el(proposalHtml(scenario.proposal, false));
    thread.appendChild(proposal);
    reveal(proposal);
    setStatus(scenario.status[1]);
    setStep('approve');

    const rows = [...proposal.querySelectorAll('[data-row]')];
    for (let i = 0; i < rows.length; i += 1) {
      await sleep(i === 0 ? 280 : 330);
      rows[i].classList.add('is-in');
      scrollThread();
    }
    await sleep(650);

    // The human gate: the cursor sends it for approval.
    const action = proposal.querySelector('[data-action]');
    await clickAt(action);
    action.classList.add('is-done');
    action.textContent = scenario.done;
    setStatus(scenario.status[2]);
    setStep('run');
    scrollThread();
    await sleep(3000);
  };

  /* ---- static still (reduced motion) ---- */
  const renderStatic = () => {
    const scenario = SCENARIOS[0];

    thread.innerHTML = '';
    thread.appendChild(
      el(`<div class="chat-demo__msg chat-demo__msg--user is-in"><p>${esc(scenario.prompt)}</p></div>`),
    );
    thread.appendChild(
      el(
        '<div class="chat-demo__msg chat-demo__msg--ai is-in">' +
          '<span class="chat-demo__eyebrow">Incline AI</span>' +
          `<p>${esc(scenario.reply)}</p></div>`,
      ),
    );

    const proposal = el(proposalHtml(scenario.proposal, true));
    proposal.querySelector('[data-action]').textContent = scenario.done;
    thread.appendChild(proposal);
    setStatus(scenario.status[2]);
    setStep('run');
    composer.classList.add('is-hidden');
  };

  if (reducedMotion) {
    renderStatic();
    return;
  }

  /* ---- loop, gated on visibility ---- */
  const playLoop = async () => {
    let index = 0;

    for (;;) {
      await playScenario(SCENARIOS[index % SCENARIOS.length]);
      index += 1;
    }
  };

  let started = false;
  const handleVisibility = (isVisible) => {
    visible = isVisible;
    if (!isVisible) return;
    waiters.splice(0).forEach((resolve) => resolve());

    if (!started) {
      started = true;
      playLoop();
    }
  };

  if ('IntersectionObserver' in window) {
    let delivered = false;
    const io = new IntersectionObserver(
      (entries) => {
        delivered = true;
        handleVisibility(entries[0].isIntersecting);
      },
      { threshold: 0.3 },
    );

    io.observe(mount);
    setTimeout(() => {
      if (!delivered) {
        io.disconnect();
        handleVisibility(true);
      }
    }, 1500);
  } else {
    handleVisibility(true);
  }
})();
