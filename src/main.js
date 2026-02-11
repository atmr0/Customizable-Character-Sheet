import { mount } from 'svelte';
import App from './App.svelte';
import './styles/base.css';
import './styles/grids.css';
import './styles/attributeComponent.css';

mount(App, { target: document.getElementById('app') });
