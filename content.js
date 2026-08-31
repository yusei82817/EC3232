(() => {
  const PASSWORD = "c6Wu@Hb7";
  const LOCK_KEY = "chatgpt-helper-sidebar-unlocked";
  let sidebar = null;

  function findSidebar() {
    const candidates = [
      document.querySelector('[data-testid="sidebar"]'),
      document.querySelector('aside'),
      document.querySelector('nav[aria-label*="サイドバー"]'),
      document.querySelector('nav[aria-label*="sidebar" i]')
    ];
    return candidates.find(Boolean) || null;
  }

  function hideSidebar() {
    sidebar = findSidebar();
    if (sidebar) sidebar.classList.add("chatgpt-helper-locked-sidebar");
  }

  function createLockScreen() {
    if (document.getElementById("chatgpt-helper-lock")) return;

    const lock = document.createElement("div");
    lock.id = "chatgpt-helper-lock";
    lock.innerHTML = `
      <div class="chatgpt-helper-lock-box">
        <div class="chatgpt-helper-lock-title">🔒 サイドメニューはロックされています</div>
        <input id="chatgpt-helper-password" type="password" placeholder="パスワード" autocomplete="off">
        <button id="chatgpt-helper-unlock">解除</button>
        <div id="chatgpt-helper-error"></div>
      </div>
    `;
    document.body.appendChild(lock);

    const input = lock.querySelector("#chatgpt-helper-password");
    const unlock = lock.querySelector("#chatgpt-helper-unlock");
    const error = lock.querySelector("#chatgpt-helper-error");

    function tryUnlock() {
      if (input.value === PASSWORD) {
        sessionStorage.setItem(LOCK_KEY, "true");
        if (sidebar) sidebar.classList.remove("chatgpt-helper-locked-sidebar");
        lock.remove();
      } else {
        error.textContent = "パスワードが違います。";
        input.value = "";
        input.focus();
      }
    }

    unlock.addEventListener("click", tryUnlock);
    input.addEventListener("keydown", event => {
      if (event.key === "Enter") tryUnlock();
    });
    input.focus();
  }

  function initialize() {
    if (sessionStorage.getItem(LOCK_KEY) === "true") return;
    hideSidebar();
    createLockScreen();
  }

  initialize();

  const observer = new MutationObserver(() => {
    if (sessionStorage.getItem(LOCK_KEY) === "true") return;
    if (!sidebar || !document.contains(sidebar)) hideSidebar();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
