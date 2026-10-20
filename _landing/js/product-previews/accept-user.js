(() => {
  window.InclineProductPreviews = window.InclineProductPreviews || {};

  window.InclineProductPreviews.acceptUser = {
    key: 'accept-user',
    label: 'accept user bot',
    eyebrow: 'Telegram automation proof',
    title: 'Accept User automating Telegram onboarding.',
    screens: {
      desktop: `
        <div class="product-screen product-screen--accept-user aur-telegram aur-telegram--desktop" aria-hidden="true">
          <aside class="aur-sidebar">
            <div class="aur-sidebar__top">
              <span class="aur-menu-icon"><i></i><i></i><i></i></span>
              <span class="aur-search">Search</span>
            </div>
            <div class="aur-chat-list">
              <div class="aur-chat-list__item aur-chat-list__item--active">
                <span class="aur-avatar aur-avatar--bot">AU</span>
                <span class="aur-chat-list__copy">
                  <strong>Accept User Admin</strong>
                  <small>Choose your action</small>
                </span>
                <span class="aur-chat-list__time">now</span>
              </div>
              <div class="aur-chat-list__item">
                <span class="aur-avatar aur-avatar--plain">DB</span>
                <span class="aur-chat-list__copy">
                  <strong>@demo_bot</strong>
                  <small>Bot setup ready</small>
                </span>
                <span class="aur-chat-list__time">demo</span>
              </div>
            </div>
          </aside>

          <section class="aur-chat">
            <header class="aur-chat__header">
              <span class="aur-avatar aur-avatar--bot">AU</span>
              <span class="aur-chat__identity">
                <strong>Accept User Admin</strong>
                <small>bot</small>
              </span>
              <span class="aur-header-actions"><i></i><i></i><i></i></span>
            </header>

            <div class="aur-conversation">
              <span class="aur-date-chip">Demo preview</span>
              <article class="aur-message aur-message--bot aur-message--wide">
                <p><strong>Welcome to AcceptUserRequest Bot.</strong></p>
                <p>Manage channel join requests and welcome messages from this Telegram panel.</p>
                <div class="aur-inline-grid aur-inline-grid--two">
                  <button type="button" tabindex="-1">Add Your Bot</button>
                  <button type="button" tabindex="-1">Show My Bots</button>
                  <button type="button" tabindex="-1">Bot Details</button>
                  <button type="button" tabindex="-1">Contact Admin</button>
                </div>
                <time>demo</time>
              </article>
            </div>

            <div class="aur-composer">
              <span class="aur-composer__attach">+</span>
              <span class="aur-composer__field">Write a message...</span>
              <span class="aur-composer__mic"></span>
            </div>
          </section>
        </div>
      `,

      laptop: `
        <div class="product-screen product-screen--accept-user aur-telegram aur-telegram--laptop" aria-hidden="true">
          <section class="aur-chat">
            <header class="aur-chat__header">
              <span class="aur-back">‹</span>
              <span class="aur-avatar aur-avatar--bot">DB</span>
              <span class="aur-chat__identity">
                <strong>@demo_bot</strong>
                <small>owner controls</small>
              </span>
              <span class="aur-header-actions"><i></i><i></i><i></i></span>
            </header>

            <div class="aur-conversation aur-conversation--editor">
              <span class="aur-date-chip">Welcome + onboarding editor · demo</span>
              <article class="aur-message aur-message--bot aur-message--owner aur-message--editor">
                <div class="aur-editor-heading">
                  <span><small>BOT SETUP</small><strong>Edit onboarding message</strong></span>
                  <span class="aur-editor-step">2 of 3</span>
                </div>

                <div class="aur-editor-layout">
                  <div class="aur-editor-fields">
                    <div class="aur-editor-field">
                      <span>Welcome message</span>
                      <strong>Welcome! Tap below to finish setup and choose updates.</strong>
                    </div>
                    <div class="aur-editor-field">
                      <span>Onboarding button</span>
                      <strong>I’m ready</strong>
                    </div>
                  </div>

                  <div class="aur-editor-preview">
                    <small>TELEGRAM PREVIEW</small>
                    <p>Welcome! Tap below to finish setup and choose updates.</p>
                    <span class="aur-editor-preview__button">I’m ready</span>
                  </div>
                </div>

                <div class="aur-inline-grid aur-inline-grid--two aur-editor-actions">
                  <button type="button" tabindex="-1">Save message</button>
                  <button type="button" tabindex="-1">Back to bot</button>
                </div>
                <time>demo</time>
              </article>
            </div>

            <div class="aur-composer">
              <span class="aur-composer__attach">+</span>
              <span class="aur-composer__field">Write a message...</span>
              <span class="aur-composer__mic"></span>
            </div>
          </section>
        </div>
      `,

      tablet: `
        <div class="product-screen product-screen--accept-user aur-telegram aur-telegram--tablet" aria-hidden="true">
          <section class="aur-chat">
            <header class="aur-chat__header">
              <span class="aur-back">‹</span>
              <span class="aur-avatar aur-avatar--bot">DB</span>
              <span class="aur-chat__identity">
                <strong>@demo_bot</strong>
                <small>broadcast controls</small>
              </span>
              <span class="aur-header-actions"><i></i><i></i><i></i></span>
            </header>

            <div class="aur-conversation aur-conversation--scheduler">
              <span class="aur-date-chip">One-time broadcast · demo</span>
              <article class="aur-message aur-message--bot aur-message--scheduler">
                <div class="aur-scheduler-heading">
                  <span><small>SCHEDULE BROADCAST</small><strong>Choose date &amp; time</strong></span>
                  <span class="aur-scheduler-zone">IST</span>
                </div>

                <div class="aur-scheduler-layout">
                  <section class="aur-scheduler-calendar" aria-label="July 2026 demo calendar">
                    <div class="aur-scheduler-month"><strong>July 2026</strong><span>‹&nbsp;&nbsp;›</span></div>
                    <div class="aur-scheduler-weekdays"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>
                    <div class="aur-scheduler-days">
                      <span class="is-muted">29</span><span class="is-muted">30</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                      <span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span>
                      <span>13</span><span class="is-selected">14</span><span>15</span><span>16</span><span>17</span><span>18</span><span>19</span>
                    </div>
                  </section>

                  <section class="aur-scheduler-times" aria-label="Demo time choices">
                    <small>TIME</small>
                    <div><span>09:00</span><span>12:30</span><span class="is-selected">18:30</span><span>21:00</span></div>
                  </section>
                </div>

                <div class="aur-scheduler-summary">
                  <span><small>SENDS ON</small><strong>Tuesday, 14 July · 18:30</strong></span>
                  <span><small>MESSAGE</small><strong>Community update + 1 button</strong></span>
                </div>

                <div class="aur-inline-grid aur-inline-grid--two aur-scheduler-actions">
                  <button type="button" tabindex="-1">Confirm schedule</button>
                  <button type="button" tabindex="-1">Back</button>
                </div>
                <time>demo</time>
              </article>
            </div>

            <div class="aur-composer">
              <span class="aur-composer__attach">+</span>
              <span class="aur-composer__field">Message</span>
              <span class="aur-composer__mic"></span>
            </div>
          </section>
        </div>
      `,

      phone: `
        <div class="product-screen product-screen--accept-user aur-telegram aur-telegram--phone" aria-hidden="true">
          <section class="aur-chat">
            <header class="aur-chat__header">
              <span class="aur-back">‹</span>
              <span class="aur-avatar aur-avatar--bot">DB</span>
              <span class="aur-chat__identity">
                <strong>@demo_bot</strong>
                <small>bot</small>
              </span>
              <span class="aur-header-actions"><i></i><i></i><i></i></span>
            </header>

            <div class="aur-conversation aur-conversation--phone">
              <span class="aur-date-chip">Today</span>
              <article class="aur-message aur-message--bot">
                <p>Tap a button to finish onboarding and choose updates.</p>
                <div class="aur-inline-grid">
                  <button type="button" tabindex="-1">I’m ready</button>
                  <button type="button" tabindex="-1">I’m not robot</button>
                </div>
                <time>demo</time>
              </article>
            </div>

            <div class="aur-composer aur-composer--phone">
              <span class="aur-composer__field">/start</span>
              <span class="aur-send-icon">➤</span>
            </div>
          </section>
        </div>
      `,
    },
  };
})();
