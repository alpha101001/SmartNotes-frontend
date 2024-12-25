export interface FileAttachment {
	fileName: string;
	fileUrl: string;
	fileType: string;
}

export interface Note {
	_id?: string;
	title: string;
	content: string;
	isPinned?: boolean; // we’ll treat as optional
	files?: FileAttachment[]; // embedded file array
	userId: string;
	pin?: boolean; // optional
}
