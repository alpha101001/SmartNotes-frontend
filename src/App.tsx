import React, { useEffect } from 'react';
import Home from './pages/Home/Home';
import LogIn from './pages/Authentication/LogIn';
import { Route, Routes } from 'react-router-dom';
import SignUp from './pages/Authentication/SignUp';
import ForgotPass from './pages/Authentication/ForgetPassword';
import NavBar from './components/Navbar/NavBar';
import NoteCard from './components/NoteManagement/NoteCard';
import OtpConfirmation from './pages/Authentication/OtpConfirmation';
import { useAppDispatch } from './redux-Store/reduxHooks';
import {
	setCurrentUserEmail,
	setCurrentUserId,
	setCurrentUserName,
	setIsAuthenticated,
	setToken,
} from './redux-Store/componentSlices/authSlice';

// import { Container } from './styles';

const App: React.FC = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		// Load cached auth data
		const token = localStorage.getItem('token');
		const email = localStorage.getItem('currentUserEmail');
		const name = localStorage.getItem('currentUserName');
		const userId = localStorage.getItem('currentUserId');

		if (token && email && name && userId) {
			dispatch(setIsAuthenticated(true));
			dispatch(setToken(token));
			dispatch(setCurrentUserEmail(email));
			dispatch(setCurrentUserName(name));
			dispatch(setCurrentUserId(userId));
		}
	}, [dispatch]);
	return (
		<>
			<NavBar />

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<LogIn />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/forgot-password" element={<ForgotPass />} />
				<Route path="/notes" element={<NoteCard />} />
				<Route path="/verification" element={<OtpConfirmation />} />
				<Route path="/create-note" element={<NoteCard />} />
				<Route path="/update-note" element={<NoteCard />} />
			</Routes>
		</>
	);
};

export default App;
