# Custom RPG Character Sheet — Theme and Base Component

Arquivos adicionados:

- `src/lib/theme.js` — tokens e helper `themeToCssVars`.
- `src/lib/themeStore.js` — um `writable` store para overrides dinâmicos.
- `src/lib/components/BaseField.svelte` — componente base com `slots`, `props` e re-emissão de eventos.

Exemplo de uso do `BaseField` em um componente `TextField.svelte`:

```svelte
<script>
  import BaseField from '$lib/components/BaseField.svelte';
  let value = '';
</script>

<BaseField>
  <span slot="label">Nome</span>
  <input bind:value on:input />
  <span slot="help">Insira o nome do personagem</span>
</BaseField>
```

Você pode sobrescrever o tema global com `themeStore.set({...})` ou passar um objeto `theme` para o `BaseField`.
