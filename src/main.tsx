import ReactDOM from 'react-dom/client';

import './i18n';

import { Providers } from './providers/providers';
import App from './App';

import './assets/styles/global.css';

async function run() {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Providers>
      <App />
    </Providers>,
  );
}

run();
