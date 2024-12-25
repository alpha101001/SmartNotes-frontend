import { toast, ToastOptions, ToastContainer, Flip } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css'; // No need to import, but kept for clarity

// Default Toast Options
const defaultOptions: ToastOptions = {
	position: 'top-right',
	autoClose: 5000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	theme: 'dark',
	transition: Flip,
	ariaLabel: 'Notification',
};

// Custom Hook
const useNotify = () => {
	const successNotify = (message: string, options?: ToastOptions) => {
		toast.success(message, { ...defaultOptions, ...options });
	};

	const errorNotify = (message: string, options?: ToastOptions) => {
		toast.error(message, { ...defaultOptions, ...options });
	};

	const infoNotify = (message: string, options?: ToastOptions) => {
		toast.info(message, { ...defaultOptions, ...options });
	};

	const warningNotify = (message: string, options?: ToastOptions) => {
		toast.warn(message, { ...defaultOptions, ...options });
	};

	const customNotify = (message: string | JSX.Element, options?: ToastOptions) => {
		toast(message, { ...defaultOptions, ...options });
	};

	return {
		successNotify,
		errorNotify,
		infoNotify,
		warningNotify,
		customNotify,
		ToastContainer, // To include once in the app for displaying notifications
	};
};

export default useNotify;
