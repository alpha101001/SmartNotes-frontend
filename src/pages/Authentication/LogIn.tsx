import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
// import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import { Link, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';
import {
	CircularProgress,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import COLORS from '../../utils/Theme/colors';
import { textFieldStyles } from '../../utils/Helper/textFieldStyles';
import { useLoginUserMutation } from '../../redux-Store/apiSlices/api';
import { AnyObject } from 'yup/lib/types';
import useNotify from '../../utils/Helper/notify';
import { useAppDispatch } from '../../redux-Store/reduxHooks';
import {
	setCurrentUserEmail,
	setCurrentUserName,
	setCurrentUserId,
	setToken,
	setIsAuthenticated,
} from '../../redux-Store/componentSlices/authSlice';

const LogIn: React.FC = () => {
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const { control, handleSubmit, setValue, watch } = useForm({
		defaultValues: {
			email: '',
			password: '',
			rememberMe: false,
		},
	});
	const [userLogIn] = useLoginUserMutation();

	const { successNotify, errorNotify } = useNotify();

	const emailValue = watch('email'); // Watch the email field

	useEffect(() => {
		if (!emailValue) {
			setValue('password', ''); // Clear password value
		}
	}, [emailValue, setValue]);
	const onSubmit = async (data) => {
		dispatch(setCurrentUserEmail(data.email));
		try {
			// Call the login API with the provided email and password
			const res = await userLogIn({
				email: data.email,
				password: data.password,
			}).unwrap();

			// Cache data in Redux and localStorage
			dispatch(setCurrentUserName(res?.user?.name));
			dispatch(setCurrentUserId(res?.user?._id));
			dispatch(setToken(res?.token));
			dispatch(setIsAuthenticated(true)); // Mark as authenticated

			// Notify success
			successNotify('Login Successful');
		} catch (error) {
			// Handle errors
			console.error('Login Error:', error);
			errorNotify((error as AnyObject).data?.message || 'Login Failed');
			return;
		}

		navigate('/');
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
					<Typography component="h2" variant="h5" mt={2} color={COLORS.textColor}>
						Welcome to Smart Notes
					</Typography>

					<Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
						{/* Email Field */}
						<Controller
							name="email"
							control={control}
							rules={{
								required: 'Email is required',
								pattern: {
									value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
									message: 'Enter a valid email address',
								},
							}}
							render={({ field: { value, ...field }, fieldState: { error } }) => {
								return (
									<TextField
										{...field}
										value={value}
										margin="normal"
										required
										fullWidth
										label="Email Address"
										type="email"
										autoFocus
										autoComplete="email"
										error={!!error}
										helperText={error ? error.message : ''}
										InputLabelProps={{ style: { color: COLORS.textColor } }}
										sx={textFieldStyles()}
									/>
								);
							}}
						/>

						{/* Password Field */}
						<Controller
							name="password"
							control={control}
							rules={{ required: 'Password is required' }}
							render={({ field: { value, ...field }, fieldState: { error } }) => {
								return (
									<FormControl margin="normal" fullWidth variant="outlined">
										<InputLabel
											htmlFor="password"
											sx={{
												color: COLORS.textColor,
												'&.Mui-focused': {
													color: COLORS.textColor,
												},
											}}
										>
											Password
										</InputLabel>
										<OutlinedInput
											{...field}
											value={value}
											type={showPassword ? 'text' : 'password'}
											label="Password"
											autoComplete="password"
											error={!!error}
											// inputProps={{ style: { color: COLORS.textColor } }}
											// disabled={!emailValue}
											sx={textFieldStyles(emailValue)}
											endAdornment={
												<InputAdornment position="end">
													<IconButton
														onClick={() =>
															setShowPassword((prev) => !prev)
														}
														edge="end"
													>
														{showPassword ? (
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
										<Typography variant="caption" color="error">
											{error?.message}
										</Typography>
									</FormControl>
								);
							}}
						/>

						{/* Remember Me */}
						<Controller
							name="rememberMe"
							control={control}
							render={({ field }) => (
								<FormControlLabel
									control={
										<Checkbox
											{...field}
											sx={{
												color: COLORS.checkBoxColor,
												'&.Mui-checked': {
													color: COLORS.checkBoxCheckedColor,
												},
											}}
										/>
									}
									sx={{ color: COLORS.textColor }}
									label="Remember me"
								/>
							)}
						/>

						{/* Log In Button */}
						<LoadingButton
							type="submit"
							fullWidth
							variant="contained"
							sx={{
								py: 1,
								mt: 2,
								mb: 3,
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
							onClick={handleSubmit(onSubmit)} // Added onClick event
							loadingIndicator={
								<CircularProgress
									size={24} // Customize size
									sx={{ color: COLORS.textColor }} // Customize color
								/>
							}
						>
							Log In
						</LoadingButton>

						{/* Links */}
						<Box display="flex" justifyContent="space-between" alignItems="center">
							<Link
								to="/forgot-password"
								style={{ color: COLORS.textColor, textDecoration: 'none' }}
							>
								Forgot password?
							</Link>
							<Link
								to="/signup"
								style={{ color: COLORS.textColor, textDecoration: 'none' }}
							>
								Don't have an account?
							</Link>
						</Box>
					</Box>
				</Box>
			</Container>
		</Box>
	);
};

export default LogIn;
