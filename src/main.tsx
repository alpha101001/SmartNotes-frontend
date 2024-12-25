import 'global';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './redux-Store/index.ts';
import { BrowserRouter } from 'react-router-dom';

// Import Material UI ThemeProvider
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './utils/Theme/theme.ts';

import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					{/* Reset and normalize styles */}
					<CssBaseline />
					<ToastContainer />
					<App />
				</ThemeProvider>
			</BrowserRouter>
		</Provider>
	</StrictMode>
);
