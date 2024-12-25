import React, { FormEvent, useState } from 'react';
import { Container, Box, Typography, TextField, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import LoadingButton from '@mui/lab/LoadingButton';
import { textFieldStyles } from '../../utils/Helper/textFieldStyles';
import COLORS from '../../utils/Theme/colors';
import { useResendOTPMutation, useVerifyOTPMutation } from '../../redux-Store/apiSlices/api';
import { useAppSelector } from '../../redux-Store/reduxHooks';
import useNotify from '../../utils/Helper/notify';
import { AnyObject } from 'yup/lib/types';

const OtpConfirmation: React.FC = () => {
	const [otp, setOtp] = useState('');
	const [error, setError] = useState('');
	const [resendLoading, setResendLoading] = useState(false);
	const [countdown, setCountdown] = useState(0);

	const { successNotify, errorNotify } = useNotify();
	const { currentUserEmail } = useAppSelector((state) => state.auth);

	const navigate = useNavigate();
	const [userVerification, { isLoading: verificationLoading, data: verificationData }] =
		useVerifyOTPMutation();

	const [resendCode, { isLoading: resendLoadingCode }] = useResendOTPMutation();
	const handleResendVerificationCode = async () => {
		try {
			const resendResult = await resendCode(currentUserEmail).unwrap(); // Use unwrap() to handle the resolved or rejected response directly;
		} catch (error) {
			// Handle errors
			console.error('Resend Verification Error:', error);
			if ((error as AnyObject).data?.message) {
				errorNotify((error as AnyObject).data.message);
			} else {
				errorNotify('Something went wrong');
			}
		}
		setResendLoading(true);
		setCountdown(60); // Start countdown from 60 seconds

		// Simulate loading state for 1 minute
		const interval = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					setResendLoading(false); // Stop loading after countdown finishes
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	};
	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			// Call the login API with the provided email and password
			const result = await userVerification({
				email: currentUserEmail,
				otp: otp,
			}).unwrap(); // Use unwrap() to handle the resolved or rejected response directly

			// Notify success and handle the response
			if (verificationData.success) {
				successNotify('Email Verification Successful');
			}

			// Access user ID from the backend response
		} catch (error) {
			// Handle errors
			console.error('Login Error:', error);

			if ((error as AnyObject).data?.message) {
				// Notify with the error message from the API response
				errorNotify((error as AnyObject).data.message);
				return;
			} else {
				errorNotify('Login Failed');
				return;
			}
		}

		navigate('/login');
	};
	return (
		<Box sx={{ backgroundColor: COLORS.backgroundColor, width: '100%', height: '100%' }}>
			<Container
				component="main"
				// maxWidth="lg"
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					position: 'absolute',
					top: '50%',
					transform: 'translate(-50%,-50%)',
					left: '50%',
				}}
			>
				<Box
					sx={{
						// marginTop: 15,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						backgroundColor: COLORS.secondaryBackgroundColor,
						borderRadius: '40px',

						boxShadow: `8px 8px 0px 2px ${COLORS.boxShadowColor}`,
					}}
					px={3}
					py={4}
				>
					<Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
						<Typography component="h1" variant="h5" color={COLORS.textColor}>
							Your account is not confirmed! Please Enter the verification code sent
							to your email
						</Typography>
					</Box>

					<Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email"
							name="email"
							autoComplete="email"
							autoFocus
							disabled={currentUserEmail ? true : false}
							type={'email'}
							sx={{
								borderColor: COLORS.borderHoverColor,
								'& .MuiOutlinedInput-notchedOutline': {
									borderColor: COLORS.borderHoverColor, // Green if filled, white if empty
								},
								'&:hover .MuiOutlinedInput-notchedOutline': {
									borderColor: COLORS.borderHoverColor, // Border color on hover
								},
								'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
									borderColor: COLORS.borderHoverColor, // Border color on focus
								},
								'& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
									{
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
								'& .MuiInputBase-input.MuiOutlinedInput-input.Mui-disabled': {
									opacity: 0.7,
									WebkitTextFillColor: COLORS.inputColor, // Use camelCase for CSS property names
								},
							}}
							InputLabelProps={{ style: { color: COLORS.textColor } }}
							value={currentUserEmail}
							// onChange={() => {
							// 	// dispatch(setEmail(e.target.value));
							// }}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							id="code"
							label="Verification code"
							name="code"
							autoFocus
							sx={textFieldStyles()}
							InputLabelProps={{ style: { color: COLORS.textColor } }}
							// value={code}
							onChange={(e) => {
								setOtp(e.target.value);
							}}
						/>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'flex-end',
								gap: 1,
								mt: 2,
							}}
						>
							<LoadingButton
								loading={resendLoadingCode}
								// type="submit"
								fullWidth
								variant="contained"
								// sx={{ mt: 3, mb: 2, gap: 1 }}
								sx={{
									display: 'flex',
									backgroundColor: COLORS.buttonColor,
									fontSize: '16px',
									fontWeight: 'bold',
									paddingX: '40px',
									borderRadius: '40px',
									color: COLORS.textColor,
									'&:hover': {
										backgroundColor: COLORS.buttonColorHover,
										color: COLORS.textHoverColor,
									},
									textTransform: 'capitalize',
									width: '70%',
									height: '5vh',
								}}
								onClick={handleResendVerificationCode}
							>
								{resendLoading
									? `Resend available in ${countdown}s` // Show countdown while loading
									: 'Resend Verification Code'}
							</LoadingButton>

							<LoadingButton
								loading={verificationLoading}
								type="submit"
								fullWidth
								variant="contained"
								// sx={{ mt: 3, mb: 2, gap: 1 }}
								sx={{
									backgroundColor: COLORS.buttonColor,
									fontSize: '18px',
									fontWeight: 'bold',
									paddingX: '40px',
									borderRadius: '40px',
									color: COLORS.textColor,
									'&:hover': {
										backgroundColor: COLORS.buttonColorHover,
										color: COLORS.textHoverColor,
									},
									textTransform: 'capitalize',
									width: '50%',
									height: '5vh',
								}}
								loadingIndicator={
									<CircularProgress
										size={24} // Customize size
										sx={{ color: COLORS.textColor }} // Customize color
									/>
								}
							>
								Confirm
							</LoadingButton>
						</Box>
					</Box>
				</Box>
			</Container>
		</Box>
	);
};

export default OtpConfirmation;
