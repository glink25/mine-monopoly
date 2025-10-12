import path from "path";
import fs from "fs";

export function renameFile(newFileName: string, file: Express.Multer.File, type: string[]) {
	const { originalname, path: _path } = file;

	const fileType = path.parse(originalname).ext;
	if (!fileType || !type.includes(fileType)) {
		return;
	}
	const filePath = newFileName + fileType;

	fs.renameSync(_path, filePath);
	const fileName = newFileName + fileType;
	return { fileName, filePath };
}
