import { h, render } from 'preact';

import { Game } from './Game';

import './Style.pcss';

const root = document.querySelector('#root')!;
render(h(Game, {}), root);
