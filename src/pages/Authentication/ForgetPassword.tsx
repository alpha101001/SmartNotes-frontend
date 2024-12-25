import React, { useEffect, useState } from 'react';
import {
	Box,
	Typography,
	TextField,
	FormControl,
	InputLabel,
	OutlinedInput,
	InputAdornment,
	IconButton,
	CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
// import { Auth } from 'aws-amplify';

// import { ReactComponent as ForgetPassImg } from '../../assets/images/forgetPass.svg';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
// import { useNotify } from '../../utils/Helper/notify';
import LoadingButton from '../../utils/Helper/LoadingButton';
import COLORS from '../../utils/Theme/colors';
import { useAppDispatch, useAppSelector } from '../../redux-Store/reduxHooks';
import {
	useForgotPasswordMutation,
	useResetPasswordMutation,
} from '../../redux-Store/apiSlices/api';
import useNotify from '../../utils/Helper/notify';
import { AnyObject } from 'yup/lib/types';
import { textFieldStyles } from '../../utils/Helper/textFieldStyles';
import { setCurrentUserEmail } from '../../redux-Store/componentSlices/authSlice';

const ForgotPass: React.FC = () => {
	const { successNotify, errorNotify } = useNotify();
	const [resendLoading, setResendLoading] = useState(false);
	const [countdown, setCountdown] = useState(0);
	const dispatch = useAppDispatch();

	const navigate = useNavigate();
	const [codeSent, setCodeSent] = useState(false);

	const [code, setCode] = useState('');
	const [password, setPass] = useState({ value: '', show: false });
	const [confirmPass, setConfirmPass] = useState({
		value: '',
		show: false,
	});
	const [title, setTitle] = useState('Forgot Your Password?');
	const [subTitle, setSubTitle] = useState(
		'Enter the email associated with your account and we’ll send an email with verification code and instructions to reset your password.'
	);
	const { currentUserEmail } = useAppSelector((state) => state.auth);
	const [email, setEmail] = useState<string>(currentUserEmail || '');
	const [loading, setLoading] = useState(false);
	const [forgotPassword, { isLoading: isSendLoading }] = useForgotPasswordMutation();
	const [resetPassword, { isLoading: isResetLoading }] = useResetPasswordMutation();

	const handleVerifyEmail = async () => {
		try {
			const result = await forgotPassword(email).unwrap();
			setCodeSent(true);
			successNotify('Verification code sent! Please check your email');
		} catch (error) {
			errorNotify((error as AnyObject).data.message);
			// errorNotify('Failed! Please try again!');
		}
		dispatch(setCurrentUserEmail(email));
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

	const handlePasswordReset = async () => {
		try {
			const result = await resetPassword({
				email,
				otp: code,
				newPassword: password.value,
			}).unwrap();

			successNotify('Password reset successful! Please login now');
			navigate('/login');
		} catch (error) {
			console.error('Reset Password Error:', error);
			if ((error as AnyObject).data?.message) {
				errorNotify((error as AnyObject).data.message);
			} else {
				errorNotify('Something went wrong');
			}
		}
	};

	const resetPass = (e) => {
		e.preventDefault();

		if (!code) {
			// errorNotify('Please enter verification code');
			return;
		}

		if (password.value !== confirmPass.value) {
			// errorNotify('Passwords do not match');
			return;
		}

		if (password.value.length < 8) {
			// errorNotify('Password must be at least 8 characters');
			return;
		}

		setLoading(true);
		// Auth.forgotPasswordSubmit(email, code, password.value)
		// 	.then(() => {
		// 		setLoading(false);
		// 		successNotify('Password reset successfully! Please login now');
		// 		navigate(`/login`);
		// 	})
		// 	.catch((err) => {
		// 		setLoading(false);
		// 		errorNotify(err.message);
		// 	});
	};
	useEffect(() => {
		if (codeSent) {
			setTitle('Create a New Password');
			setSubTitle('Enter the verification code sent to your email and create a new password');
		} else {
			setTitle('Forgot Your password?');
			setSubTitle(
				'Enter the email associated with your account and we’ll send an email with verification code and instructions to reset your password.'
			);
		}
	}, [codeSent]);

	return (
		<>
			<Box
				height="100%"
				width="100%"
				display="flex"
				alignItems="center"
				justifyContent="center"
				sx={{ marginTop: '-2rem', backgroundColor: COLORS.backgroundColor }}
			>
				<Box textAlign="center" width="30%" marginTop="-3rem">
					{/* <img src={forgetPassImg} alt="forgetPass" />
					 */}
					{/* <ForgetPassImg /> */}
					<Box
						mt={2}
						px={5}
						sx={{
							p: 7,
							backgroundColor: COLORS.secondaryBackgroundColor,
							borderRadius: '40px',
							boxShadow: `8px 8px 0px 2px ${COLORS.boxShadowColor}`,
							// top: '50%',
							transform: codeSent ? 'translate(0%,40%)' : 'translate(0%,70%)',
							// left: '50%',
						}}
					>
						<Typography fontWeight="bold" variant="h4" color={COLORS.textColor}>
							{title}
						</Typography>
						<Typography mt={1} color={COLORS.textColor}>
							{subTitle}
						</Typography>

						{!codeSent ? (
							<Box
								mt={2}
								component={'form'}
								// onSubmit={sendLink}
							>
								<TextField
									fullWidth
									label="Email Address"
									variant="outlined"
									type="email"
									autoComplete="email"
									autoFocus
									value={email}
									onChange={(e) => {
										setEmail(e.target.value);
									}}
									InputLabelProps={{ style: { color: COLORS.textColor } }}
									sx={textFieldStyles()}
								/>
								<LoadingButton
									loading={isSendLoading}
									fullWidth
									variant="contained"
									sx={{
										py: 1,
										mt: 2,
										// mb: 3,
										backgroundColor: COLORS.buttonColor,
										fontSize: '24px',
										fontWeight: 'bold',
										paddingX: '40px',
										borderRadius: '40px',
										color: COLORS.textColor,
										'&:hover': {
											backgroundColor: COLORS.buttonColorHover,
											color: COLORS.textHoverColor,
										},
										textTransform: 'capitalize',
									}}
									onClick={handleVerifyEmail}
									loadingIndicator={
										<CircularProgress
											size={24} // Customize size
											sx={{ color: COLORS.textColor }} // Customize color
										/>
									}
								>
									Send Verification Code
								</LoadingButton>
							</Box>
						) : (
							<Box component="form" onSubmit={resetPass} noValidate sx={{ mt: 1 }}>
								<TextField
									margin="normal"
									required
									fullWidth
									id="code"
									label="Verification Code"
									name="code"
									autoComplete="code"
									value={code}
									onChange={(e) => {
										setCode(e.target.value);
									}}
									InputLabelProps={{ style: { color: COLORS.textColor } }}
									sx={textFieldStyles()}
								/>
								<FormControl margin="normal" fullWidth>
									<InputLabel
										htmlFor="newPass"
										sx={{
											color: COLORS.textColor,
											'&.Mui-focused': {
												color: COLORS.textColor,
											},
										}}
									>
										New Password
									</InputLabel>
									<OutlinedInput
										required
										fullWidth
										name="newPass"
										label="New Password"
										type={password.show ? 'text' : 'password'}
										id="newPass"
										autoComplete="password"
										value={password.value}
										onChange={(e) => {
											setPass({
												...password,
												value: e.target.value,
											});
										}}
										sx={textFieldStyles()}
										endAdornment={
											<InputAdornment position="end">
												<IconButton
													onClick={() =>
														setPass({
															...password,
															show: !password.show,
														})
													}
													aria-label="toggle password visibility"
												>
													{password.show ? (
														<VisibilityOff
															sx={{ color: COLORS.buttonColor }}
														/>
													) : (
														<Visibility
															sx={{ color: COLORS.buttonColor }}
														/>
													)}
												</IconButton>
											</InputAdornment>
										}
									/>
								</FormControl>

								<FormControl margin="normal" fullWidth>
									<InputLabel
										htmlFor="password"
										sx={{
											color: COLORS.textColor,
											'&.Mui-focused': {
												color: COLORS.textColor,
											},
										}}
									>
										Confirm New Password
									</InputLabel>
									<OutlinedInput
										required
										fullWidth
										name="password"
										label="Password"
										type={confirmPass.show ? 'text' : 'password'}
										id="password"
										autoComplete="password"
										value={confirmPass.value}
										onChange={(e) => {
											setConfirmPass({
												...confirmPass,
												value: e.target.value,
											});
										}}
										sx={textFieldStyles()}
										endAdornment={
											<InputAdornment position="end">
												<IconButton
													onClick={() =>
														setConfirmPass({
															...confirmPass,
															show: !confirmPass.show,
														})
													}
													aria-label="toggle password visibility"
												>
													{confirmPass.show ? (
														<VisibilityOff
															sx={{ color: COLORS.buttonColor }}
														/>
													) : (
														<Visibility
															sx={{ color: COLORS.buttonColor }}
														/>
													)}
												</IconButton>
											</InputAdornment>
										}
									/>
								</FormControl>
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
										loading={isSendLoading}
										fullWidth
										variant="contained"
										sx={{
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
											width: '50%',
											height: '5vh',
										}}
										onClick={handleVerifyEmail}
										loadingIndicator={
											<CircularProgress
												size={24} // Customize size
												sx={{ color: COLORS.textColor }} // Customize color
											/>
										}
									>
										{resendLoading
											? `Resend available in ${countdown}s` // Show countdown while loading
											: 'Resend Verification Code'}
									</LoadingButton>
									<LoadingButton
										isPrimary
										loading={isResetLoading}
										// type="submit"
										fullWidth
										variant="contained"
										sx={{
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
											width: '50%',
											height: '5vh',
										}}
										onClick={handlePasswordReset}
										loadingIndicator={
											<CircularProgress
												size={24} // Customize size
												sx={{ color: COLORS.textColor }} // Customize color
											/>
										}
									>
										Reset Password
									</LoadingButton>
								</Box>
							</Box>
						)}
					</Box>
					<Box
						pt={8}
						sx={{
							cursor: 'pointer',
							display: 'flex',
							justifyContent: 'center',
							alignContent: 'center',
							alignItems: 'center',
						}}
					>
						<KeyboardArrowLeftIcon
							sx={{ color: COLORS.textColor }}
							onClick={() => navigate('/login')}
						/>
						<Typography color={COLORS.textColor} onClick={() => navigate('/login')}>
							Back to Login
						</Typography>
					</Box>
				</Box>
			</Box>
		</>
	);
};
export default ForgotPass;
