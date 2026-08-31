(() => {
  const PASSWORD = "yuu32323327";
  const LOCK_KEY = "chatgpt-helper-sidebar-unlocked";

  let sidebar = null;
  let observer = null;

  function findSidebar() {
    return document.querySelector(".stage-sidebar-pure-surface");
  }

  function hideSidebar() {
    sidebar = findSidebar();
    if (sidebar) {
      sidebar.style.display = "none";
    }
  }

  function showSidebar() {
    if (!sidebar) sidebar = findSidebar();
    if (sidebar) {
      sidebar.style.display = "";
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
        <button id="chatgpt-helper-unlock" type="button">解除</button>
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
        if (observer) {
          observer.disconnect();
          observer = null;
        }
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

    observer = new MutationObserver(() => {
      if (sessionStorage.getItem(LOCK_KEY) === "true") return;

      const currentSidebar = findSidebar();
      if (currentSidebar) {
        sidebar = currentSidebar;
        currentSidebar.style.display = "none";
      }

      if (!document.getElementById("chatgpt-helper-lock")) {
        createLockScreen();
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  initialize();
})();
