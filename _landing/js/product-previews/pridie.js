(() => {
  window.InclineProductPreviews = window.InclineProductPreviews || {};

  const desktop = `
    <div class="product-screen--pridie pridie-preview pridie-preview--desktop" aria-hidden="true">
      <div class="pridie-preview__sky" aria-hidden="true"><span></span><span></span><span></span></div>
      <header class="pridie-preview__header">
        <strong class="pridie-preview__brand">pridie</strong>
        <span class="pridie-preview__header-note">plan tomorrow tonight</span>
      </header>
      <div class="pridie-preview__workspace">
        <aside class="pridie-preview__sidebar" aria-label="Chat workspace navigation">
          <div class="pridie-preview__mode-switch" aria-label="Workspace mode">
            <span class="pridie-preview__mode pridie-preview__mode--active">AI</span>
            <span class="pridie-preview__mode">Calendar</span>
          </div>
          <div class="pridie-preview__sidebar-tools">
            <span class="pridie-preview__search">Search</span>
            <span class="pridie-preview__add" aria-hidden="true">+</span>
          </div>
          <nav class="pridie-preview__threads" aria-label="Preview conversations">
            <p class="pridie-preview__micro-label">Today</p>
            <span class="pridie-preview__thread pridie-preview__thread--active">Shape tomorrow</span>
            <span class="pridie-preview__thread">Weekly reset</span>
            <p class="pridie-preview__micro-label">Recents</p>
            <span class="pridie-preview__thread">Morning routine</span>
            <span class="pridie-preview__thread">Project notes</span>
          </nav>
          <div class="pridie-preview__account">
            <span class="pridie-preview__avatar">P</span>
            <span><strong>Pridie preview</strong><small>Product workspace</small></span>
            <span aria-hidden="true">⌄</span>
          </div>
        </aside>
        <div class="pridie-preview__chat">
          <div class="pridie-preview__greeting">
            <span class="pridie-preview__mark" aria-hidden="true">✦</span>
            <h3>Good evening</h3>
            <p>What should we work through?</p>
          </div>
          <div class="pridie-preview__suggestions" aria-label="Example prompts">
            <span>Plan tomorrow</span>
            <span>Set a reminder</span>
            <span>Recall a memory</span>
          </div>
          <div class="pridie-preview__composer" role="textbox" aria-label="Message Pridie" aria-readonly="true">
            <p>Message Pridie</p>
            <div class="pridie-preview__composer-tools">
              <span aria-hidden="true">＋</span>
              <small>pridie v1</small>
              <span aria-hidden="true">◉</span>
              <span class="pridie-preview__send" aria-hidden="true">↑</span>
            </div>
          </div>
          <div class="pridie-preview__dots" aria-label="AI chat selected, calendar available">
            <span class="pridie-preview__dot pridie-preview__dot--active"></span><span class="pridie-preview__dot"></span>
          </div>
        </div>
      </div>
    </div>`;

  const laptop = `
    <div class="product-screen--pridie pridie-preview pridie-preview--laptop" aria-hidden="true">
      <div class="pridie-preview__sky" aria-hidden="true"><span></span><span></span><span></span></div>
      <header class="pridie-preview__header">
        <strong class="pridie-preview__brand">pridie</strong>
        <span class="pridie-preview__route">Tomorrow</span>
      </header>
      <div class="pridie-preview__plan">
        <div class="pridie-preview__plan-heading">
          <h3>Tomorrow</h3><span>Sunday · 12 July</span>
        </div>
        <p class="pridie-preview__plan-intro">A calmer day, with the important work protected before the afternoon fills up.</p>
        <div class="pridie-preview__plan-grid">
          <div class="pridie-preview__plan-column">
            <section class="pridie-preview__card">
              <p class="pridie-preview__micro-label">Carried over</p>
              <div class="pridie-preview__chips"><span>Review product brief</span><span>Book gym session</span></div>
            </section>
            <section class="pridie-preview__card">
              <p class="pridie-preview__micro-label">Goals in view</p>
              <div class="pridie-preview__chips"><span>Ship thoughtfully</span><span>Move every day</span></div>
            </section>
          </div>
          <section class="pridie-preview__card pridie-preview__shape">
            <p class="pridie-preview__micro-label">Tomorrow's shape</p>
            <ol class="pridie-preview__timeline">
              <li><time>07:30</time><i style="--pr-event:#10b981"></i><span><strong>Morning reset</strong><small>Ritual · 45 min</small></span></li>
              <li><time>09:00</time><i style="--pr-event:#3b9bff"></i><span><strong>Focused product work</strong><small>Deep work · 2 hr</small></span></li>
              <li><time>18:00</time><i style="--pr-event:#c084fc"></i><span><strong>Gym and unwind</strong><small>Personal · 75 min</small></span></li>
            </ol>
          </section>
        </div>
        <div class="pridie-preview__confirmation">
          <span class="pridie-preview__confirm-button">✓&nbsp; Confirm tomorrow</span>
          <span class="pridie-preview__edit-link">Edit blocks in calendar</span>
        </div>
      </div>
      <div class="pridie-preview__dots" aria-label="Tomorrow plan selected, calendar available">
        <span class="pridie-preview__dot pridie-preview__dot--active"></span><span class="pridie-preview__dot"></span>
      </div>
    </div>`;

  const tablet = `
    <div class="product-screen--pridie pridie-preview pridie-preview--tablet" aria-hidden="true">
      <header class="pridie-preview__header">
        <strong class="pridie-preview__brand">pridie</strong>
        <span class="pridie-preview__route">Calendar</span>
      </header>
      <div class="pridie-preview__calendar">
        <section class="pridie-preview__month" aria-label="July 2026 calendar">
          <div class="pridie-preview__month-heading"><strong>July 2026</strong><span>‹&nbsp;&nbsp;›</span></div>
          <div class="pridie-preview__weekdays"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>
          <div class="pridie-preview__days">
            <span class="is-muted">29</span><span class="is-muted">30</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
            <span>6</span><span>7</span><span>8</span><span>9</span><span class="has-plan">10</span><span class="is-selected">11</span><span>12</span>
            <span>13</span><span>14</span><span class="has-plan">15</span><span>16</span><span>17</span><span>18</span><span>19</span>
            <span>20</span><span>21</span><span>22</span><span>23</span><span>24</span><span>25</span><span>26</span>
            <span>27</span><span>28</span><span>29</span><span>30</span><span>31</span><span class="is-muted">1</span><span class="is-muted">2</span>
          </div>
          <div class="pridie-preview__calendar-legend"><span><i style="--pr-event:#3b9bff"></i>Deep work</span><span><i style="--pr-event:#10b981"></i>Ritual</span></div>
        </section>
        <section class="pridie-preview__selected-day">
          <p class="pridie-preview__micro-label">Selected day</p>
          <div class="pridie-preview__day-heading"><h3>Saturday, July 11</h3><span>4 blocks · 2h deep</span></div>
          <ol class="pridie-preview__timeline">
            <li><time>08:00</time><i style="--pr-event:#10b981"></i><span><strong>Slow morning</strong><small>Ritual · 45 min</small></span></li>
            <li><time>10:00</time><i style="--pr-event:#3b9bff"></i><span><strong>Product deep work</strong><small>Deep work · 2 hr</small></span></li>
            <li><time>13:00</time><i style="--pr-event:#f59e0b"></i><span><strong>Lunch and walk</strong><small>Personal · 1 hr</small></span></li>
            <li><time>21:30</time><i style="--pr-event:#c084fc"></i><span><strong>Shape tomorrow</strong><small>Planning · 20 min</small></span></li>
          </ol>
        </section>
      </div>
      <div class="pridie-preview__dots" aria-label="Calendar selected, AI chat available">
        <span class="pridie-preview__dot"></span><span class="pridie-preview__dot pridie-preview__dot--active"></span>
      </div>
    </div>`;

  const phone = `
    <div class="product-screen--pridie pridie-preview pridie-preview--phone" aria-hidden="true">
      <div class="pridie-preview__sky" aria-hidden="true"><span></span><span></span><span></span></div>
      <header class="pridie-preview__header">
        <strong class="pridie-preview__brand">pridie</strong>
        <span class="pridie-preview__route">Tomorrow</span>
      </header>
      <div class="pridie-preview__phone-confirmed">
        <div class="pridie-preview__phone-status">
          <span class="pridie-preview__phone-check" aria-hidden="true">✓</span>
          <p class="pridie-preview__micro-label">Tomorrow confirmed</p>
          <h3>Sunday, 12 July</h3>
          <p>Three calm blocks are ready.</p>
        </div>

        <ol class="pridie-preview__phone-plan" aria-label="Confirmed blocks">
          <li><time>07:30</time><i style="--pr-event:#10b981"></i><span><strong>Morning reset</strong><small>45 min</small></span></li>
          <li><time>09:00</time><i style="--pr-event:#3b9bff"></i><span><strong>Focused work</strong><small>2 hr</small></span></li>
          <li><time>18:00</time><i style="--pr-event:#c084fc"></i><span><strong>Gym + unwind</strong><small>75 min</small></span></li>
        </ol>

        <div class="pridie-preview__phone-reminder">
          <span class="pridie-preview__phone-reminder-icon" aria-hidden="true">◷</span>
          <span><small>Reminder set</small><strong>Shape tomorrow · 9:30 PM</strong></span>
        </div>

        <span class="pridie-preview__phone-action">Review in calendar</span>
      </div>
      <div class="pridie-preview__dots" aria-label="Tomorrow confirmed, calendar selected">
        <span class="pridie-preview__dot"></span><span class="pridie-preview__dot pridie-preview__dot--active"></span>
      </div>
    </div>`;

  window.InclineProductPreviews.pridie = {
    key: 'pridie',
    label: 'pridie.ai',
    eyebrow: 'Product in development',
    title: 'Pridie planning tomorrow in one calm surface.',
    screens: { desktop, laptop, tablet, phone },
  };
})();
