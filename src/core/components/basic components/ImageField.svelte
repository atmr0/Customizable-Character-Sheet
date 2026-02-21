<script lang="ts">
  import { BaseComponent } from "../componentsIndex.js";

  import { valuesStore, setValue } from "../../valuesStore.js";
  import { Constants } from "../../constants";

  export let id: string | undefined;
  export let label: string | undefined;
  export let accept: string = "image/*";
  export let maxSizeBytes: number | undefined = undefined; // optional max size
  export let placeholder: string = "";
  export let onupload = undefined;
  let componentClass = Constants.ImageField;

  let fileInput: HTMLInputElement | null = null;
  let previewOpen = false;

  // derived image src from store
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

  function handleFile(e: Event) {
    const target = e.target as HTMLInputElement;
    const f = target.files && target.files[0];
    if (!f) return;
    if (maxSizeBytes && f.size > maxSizeBytes) {
      // dispatch("error", { message: "file_too_large", file: f });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (id) setValue(id, dataUrl);
      onupload?.(dataUrl, f);
    };
    reader.readAsDataURL(f);
  }
</script>

<BaseComponent {id} {label} {componentClass}>
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