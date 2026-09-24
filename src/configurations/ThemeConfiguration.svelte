<script>
  import { onDestroy } from "svelte";
  import {
    cssTextStorage,
    setCssTextStorage,
    applyCssString,
    generateCss,
  } from "../core/theme.js";
  import cssStyles from "../core/cssStyles";
  import MonacoCssEditor from './MonacoCssEditor.svelte';

  let cssText = cssTextStorage || generateCss(cssStyles) || "";
  let monacoEditor;
  let open = true;

  // sanitize helper
  function sanitize(text) {
    return text.replace(/:\s*'([^']*)'/g, ": $1");
  }

  function handleCssTextChange(text) {
    cssText = text;
    const sanitized = sanitize(cssText);
    applyCssString(sanitized);
    setCssTextStorage(sanitized);
  }

  function regenerate() {
    const parsed = generateCss(cssStyles);
    cssText = parsed;
    if (monacoEditor && monacoEditor.setValue) monacoEditor.setValue(parsed);
    applyCssString(parsed);
    setCssTextStorage(parsed);
  }

  function saveToStylesObject() {
    const sanitized = sanitize(cssText);
    setCssTextStorage(sanitized);
  }

  // when panel opens, force editor layout to avoid sizing glitches
  $: if (open && monacoEditor && monacoEditor.layout) {
    setTimeout(() => {
      try {
        monacoEditor.layout();
      } catch (e) {}
    }, 80);
  }
</script>

  <button id="open-theme-button" on:click={() => (open = !open)}>{open ? 'Close Theme' : 'Theme'}</button>

  <div class="theme-configuration" class:closed={!open}>
    <div class="theme-content">
      <div class="styles-editor">
        <div class="editor-header">
          <strong>Theme Styles (CSS)</strong>
          <div style="display:flex;gap:8px;align-items:center"></div>
        </div>
        <div class="css-editor-container">
          <MonacoCssEditor bind:this={monacoEditor} value={cssText} on:input={(e) => handleCssTextChange(e.detail)} />
        </div>

        <div class="actions">
          <button on:click={regenerate}>Re-generate from object</button>
          <button on:click={saveToStylesObject}>Save Current CSS To Styles Object</button>
        </div>
      </div>
    </div>
  </div>

<style>
  #open-theme-button {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1101;
    padding: 10px 15px;
    background-color: var(--secondary-color);
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .theme-configuration {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 30vw;
    overflow: hidden;

    padding: 20px;
    background-color: var(--background-color, #c9c9c9);
    z-index: 1100;

    /* use transform for smooth slide-in/out */
    transform: translateX(0);
    transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
    display: flex;
    flex-direction: column;
  }

  .theme-configuration.closed {
    transform: translateX(100%);
  }

  .theme-content {
    overflow: hidden;
    flex: 1 1 auto;
    padding-right: 6px;
  }
  .styles-editor {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    min-height: 0;
    height: 80vh;
  }

  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
  }

  .css-editor-container {
    flex: 1 1 auto;
    min-height: 60vh;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
  }


  #open-theme-button {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1101;
    padding: 8px 10px;
    background-color: var(--secondary-color);
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
    position: sticky;
    bottom: 0;
    background: linear-gradient(
      rgba(201, 201, 201, 0),
      rgba(201, 201, 201, 0.6)
    );
    padding: 6px 0;
  }


</style>
