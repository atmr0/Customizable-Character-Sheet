<!-- AI generated -->
<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  export let value = '';
  export let language = 'css';
  export let theme = 'vs-light';

  let container;
  let editor;
  const dispatch = createEventDispatcher();

  export function setValue(v) {
    value = v;
    try {
      if (editor && editor.getModel) editor.setValue(v || '');
    } catch (e) {}
  }

  export function layout() {
    try {
      if (editor && editor.layout) editor.layout();
    } catch (e) {}
  }

  function initMonaco() {
    const start = () => {
      const mon = window.monaco;
      if (!mon || !container) return;
      try {
        editor = mon.editor.create(container, {
          value: value || '',
          language,
          automaticLayout: true,
          minimap: { enabled: false },
          theme,
        });
        editor.onDidChangeModelContent(() => {
          const v = editor.getValue();
          value = v;
          dispatch('input', v);
        });
      } catch (err) {
        console.error('Monaco init error', err);
      }
    };

    (async () => {
      try {
        if (!window.require) {
          await new Promise((res, rej) => {
            const s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.34.1/min/vs/loader.js';
            s.onload = res;
            s.onerror = rej;
            document.head.appendChild(s);
          });
        }
        // eslint-disable-next-line no-undef
        require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.34.1/min/vs' } });
        // eslint-disable-next-line no-undef
        require(['vs/editor/editor.main'], () => start());
      } catch (err) {
        console.error('Failed loading Monaco', err);
      }
    })();
  }

  onMount(() => {
    initMonaco();
  });

  onDestroy(() => {
    try {
      if (editor && editor.dispose) editor.dispose();
    } catch (e) {}
  });
</script>

<div class="monaco-shell" bind:this={container} style="height:100%;width:100%"></div>

<style>
  .monaco-shell { min-height: 200px; }
  .monaco-shell .monaco-editor { height: 100% !important; }

</style>
