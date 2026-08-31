(() => {
  const PASSWORD = "yuu32323327";
  const LOCK_KEY = "chatgpt-helper-sidebar-unlocked";

  // 拡張機能を読み込むたびにロック状態をリセット
  sessionStorage.removeItem(LOCK_KEY);

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

    if (sidebar) {
      sidebar.classList.add("chatgpt-helper-locked-sidebar");
      sidebar.setAttribute("data-chatgpt-helper-locked", "true");
    }
  }

  function showSidebar() {
    if (!sidebar) sidebar = findSidebar();

    if (sidebar) {
      sidebar.classList.remove("chatgpt-helper-locked-sidebar");
      sidebar.removeAttribute("data-chatgpt-helper-locked");
    }
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
        showSidebar();
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
    hideSidebar();
    createLockScreen();
  }

  initialize();

  // ChatGPTはサイドバーを動的に生成するため、生成後にも再ロックする
  const observer = new MutationObserver(() => {
    if (sessionStorage.getItem(LOCK_KEY) === "true") return;

    hideSidebar();

    if (!document.getElementById("chatgpt-helper-lock")) {
      createLockScreen();
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
