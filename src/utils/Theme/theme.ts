import { createTheme } from '@mui/material/styles';
import COLORS from './colors';

const theme = createTheme({
	typography: {
		fontFamily: 'Kurale, serif', // Apply Kurale globally
	},
	palette: {
		background: {
			default: COLORS.backgroundColor, // Set global background color here
		},
	},
});

export default theme;
