const themeSelect = document.querySelector('.theme-control select');

try {
  const saved = localStorage.getItem('skills-theme');
  if (saved === 'light' || saved === 'dark') themeSelect.value = saved;
} catch {}

themeSelect.addEventListener('change', () => {
  const theme = themeSelect.value;
  if (theme === 'system') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.dataset.theme = theme;
  try {
    if (theme === 'system') localStorage.removeItem('skills-theme');
    else localStorage.setItem('skills-theme', theme);
  } catch {}
});

const menu = document.querySelector('.menu-toggle');
if (menu) {
  const sidebar = document.querySelector('#skill-sidebar');
  const scrim = document.querySelector('.nav-scrim');
  const focusable = () => [...sidebar.querySelectorAll('a[href]')];
  const close = (restoreFocus = true) => {
    sidebar.classList.remove('is-open');
    scrim.hidden = true;
    document.body.classList.remove('nav-open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open skill navigation');
    if (restoreFocus) menu.focus();
  };
  menu.addEventListener('click', () => {
    if (sidebar.classList.contains('is-open')) return close();
    sidebar.classList.add('is-open');
    scrim.hidden = false;
    document.body.classList.add('nav-open');
    menu.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-label', 'Close skill navigation');
    requestAnimationFrame(() => focusable()[0]?.focus());
  });
  scrim.addEventListener('click', () => close());
  sidebar.addEventListener('click', event => {
    if (event.target.closest('a')) close(false);
  });
  document.addEventListener('keydown', event => {
    if (!sidebar.classList.contains('is-open')) return;
    if (event.key === 'Escape') return close();
    if (event.key !== 'Tab') return;
    const links = focusable();
    if (event.shiftKey && document.activeElement === links[0]) {
      event.preventDefault();
      links.at(-1).focus();
    } else if (!event.shiftKey && document.activeElement === links.at(-1)) {
      event.preventDefault();
      links[0].focus();
    }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760 && sidebar.classList.contains('is-open')) close(false);
  });
}

for (const button of document.querySelectorAll('[data-copy]')) {
  button.addEventListener('click', async () => {
    const rail = button.closest('.install-rail');
    const command = rail?.querySelector('code')?.textContent;
    if (!command) return;
    const status = rail.querySelector('[role="status"]');
    let copied = false;
    try {
      await navigator.clipboard.writeText(command);
      copied = true;
    } catch {
      const field = document.createElement('textarea');
      field.value = command;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.append(field);
      field.select();
      try { copied = document.execCommand('copy'); } catch {}
      field.remove();
    }
    if (!copied) {
      if (status) status.textContent = 'Copy failed. Select the command and copy it manually.';
      return;
    }
    clearTimeout(button.copyTimer);
    button.textContent = 'Copied';
    button.dataset.state = 'copied';
    if (status) status.textContent = 'Install command copied to clipboard.';
    button.copyTimer = setTimeout(() => {
      button.textContent = 'Copy';
      delete button.dataset.state;
    }, 1600);
  });
}
