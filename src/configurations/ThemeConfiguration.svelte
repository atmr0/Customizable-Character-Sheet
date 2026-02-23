<script>
  import { componentsMap } from "../core/Scripts/ComponentsMap";
  import { cssVariables, applyTheme } from "../core/theme.js";
  let componentTypes = componentsMap;

  function handleInput(type, variable, value) {
    cssVariables[type][variable] = value;
    applyTheme();
  }

  function formatName(name, removePrefix) {
    if (!name) return "";
    if (removePrefix) name = name.replace(/^--\w+-/, ""); // remove leading -- and type prefix
    let result = name
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return result;
  }

  function toggleThemeConfig() {
    const configPanel = document.querySelector(".theme-configuration");
    if (configPanel) {
      configPanel.classList.toggle("hidden-menu");
    }
  }
</script>

<button id="open-theme-button" on:click={toggleThemeConfig}>Theme</button>

<div class="theme-configuration">
  <h2>Theme Configuration</h2>
  <p>
    Here you can customize the theme of your character sheet. Adjust colors,
    fonts, and other styles to make it your own!
  </p>

  <!-- Add form inputs or controls for theme customization here -->
  {#each Object.keys(cssVariables) as type}
    <div class="theme-section hidden-menu">
      <details>
        <summary>{formatName(type)}</summary>

        {#each Object.keys(cssVariables[type]) as variable}
          <div class="theme-variable">
            <label for={variable}>{type == "general" ? formatName(variable, false) :  formatName(type, true) }</label>
            <input
              type={variable.includes("color") ? "color" : "text"}
              id={variable}
              name={variable}
              value={cssVariables[type][variable]}
              on:input={(e) => handleInput(type, variable, e.target.value)}
            />
          </div>
        {/each}
      </details>
    </div>
  {/each}
</div>

<style>
  #open-theme-button {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 11;
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
    overflow-y: auto;

    padding: 20px;
    background-color: var(--background-color, #c9c9c9);
    z-index: 10;

    transition: right 0.6s cubic-bezier(0.704, 0.004, 0.312, 0.997);
  }
  .theme-section {
    margin-bottom: 20px;
    border: 1px solid var(--border-color, #ccc);
  }

  .hidden-menu {
    right: -50vw;
  }

  .theme-variable {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0.5rem 0.8rem;
  }

  .theme-variable input {
    text-align: right;
    max-width: 50%;
    border-radius: 6px;
    border: 1px solid var(--border-color, #ccc);
  }

  .theme-section summary {
    font-weight: bold;
    cursor: pointer;
    padding: 10px;
    background-color: var(--section-header-bg, #e0e0e0);
  }


</style>
