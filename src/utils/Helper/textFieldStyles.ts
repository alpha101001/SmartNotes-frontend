import COLORS from '../Theme/colors';

export const textFieldStyles = (value?: string | undefined) => ({
	borderColor: COLORS.borderColor,
	'& .MuiOutlinedInput-notchedOutline': {
		borderColor: value ? COLORS.borderColor : `1px solid ${COLORS.borderColor}`, // Green if filled, white if empty
	},
	'&:hover .MuiOutlinedInput-notchedOutline': {
		borderColor: COLORS.borderHoverColor, // Border color on hover
	},
	'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
		borderColor: COLORS.borderHoverColor, // Border color on focus
	},
	'& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
		borderColor: COLORS.borderHoverColor, // Ensure focus color applies properly
	},
	'& input': {
		color: COLORS.inputColor, // Input text color
	},
	'& input:-webkit-autofill': {
		WebkitBoxShadow: '0 0 0 100px #2D2D2D inset !important', // Autofill background color
		WebkitTextFillColor: `${COLORS.inputColor} !important`, // Autofill text color
		transition: 'background-color 5000s ease-in-out 0s', // Smooth transition for autofill
	},
});
