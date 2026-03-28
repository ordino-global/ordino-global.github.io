(function () {
  const loaderScript = document.currentScript;
  const options = {
    rootId: loaderScript && loaderScript.dataset.rootId ? loaderScript.dataset.rootId : "code-playground-root",
    codeUrl: loaderScript && loaderScript.dataset.codeUrl ? loaderScript.dataset.codeUrl : "/reserve-ui-react-example.tsx",
    previewCssUrl: loaderScript && loaderScript.dataset.previewCssUrl ? loaderScript.dataset.previewCssUrl : "",
    editorTitle: loaderScript && loaderScript.dataset.editorTitle ? loaderScript.dataset.editorTitle : "Editor",
    previewTitle: loaderScript && loaderScript.dataset.previewTitle ? loaderScript.dataset.previewTitle : "Live Preview",
    frameTitle: loaderScript && loaderScript.dataset.frameTitle ? loaderScript.dataset.frameTitle : "Code Playground Preview",
    debounceMs: loaderScript && loaderScript.dataset.debounceMs ? Number(loaderScript.dataset.debounceMs) || 250 : 250,
    collapseOnLoad: loaderScript && loaderScript.dataset.collapseOnLoad ? loaderScript.dataset.collapseOnLoad !== "false" : false
  };
  const CODEMIRROR_CSS = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.css";
  const CODEMIRROR_FOLD_CSS = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/fold/foldgutter.min.css";
  const CODEMIRROR_JS = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.js";
  const CODEMIRROR_MODE_XML = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/xml/xml.min.js";
  const CODEMIRROR_MODE_JS = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/javascript/javascript.min.js";
  const CODEMIRROR_MODE_JSX = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/jsx/jsx.min.js";
  const CODEMIRROR_FOLD_CODE = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/fold/foldcode.min.js";
  const CODEMIRROR_FOLD_GUTTER = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/fold/foldgutter.min.js";
  const CODEMIRROR_FOLD_BRACE = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/fold/brace-fold.min.js";
  const CODEMIRROR_FOLD_XML = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/fold/xml-fold.min.js";
  const CODEMIRROR_FOLD_COMMENT = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/fold/comment-fold.min.js";

  function loadStyle(href) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('link[href="' + href + '"]')) {
        resolve();
        return;
      }
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src="' + src + '"]')) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function ensureStyles() {
    if (document.getElementById("code-playground-styles")) {
      return;
    }
    const style = document.createElement("style");
    style.id = "code-playground-styles";
    style.textContent = `
      .code-playground {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-top: 12px;
      }
      .code-playground-panel {
        border: 1px solid #d1d5db;
        border-radius: 8px;
        overflow: hidden;
        background: #fff;
      }
      .code-playground-panel-header-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
        margin: 0;
        padding: 10px 12px;
        border-bottom: 1px solid #e5e7eb;
        background: #f9fafb;
      }
      .code-playground-panel-title {
        margin: 0;
        font-size: 0.95rem;
        font-weight: 600;
      }
      .code-playground-fold-actions {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
      }
      .code-playground-fold-btn {
        margin: 0;
        padding: 4px 10px;
        font-size: 0.8rem;
        font-weight: 500;
        line-height: 1.25;
        color: #374151;
        background: #fff;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        cursor: pointer;
      }
      .code-playground-fold-btn:hover {
        background: #f3f4f6;
        border-color: #9ca3af;
      }
      .code-playground-fold-btn:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }
      .code-playground-preview-frame {
        display: block;
        width: 100%;
        height: 520px;
        border: 0;
        background: #fff;
      }
      .code-playground .CodeMirror {
        height: 520px;
        font-size: 13px;
      }
      @media (max-width: 960px) {
        .code-playground {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function mountPlayground() {
    let root = document.getElementById(options.rootId);
    if (!root) {
      root = document.createElement("div");
      root.id = options.rootId;
      if (loaderScript && loaderScript.parentNode) {
        loaderScript.parentNode.insertBefore(root, loaderScript.nextSibling);
      } else {
        document.body.appendChild(root);
      }
    }
    root.innerHTML = `
      <div class="code-playground">
        <section class="code-playground-panel">
          <div class="code-playground-panel-header-row" role="group" aria-label="Editor toolbar">
            <h3 class="code-playground-panel-title">${options.editorTitle}</h3>
            <div class="code-playground-fold-actions">
              <button type="button" class="code-playground-fold-btn" data-action="collapse-all">Collapse all</button>
              <button type="button" class="code-playground-fold-btn" data-action="expand-all">Expand all</button>
            </div>
          </div>
          <textarea id="${options.rootId}-editor"></textarea>
        </section>
        <section class="code-playground-panel">
          <div class="code-playground-panel-header-row">
            <h3 class="code-playground-panel-title">${options.previewTitle}</h3>
          </div>
          <iframe id="${options.rootId}-preview" class="code-playground-preview-frame" title="${options.frameTitle}"></iframe>
        </section>
      </div>
    `;
    return {
      root: root,
      editorElement: root.querySelector("#" + options.rootId + "-editor"),
      previewFrame: root.querySelector("#" + options.rootId + "-preview")
    };
  }

  function createPreviewDocument(userCode) {
    const escapedCode = JSON.stringify(userCode);
    const previewCssLink = options.previewCssUrl
      ? '<link rel="stylesheet" href="' + options.previewCssUrl + '" />'
      : "";
    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    ${previewCssLink}
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 16px; color: #111827; }
      #error { margin-top: 12px; color: #b91c1c; white-space: pre-wrap; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    </style>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
    <script src="https://unpkg.com/dayjs/dayjs.min.js"><\/script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
  </head>
  <body>
    <div id="root"></div>
    <div id="error"></div>
    <script>
      (function () {
        const errorElement = document.getElementById("error");
        const sourceCode = ${escapedCode};
        function showError(message) {
          errorElement.textContent = message;
        }
        window.addEventListener("error", function (event) {
          showError(event.message || "Runtime error");
        });
        window.addEventListener("unhandledrejection", function (event) {
          const reason = event.reason && event.reason.message ? event.reason.message : String(event.reason);
          showError(reason || "Unhandled promise rejection");
        });
        try {
          const compiled = Babel.transform(sourceCode, { presets: ["react"] }).code;
          Function(compiled)();
        } catch (error) {
          showError(error && error.message ? error.message : String(error));
        }
      })();
    <\/script>
  </body>
</html>`;
  }

  async function init() {
    ensureStyles();
    await loadStyle(CODEMIRROR_CSS);
    await loadStyle(CODEMIRROR_FOLD_CSS);
    await loadScript(CODEMIRROR_JS);
    await loadScript(CODEMIRROR_MODE_XML);
    await loadScript(CODEMIRROR_MODE_JS);
    await loadScript(CODEMIRROR_MODE_JSX);
    await loadScript(CODEMIRROR_FOLD_CODE);
    await loadScript(CODEMIRROR_FOLD_GUTTER);
    await loadScript(CODEMIRROR_FOLD_BRACE);
    await loadScript(CODEMIRROR_FOLD_XML);
    await loadScript(CODEMIRROR_FOLD_COMMENT);

    const mounted = mountPlayground();
    if (!mounted || !mounted.editorElement || !mounted.previewFrame || typeof window.CodeMirror === "undefined") {
      return;
    }

    const editor = window.CodeMirror.fromTextArea(mounted.editorElement, {
      mode: "jsx",
      theme: "default",
      lineNumbers: true,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      foldGutter: true,
      lineWrapping: true,
      tabSize: 2
    });

    function foldAll(editorInstance) {
      if (window.CodeMirror.commands && window.CodeMirror.commands.foldAll) {
        window.CodeMirror.commands.foldAll(editorInstance);
      }
    }

    function unfoldAll(editorInstance) {
      if (window.CodeMirror.commands && window.CodeMirror.commands.unfoldAll) {
        window.CodeMirror.commands.unfoldAll(editorInstance);
      }
    }

    function renderPreview() {
      mounted.previewFrame.srcdoc = createPreviewDocument(editor.getValue());
    }

    let renderTimeout = null;
    editor.on("change", function () {
      clearTimeout(renderTimeout);
      renderTimeout = setTimeout(renderPreview, options.debounceMs);
    });

    const collapseAllBtn = mounted.root.querySelector('[data-action="collapse-all"]');
    const expandAllBtn = mounted.root.querySelector('[data-action="expand-all"]');
    if (collapseAllBtn) {
      collapseAllBtn.addEventListener("click", function () {
        foldAll(editor);
      });
    }
    if (expandAllBtn) {
      expandAllBtn.addEventListener("click", function () {
        unfoldAll(editor);
      });
    }

    try {
      const response = await fetch(options.codeUrl);
      if (!response.ok) {
        throw new Error("Failed to load example code.");
      }
      const source = await response.text();
      editor.setValue(source);
      if (options.collapseOnLoad) {
        foldAll(editor);
      }
    } catch (error) {
      editor.setValue('const rootElement = document.getElementById("root");\nrootElement.textContent = "Unable to load example source.";');
    } finally {
      renderPreview();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
