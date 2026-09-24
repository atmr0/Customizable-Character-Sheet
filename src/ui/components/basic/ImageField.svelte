<!--90% AI Generated. -->

<script lang="ts">
  import { BaseComponent } from "@ui/components/index.js";
  import type { ImageField as ImageFieldType } from "@builder/components";
  import { valuesStore } from "@core/valuesStore";

  export let component: ImageFieldType | undefined = undefined;
  let id: string | undefined = component?.id;
  let label: string | undefined = component?.label;
  let accept: string = component?.accept ?? "image/*";
  let maxSizeBytes: number | undefined = component?.maxSizeBytes;
  let placeholder: string = component?.placeholder ?? "";

  let fileInput: HTMLInputElement | null = null;
  let previewOpen = false;

  $: currentImage = id ? $valuesStore[id] || "" : "";

  function openPicker() {
    fileInput?.click();
  }

  function openPreview() {
    previewOpen = true;
  }

  function closePreview() {
    previewOpen = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    const key = e.key;
    if (key === "Enter" || key === " " || key === "Spacebar") {
      e.preventDefault();
      if (currentImage) openPreview();
    }
  }

  async function handleFile(e: Event) {
    const target = e.target as HTMLInputElement;
    const f = target.files && target.files[0];
    if (!f || !component) return;
    if (maxSizeBytes && f.size > maxSizeBytes) return;
    await component.setFromFile(f);
  }
</script>

<BaseComponent {component}>
  <div
    class="image-wrapper"
    role="button"
    tabindex="0"
    aria-label={label || "Image"}
    on:click={() => (currentImage ? openPreview() : undefined)}
    on:keydown={handleKeydown}
  >
    {#if currentImage}
      <img src={currentImage} alt={label} class="image" />
    {:else}
      <div class="placeholder">{placeholder || "No image"}</div>
    {/if}

    <div class="overlay">
      <button
        type="button"
        class="upload-btn"
        on:click|stopPropagation={openPicker}>Upload</button
      >
    </div>
  </div>

  <input
    bind:this={fileInput}
    type="file"
    {accept}
    class="hidden-input"
    on:change={handleFile}
  />

  {#if previewOpen}
    <div
      class="image-modal"
      aria-label="Image "
    >
      <div class="image-modal-inner" on:click|stopPropagation>
        <img src={currentImage} alt={label} class="zoomed-image" />
        <button class="close-btn" on:click={closePreview} aria-label="Close">Close</button>
      </div>
    </div>
  {/if}
</BaseComponent>
