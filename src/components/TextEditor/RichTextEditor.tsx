import { FC, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';

import './RichTextEditor.css';
import 'react-quill/dist/quill.snow.css';

import { Box } from '@mui/material';
import COLORS from '../../utils/Theme/colors';

interface IProps {
	value: string;
	onChange?: (value: string) => void;
	readonly?: boolean;
	placeholder?: string;
	height?: number | string;
	border?: string;
}

const RichTextEditor: FC<IProps> = (props) => {
	const { value, onChange, readonly, placeholder, height = '100%' } = props;
	const editorRef = useRef(null);

	// Custom toolbar options
	const toolbarOptions = [
		[{ header: [1, 2, 3, false] }],
		[{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
		['bold', 'italic', 'underline', 'strike', 'code'],
		[{ color: [] }],
		['link'],
		['blockquote'],
		['clean'],
	];

	useEffect(() => {
		const toolbar = document.querySelector('.ql-toolbar');

		if (toolbar) {
			const buttonMap = {
				'ql-bold': 'Bold',
				'ql-italic': 'Italic',
				'ql-underline': 'Underline',
				'ql-strike': 'Strikethrough',
				'ql-code': 'Code Block',
				'ql-header': 'Header',
				'ql-list': 'List',
				'ql-color': 'Text Color',
				'ql-link': 'Link',
				'ql-image': 'Image',
				'ql-blockquote': 'Blockquote',
				'ql-clean': 'Clear Formatting',
			};

			// Set tooltips for all buttons
			Object.keys(buttonMap).forEach((className) => {
				const buttons = toolbar.querySelectorAll(`.${className}`);
				buttons.forEach((button) => {
					button.removeAttribute('title');
					button.setAttribute('data-tooltip', buttonMap[className]);
				});
			});

			// Handle the color picker element specifically
			const colorPicker = toolbar.querySelector('.ql-color .ql-picker-label');
			if (colorPicker) {
				colorPicker.removeAttribute('title');
				colorPicker.setAttribute('data-tooltip', 'Text Color');
			}
		}
	}, []);

	return (
		<Box
			sx={{
				'& .MuiOutlinedInput-notchedOutline': {
					borderRadius: '0px',
				},
				'& input:valid:focus + fieldset': {
					borderColor: COLORS.buttonColor,
				},
				'& label.Mui-focused': {
					color: COLORS.buttonColor,
				},
				'& .MuiOutlinedInput-root': {
					'&:hover .MuiOutlinedInput-notchedOutline': {
						borderColor: COLORS.buttonColor,
					},
					'&:hover fieldset': {
						borderColor: COLORS.buttonColor,
					},
					'&.Mui-focused fieldset': {
						borderColor: COLORS.buttonColor,
					},
				},
				'&:hover': {
					'& .MuiOutlinedInput-notchedOutline': {
						borderColor: COLORS.buttonColor,
					},
				},
				'& .MuiOutlinedInput-input': {
					'&:focus': {
						borderColor: COLORS.buttonColor,
					},
				},
				border: `1px solid transparent`, // Default border is transparent
				borderRadius: '4px', // Optional: add border radius to Box
				padding: '8px', // Optional: add padding to Box
			}}
		>
			<ReactQuill
				ref={editorRef}
				modules={{ toolbar: toolbarOptions }}
				theme="snow"
				onChange={onChange}
				value={value}
				readOnly={readonly}
				placeholder={placeholder}
				style={{ height: height, zIndex: 1300 }}
			/>
			<style>{`
        /* Remove Quill's default tooltips */
        .ql-toolbar .ql-formats button[data-tooltip],
        .ql-toolbar .ql-formats .ql-picker-label[data-tooltip] {
          position: relative;
        }

        /* Custom Tooltip styling */
        .ql-toolbar .ql-formats button[data-tooltip]:hover::after,
        .ql-toolbar .ql-formats .ql-picker-label[data-tooltip]:hover::after {
          content: attr(data-tooltip);
          position: absolute;
          background-color: black;
          color: #83ebe5;
          padding: 4px 8px;
          border-radius: 4px;
          bottom: 120%; /* Move tooltip above the icon */
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          z-index: 1;
        }

        .ql-toolbar .ql-formats button[data-tooltip]:hover::before,
        .ql-toolbar .ql-formats .ql-picker-label[data-tooltip]:hover::before {
          content: '';
          position: absolute;
          bottom: 110%; /* Place the triangle above the icon */
          left: 50%;
          transform: translateX(-50%);
          border-width: 4px;
          border-style: solid;
          border-color: black transparent transparent transparent;
          z-index: 1;
        }
      `}</style>
		</Box>
	);
};

export default RichTextEditor;
