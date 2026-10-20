// Product-proof interactions. Product switching is layered onto this controller.
(() => {
  const roots = document.querySelectorAll('.tp');
  if (!roots.length) return;

  const strategySets = [
    {
      label: 'Core Trends',
      strategies: ['Trend confirmation', 'Volume confirmation', 'Volatility guard', 'Momentum filter'],
    },
    {
      label: 'Clean Reversion',
      strategies: ['Mean reversion', 'Range return', 'Drift reset', 'Price normalization'],
    },
    {
      label: 'Active Execution',
      strategies: ['Approval required', 'Telegram confirmed', 'Paper execution', 'Runtime guard'],
    },
    {
      label: 'Expansion & Breakout',
      strategies: ['Breakout filter', 'Expansion pulse', 'Momentum carry', 'Trailing guard'],
    },
  ];

  const news = [
    {
      title: 'Bitcoin risk narrows while AI filters keep exposure selective',
      summary: 'Volatility remains elevated, but approval rules are only allowing high-quality trend continuation setups.',
      time: '1h',
      tag: 'BTC',
      sentiment: 'neutral',
    },
    {
      title: 'BNB rotation lifts active strategies after liquidity scan',
      summary: 'The latest execution run favored cleaner order flow and reduced entries in crowded reversal zones.',
      time: '2h',
      tag: 'BNB',
      sentiment: 'bullish',
    },
    {
      title: 'Macro caution keeps short-term risk throttles engaged',
      summary: 'The platform is holding lower sizing while trend engines wait for stronger confirmation.',
      time: '4h',
      tag: 'ETH',
      sentiment: 'bearish',
    },
  ];

  const prompts = {
    'What is Velator?': 'What is Velator?',
    'Build strategy': 'Build a BTC trend strategy with Telegram approval.',
    'Risk rules': 'How should risk work before live execution?',
    'Book demo': 'Can I book a demo?',
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const sanitizeTradignPreview = (root) => {
    const setText = (node, value) => {
      if (node) node.textContent = value;
    };
    const chartStats = root.querySelector('.tp__screen--desktop .main-overview__chart-stats');
    setText(chartStats?.querySelector('.main-overview__stat--positive:not(.main-overview__stat--net)'), '+18.4%');
    setText(chartStats?.querySelector('.main-overview__stat--negative'), '-7.1%');
    setText(chartStats?.querySelector('.main-overview__stat--net'), '+11.3%');
    chartStats?.querySelector('.main-overview__scope-pill')?.remove();
    chartStats?.querySelector('.main-overview__sync-pill')?.remove();
    setText(chartStats?.querySelector('.main-overview__stat--count'), '84 sample trades');

    const strategyLabels = ['Trend confirmation', 'Mean reversion', 'Breakout filter', 'Risk guard'];
    root.querySelectorAll('.trades-table__td--strategy').forEach((node, index) => {
      setText(node, strategyLabels[index % strategyLabels.length]);
    });

    root.querySelectorAll('.pnl-chart').forEach((chart) => {
      ['+24%', '+18%', '+12%', '+6%'].forEach((value, index) => {
        setText(chart.querySelectorAll('.pnl-chart__axis')[index], value);
      });
      ['+4.2%', '+17.5%', '+11.2%', '+5.3%'].forEach((value, index) => {
        setText(chart.querySelectorAll('.pnl-chart__val')[index], value);
      });
      strategyLabels.forEach((value, index) => {
        setText(chart.querySelectorAll('.pnl-chart__xlabel')[index], value);
      });
    });

    ['+24%', '+20%', '+16%', '+12%', '+8%', '+4%', '0%'].forEach((value, index) => {
      setText(root.querySelectorAll('.tp__screen--desktop .grp-chart__y-label')[index], value);
    });

    root.querySelectorAll('.pulse__metric').forEach((metric) => {
      if (metric.querySelector('.pulse__metric-label')?.textContent.trim() === 'P&L YTD') {
        setText(metric.querySelector('.pulse__metric-val'), '+11.3%');
      }
    });
  };

  roots.forEach((root) => {
    sanitizeTradignPreview(root);
    let tick = 0;
    let activeSet = 0;
    let activeNews = 0;

    const selectSet = (index) => {
      if (index < 0 || index >= strategySets.length) return;
      activeSet = index;

      root.querySelectorAll('.strategies-nav__item').forEach((item, itemIndex) => {
        item.classList.toggle('strategies-nav__item--active-root', itemIndex === index);
      });

      const overviewLinks = [...root.querySelectorAll('.main-sidebar__links .main-sidebar__link')];
      overviewLinks.forEach((link, linkIndex) => {
        link.classList.toggle('main-sidebar__link--active', linkIndex === 0 || linkIndex === index + 1);
      });

      const strategyCard = root.querySelector('.main-sidebar__strategy-list')?.closest('.sidebar__card');
      const title = strategyCard?.querySelector('.sidebar__card-title');
      if (title) title.textContent = strategySets[index].label;

      const list = strategyCard?.querySelector('.main-sidebar__strategy-list');
      if (list) {
        list.replaceChildren(...strategySets[index].strategies.map((name, strategyIndex) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = `main-sidebar__strategy${strategyIndex === 0 ? ' main-sidebar__strategy--active' : ''}`;
          button.textContent = name;
          button.addEventListener('click', () => {
            list.querySelectorAll('.main-sidebar__strategy').forEach((item) => {
              item.classList.toggle('main-sidebar__strategy--active', item === button);
            });
          });
          return button;
        }));
      }

      updatePulse();
    };

    root.querySelectorAll('.strategies-nav__link').forEach((button, index) => {
      button.addEventListener('click', () => selectSet(index));
    });

    root.querySelectorAll('[aria-label="Select market"]').forEach((group) => {
      group.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', () => {
          const market = button.textContent.trim();
          root.querySelectorAll('[aria-label="Select market"] button').forEach((candidate) => {
            candidate.classList.toggle('seg-switch__btn--active', candidate.textContent.trim() === market);
          });
        });
      });
    });

    root.querySelectorAll('[aria-label="Chart period"] button').forEach((button) => {
      button.addEventListener('click', () => {
        button.parentElement.querySelectorAll('button').forEach((candidate) => {
          candidate.classList.toggle('seg-switch__btn--active', candidate === button);
        });
      });
    });

    const renderNews = () => {
      const item = news[activeNews];
      root.querySelectorAll('.pulse__card--news').forEach((card) => {
        const dot = card.querySelector('.pulse__news-dot');
        const title = card.querySelector('.pulse__news-title');
        const summary = card.querySelector('.pulse__news-desc');
        const time = card.querySelector('.pulse__news-time');
        const tag = card.querySelector('.pulse__news-coin');
        const counter = card.querySelector('.pulse__nav-cnt');
        if (dot) dot.dataset.s = item.sentiment;
        if (title) title.textContent = item.title;
        if (summary) summary.textContent = item.summary;
        if (time) time.textContent = item.time;
        if (tag) tag.textContent = item.tag;
        if (counter) counter.textContent = `${activeNews + 1}/${news.length}`;
      });
    };

    root.querySelectorAll('[aria-label="Previous news"]').forEach((button) => {
      button.addEventListener('click', () => {
        activeNews = (activeNews - 1 + news.length) % news.length;
        renderNews();
      });
    });
    root.querySelectorAll('[aria-label="Next news"]').forEach((button) => {
      button.addEventListener('click', () => {
        activeNews = (activeNews + 1) % news.length;
        renderNews();
      });
    });

    const chatThread = root.querySelector('[data-chat-thread]');
    const chatForm = root.querySelector('.device-ai-chat__composer');
    const chatInput = chatForm?.querySelector('.device-ai-chat__input');
    const chatSend = chatForm?.querySelector('[aria-label="Send demo prompt"]');

    const makeReply = (prompt) => {
      const text = prompt.toLowerCase();
      if (/(^|\s)(hi|hii|hello|hey|namaste)(\s|$|[!.?])/.test(text)) {
        return ['online', 'Hi, I am the Velator AI demo. Ask me about strategy building, backtests, risk controls, Telegram approval, or live execution.', ['Try: build BTC strategy', 'Try: explain risk rules', 'Try: book demo']];
      }
      if (text.includes('velator') || text.includes('what is') || text.includes('ai trading')) {
        return ['product', 'Velator is the flagship AI trading surface: strategy building, optional backtests, paper and live modes, configurable approvals, and guarded execution.', ['Analyst view for charts and strategy health.', 'AI chat for turning intent into rules.', 'Approval mode for operator review before live actions.']];
      }
      if (text.includes('strategy') || text.includes('build') || text.includes('backtest')) {
        return ['strategy', 'A clean demo strategy would use trend confirmation first, then volatility filters, with backtest and paper modes available before live deployment.', ['Signal: EMA ribbon plus volume expansion.', 'Backtest: compare win rate, drawdown, profit factor, and trade count.', 'Deploy: choose paper, approval mode, or the configured direct policy.']];
      }
      if (text.includes('telegram') || text.includes('approval') || text.includes('approve')) {
        return ['approval', 'When Telegram approval is enabled, the system prepares a trade card and waits for human confirmation. Direct execution is a separate configured mode.', ['Entry, stop, target, confidence, and risk are shown together.', 'Rejected trades stay logged for later review.']];
      }
      if (text.includes('risk') || text.includes('drawdown') || text.includes('loss')) {
        return ['guarded', 'Risk should be enforced before execution, not after. The demo uses account risk, drawdown throttles, cooldowns, and max-open-trade limits.', ['Default risk: under 1% per idea.', 'If drawdown expands, live size gets reduced automatically.']];
      }
      if (text.includes('demo') || text.includes('price') || text.includes('pricing') || text.includes('contact')) {
        return ['next step', 'For a real build, the next step is a short project fit conversation with Incline so the app, data, execution, and security boundaries are clear.', null, ['Contact us', '/contact']];
      }
      return ['handoff', 'I can answer basic Velator demo questions here. For anything specific to your trading setup, exchange, broker, budget, or timeline, Incline should handle it directly.', null, ['Contact us', '/contact']];
    };

    const messageRow = (sender, text, eyebrow, bullets, action) => {
      const row = document.createElement('div');
      row.className = `device-ai-chat__message-row device-ai-chat__message-row--${sender}`;
      const message = document.createElement('div');
      message.className = `device-ai-chat__message device-ai-chat__message--${sender}`;

      if (sender === 'assistant') {
        const from = document.createElement('p');
        from.className = 'device-ai-chat__from-row';
        from.append('Trading AI ');
        const state = document.createElement('span');
        state.textContent = eyebrow || 'reply';
        from.append(state);
        message.append(from);
      }

      const content = document.createElement('div');
      content.className = 'device-ai-chat__content';
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      content.append(paragraph);

      if (bullets?.length) {
        const list = document.createElement('ul');
        bullets.forEach((bullet) => {
          const item = document.createElement('li');
          item.textContent = bullet;
          list.append(item);
        });
        content.append(list);
      }

      if (action) {
        const link = document.createElement('a');
        link.className = 'device-ai-chat__action';
        link.href = action[1];
        link.textContent = action[0];
        content.append(link);
      }

      message.append(content);
      row.append(message);
      return row;
    };

    const submitChat = (raw) => {
      const text = raw.trim();
      if (!text || !chatThread) return;
      const insights = chatThread.querySelector('.device-ai-chat__insights');
      const reply = makeReply(text);
      insights?.before(messageRow('user', text), messageRow('assistant', reply[1], reply[0], reply[2], reply[3]));
      const rows = chatThread.querySelectorAll('.device-ai-chat__message-row');
      [...rows].slice(0, Math.max(0, rows.length - 5)).forEach((row) => row.remove());
      if (chatInput) chatInput.value = '';
      if (chatSend) chatSend.disabled = true;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        chatThread.scrollTop = chatThread.scrollHeight;
      }));
    };

    chatForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      submitChat(chatInput?.value || '');
    });
    chatInput?.addEventListener('input', () => {
      if (chatSend) chatSend.disabled = !chatInput.value.trim();
    });
    chatInput?.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' || event.shiftKey) return;
      event.preventDefault();
      submitChat(chatInput.value);
    });
    chatForm?.querySelectorAll('.device-ai-chat__faq button').forEach((button) => {
      button.addEventListener('click', () => submitChat(prompts[button.textContent.trim()] || button.textContent));
    });

    function updatePulse() {
      const value = Math.round(clamp(26 + Math.sin(tick * 0.52) * 5 + activeSet * 2, 0, 100));
      const classification = value < 25 ? 'Extreme Fear' : value < 45 ? 'Fear' : value < 75 ? 'Greed' : 'Extreme Greed';
      const tone = value < 25 ? 'extreme-fear' : value < 45 ? 'fear' : value < 75 ? 'greed' : 'extreme-greed';
      const color = value < 25 ? 'var(--error)' : value < 45 ? 'var(--warning)' : 'var(--success)';
      const colorRgb = value < 25 ? 'var(--error-rgb)' : value < 45 ? 'var(--warning-rgb)' : 'var(--success-rgb)';
      const comparisons = [
        Math.round(clamp(value + 7 + Math.sin(tick * 0.35) * 3, 0, 100)),
        Math.round(clamp(value + 5 + Math.cos(tick * 0.45) * 4, 0, 100)),
        Math.round(clamp(value - 14 + Math.sin(tick * 0.25) * 3, 0, 100)),
      ];

      root.querySelectorAll('.fg').forEach((fg) => {
        fg.dataset.mood = tone;
        fg.closest('.pulse__card--fg')?.setAttribute('data-mood', tone);
        const mainValue = fg.querySelector('.fg__main-val');
        const mainClass = fg.querySelector('.fg__main-class');
        if (mainValue) mainValue.textContent = value;
        if (mainClass) {
          mainClass.textContent = classification;
          mainClass.style.color = color;
        }
        fg.querySelectorAll('.fg__bubble--cmp').forEach((bubble, index) => {
          const comparison = comparisons[index];
          const bubbleValue = bubble.querySelector('.fg__bubble-val');
          if (bubbleValue) bubbleValue.textContent = comparison;
          bubble.style.setProperty('--bubble-scale', clamp(0.82 + comparison / 160, 0.82, 1.2));
          bubble.style.setProperty('--bubble-color', comparison < 25 ? 'var(--error)' : comparison < 45 ? 'var(--warning)' : 'var(--success)');
          bubble.style.setProperty('--bubble-color-rgb', comparison < 25 ? 'var(--error-rgb)' : comparison < 45 ? 'var(--warning-rgb)' : 'var(--success-rgb)');
        });
      });

      root.querySelectorAll('.pulse__card--news').forEach((card) => {
        const fill = card.querySelector('.pulse__bar-fill');
        const thumb = card.querySelector('.pulse__bar-thumb');
        const badge = card.querySelector('.pulse__bar-badge');
        if (fill) fill.style.width = `${value}%`;
        if (thumb) thumb.style.left = `${value}%`;
        if (badge) {
          badge.dataset.mood = tone;
          badge.textContent = `${value} — ${classification}`;
        }
      });

      const assets = ['BTC', 'ETH', 'BNB', 'SOL'];
      const active = 5 + activeSet + (tick % 2);
      root.querySelectorAll('.pulse__card--stats').forEach((card) => {
        const metrics = card.querySelectorAll('.pulse__metric');
        if (metrics[0]) {
          const valueNode = metrics[0].querySelector('.pulse__metric-val');
          if (valueNode) valueNode.lastChild.textContent = ` ${active} `;
          const directions = metrics[0].querySelectorAll('.pulse__metric-dir span');
          if (directions[0]) directions[0].textContent = `${Math.max(1, active - 2)}L`;
          if (directions[1]) directions[1].textContent = `${active - Math.max(1, active - 2)}S`;
        }
        if (metrics[2]) {
          const symbol = metrics[2].querySelector('.pulse__metric-val');
          const pnl = metrics[2].querySelector('.pulse__metric-dir');
          if (symbol) symbol.textContent = assets[(tick + activeSet) % assets.length];
          if (pnl) pnl.textContent = `${Math.sin(tick * 0.4) > 0 ? '+' : '-'}${clamp(2.2 + Math.abs(Math.sin(tick * 0.4)) * 2.4, 1, 8).toFixed(2)}%`;
        }
      });

      root.querySelectorAll('.grp-chart__groups').forEach((groups) => {
        const base = [[52, 66], [78, 92], [42, 64], [10, 34], [18, 22], [14, 19], [21, 16]];
        groups.querySelectorAll('.grp-chart__column').forEach((column, index) => {
          const bars = column.querySelectorAll('.grp-chart__bar');
          if (bars[0]) bars[0].style.height = `${clamp(base[index][0] + Math.sin((tick + index) * 0.62) * 2.4 + activeSet * 1.2, 2, 96)}%`;
          if (bars[1]) bars[1].style.height = `${clamp(base[index][1] + Math.cos((tick + index) * 0.5) * 2.2, 2, 96)}%`;
        });
      });
    }

    updatePulse();
    const timer = window.setInterval(() => {
      tick += 1;
      updatePulse();
    }, 1200);
    window.addEventListener('pagehide', () => window.clearInterval(timer), { once: true });
  });
})();
