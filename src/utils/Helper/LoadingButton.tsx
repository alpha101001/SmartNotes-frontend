import { LoadingButton as Button, LoadingButtonProps } from '@mui/lab';
import { styled } from '@mui/material';
import React, { forwardRef, Ref } from 'react';
import { AnyObject } from 'yup/lib/types';

interface CustomLoadingButtonProps extends LoadingButtonProps {
	isPrimary?: boolean;
	buttonRef?: Ref<HTMLButtonElement>;
	border?: boolean;
}
const Root = styled(({ buttonRef, ...props }: CustomLoadingButtonProps) => (
	<Button ref={buttonRef} {...props} />
))(({ isPrimary, border }: AnyObject) => ({
	cursor: 'pointer',
	padding: '3px 9px !important',
	textTransform: 'capitalize',
	color: isPrimary ? '#FFFFFF' : '#000000', // White for primary, black for default
	border: border ? '1px solid #00ADB5' : '1px solid transparent', // Green border if enabled
	background: isPrimary ? '#00ADB5' : '#E0E0E0', // Green for primary, gray for default
	'&:hover': {
		background: isPrimary ? '#008C9E' : '#C2C2C2', // Darker green for primary hover, darker gray for default hover
	},
	fontSize: '13px',
}));

const LoadingButton = forwardRef<HTMLButtonElement, CustomLoadingButtonProps>((props, ref) => (
	<Root buttonRef={ref} {...props} />
));

export default LoadingButton;
