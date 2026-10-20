/*
 * Build-session demo (From prompt to working system).
 * A scripted, agent-style session: a tool is requested in plain words, a plan
 * appears, project files are written, the architecture is drawn, checks pass,
 * and the first run reports its output. Outputs over commands — the point is
 * what gets built, not what gets typed. Loops through two builds while on
 * screen; pauses off-screen; reduced-motion users get the finished session.
 */
(() => {
  'use strict';

  const mount = document.querySelector('[data-terminal-demo]');

  if (!mount || mount.dataset.demoInit) return;
  mount.dataset.demoInit = 'true';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Step types: cmd (typed request), plan (header + bullets), tool (⏺ call
  // with ⎿ result lines), write (⏺ Write + ⎿ added lines), block
  // (pre-formatted architecture), check (✓ line), graph (run report),
  // done (closing ✓).
  const SCENES = [
    [
      ['cmd', 'Build a tool that turns our sales calls into CRM notes and follow-ups.'],
      ['plan', ['Pull call recordings as they land', 'Summarize into notes, actions, and risks', 'You approve — then the CRM updates itself']],
      ['tool', 'Read crm/schema.json', ['12 fields mapped from sample calls']],
      ['write', [
        ['ingest/webhook.ts', '+64'],
        ['ai/summarize.ts', '+118'],
        ['approve/telegram-card.ts', '+52'],
        ['crm/sync.ts', '+71'],
      ]],
      ['tool', 'Run npm test', ['24 passing · 0 failed · 1.8s']],
      ['tool', 'Run npm run typecheck', ['0 errors across 14 files']],
      ['tool', 'Deploy preview', ['preview up · smoke checks green']],
      ['block', 'Architecture', 'calls ─▶ transcribe ─▶ summarize ─▶ [you approve] ─▶ CRM + follow-ups'],
      ['graph', 'First demo run', [
        'calls processed   ████████████  18/18',
        'notes to CRM      ████████████  18 synced',
        'sent unapproved   ░░░░░░░░░░░░  0 — gate held',
      ]],
      ['done', 'shipped — running with your approval in the loop'],
    ],
    [
      ['cmd', 'Build an agent that triages support email and drafts replies for approval.'],
      ['plan', ['Classify each email by intent and urgency', 'Draft replies grounded in the help docs', 'Send only after a human yes']],
      ['tool', 'Read docs/help-center/', ['38 articles indexed for grounding']],
      ['write', [
        ['triage/classify.py', '+87'],
        ['drafts/reply.py', '+102'],
        ['approvals/queue.py', '+58'],
      ]],
      ['tool', 'Run pytest', ['31 passed · 0 failed · 2.4s']],
      ['tool', 'Run reply evals', ['drafts on-tone 9/10 · grounded 10/10']],
      ['tool', 'Deploy preview', ['preview up · queue draining clean']],
      ['block', 'Architecture', 'inbox ─▶ classify ─▶ draft ─▶ [you approve] ─▶ send + log'],
      ['graph', 'First demo run', [
        'emails triaged    ████████████  42/42',
        'replies drafted   ██████████░░  36 ready',
        'auto-sent         ░░░░░░░░░░░░  0 — approval required',
      ]],
      ['done', 'shipped — humans stay in charge'],
    ],
  ];

  mount.innerHTML =
    '<div class="term">' +
    '<p class="term__bar">incline build agent — demo session</p>' +
    '<div class="term__body" data-term-body></div>' +
    '</div>';

  const body = mount.querySelector('[data-term-body]');

  let visible = false;
  let waiters = [];
  const whenVisible = () =>
    visible ? Promise.resolve() : new Promise((resolve) => waiters.push(resolve));
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)).then(whenVisible);

  const scrollBody = () => {
    body.scrollTop = body.scrollHeight;
  };

  const line = (className, text) => {
    const node = document.createElement('p');

    node.className = className;
    if (text !== undefined) node.textContent = text;
    body.appendChild(node);
    scrollBody();
    return node;
  };

  // Tool call: "⏺ <label>" on its own line.
  const toolLine = (label) => {
    const tool = line('term__tool');
    const dot = document.createElement('span');

    dot.className = 'term__dot';
    dot.textContent = '⏺';
    tool.append(dot, ' ', document.createTextNode(label));
    scrollBody();
    return tool;
  };

  // Indented "⎿ <result>" line under a tool call.
  const toolResult = (text, className) => {
    const out = line('term__tool-out');

    if (className) {
      const value = document.createElement('span');

      value.className = className;
      value.textContent = text;
      out.append('⎿  ', value);
    } else {
      out.append('⎿  ', document.createTextNode(text));
    }
    scrollBody();
    return out;
  };

  // Write pair: "⏺ Write <file>" then "⎿ +n lines".
  const writeLine = (file, added) => {
    toolLine('Write ' + file);
    return toolResult(added + ' lines', 'term__added');
  };

  // Section header; the Plan header carries the working ✱.
  const headLine = (text, star) => {
    const node = line('term__plan-head');

    if (star) {
      const mark = document.createElement('span');

      mark.className = 'term__star';
      mark.textContent = '✱';
      node.append(mark, ' ');
    }
    node.append(document.createTextNode(text));
    scrollBody();
    return node;
  };

  /* ---- static still (reduced motion): last scene, fully rendered ---- */
  const renderStep = (step) => {
    const [type] = step;

    if (type === 'cmd') {
      const cmd = line('term__cmd');
      cmd.innerHTML = '<span>›</span> ';
      cmd.appendChild(document.createTextNode(step[1]));
    } else if (type === 'plan') {
      headLine('Plan', true);
      step[1].forEach((item, i) => line('term__out', `${i + 1}. ${item}`));
    } else if (type === 'tool') {
      toolLine(step[1]);
      step[2].forEach((result) => toolResult(result));
    } else if (type === 'write') {
      step[1].forEach(([file, added]) => writeLine(file, added));
    } else if (type === 'block') {
      headLine(step[1]);
      line('term__block', step[2]);
    } else if (type === 'check') {
      line('term__ok', '✓ ' + step[1]);
    } else if (type === 'graph') {
      headLine(step[1]);
      step[2].forEach((row) => line('term__graph', row));
    } else if (type === 'done') {
      line('term__ok term__ok--done', '✓ ' + step[1]);
    }
  };

  const renderStatic = () => {
    SCENES[0].forEach(renderStep);
    line('term__cmd term__cmd--idle').innerHTML = '<span>›</span><i class="term__caret"></i>';
  };

  if (reducedMotion) {
    renderStatic();
    return;
  }

  /* ---- animated playback ---- */
  const playStep = async (step) => {
    const [type] = step;

    if (type === 'cmd') {
      const cmd = line('term__cmd');
      const prompt = document.createElement('span');
      const text = document.createTextNode('');
      const caret = document.createElement('i');

      prompt.textContent = '›';
      caret.className = 'term__caret';
      cmd.append(prompt, ' ', text, caret);
      await sleep(700);

      for (let i = 1; i <= step[1].length; i += 1) {
        text.textContent = step[1].slice(0, i);
        if (i % 4 === 0) scrollBody();
        await sleep(22);
      }

      await sleep(600);
      caret.remove();
    } else if (type === 'plan') {
      headLine('Plan', true);
      await sleep(520);
      for (let i = 0; i < step[1].length; i += 1) {
        line('term__out', `${i + 1}. ${step[1][i]}`);
        await sleep(480);
      }
      await sleep(420);
    } else if (type === 'tool') {
      toolLine(step[1]);
      await sleep(620);
      for (const result of step[2]) {
        toolResult(result);
        await sleep(460);
      }
      await sleep(280);
    } else if (type === 'write') {
      for (const [file, added] of step[1]) {
        writeLine(file, added);
        await sleep(440);
      }
      await sleep(360);
    } else if (type === 'block') {
      headLine(step[1]);
      await sleep(460);
      line('term__block', step[2]);
      await sleep(950);
    } else if (type === 'check') {
      line('term__ok', '✓ ' + step[1]);
      await sleep(480);
    } else if (type === 'graph') {
      headLine(step[1]);
      await sleep(460);
      for (const row of step[2]) {
        line('term__graph', row);
        await sleep(520);
      }
      await sleep(500);
    } else if (type === 'done') {
      line('term__ok term__ok--done', '✓ ' + step[1]);
      await sleep(3400);
    }
  };

  const playLoop = async () => {
    for (let index = 0; ; index += 1) {
      body.innerHTML = '';
      await sleep(600);

      for (const step of SCENES[index % SCENES.length]) {
        await playStep(step);
      }

      const idle = line('term__cmd term__cmd--idle');
      idle.innerHTML = '<span>›</span><i class="term__caret"></i>';
      await sleep(3000);
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
