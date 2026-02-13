import { mount } from 'svelte';
import App from './App.svelte';
import './styles/base.css';
import './styles/grids.css';
import './styles/attributeComponent.css';
import './styles/lists.css';
import './styles/imageField.css';
import './styles/checkbox.css';
mount(App, { target: document.getElementById('app') });
