const fs = require('fs');
const path = require('path');

const uploadFile = (file, uploadDir) => {
    return new Promise((resolve, reject) => {
        if(!file) {
            return reject({ msg: "New File not found" });
        }
        const maxSize = 10 * 1024 * 1024;
        if(file.size > maxSize) {
            return reject({ msg: "File size exceeds 10MB limit." });
        }

        const allowedExtensions = 
            [
                '.png', '.jpg', '.jpeg', '.gif', '.webp', 
                '.txt', '.docx', '.pdf', '.zip', '.rar',
                '.mp4', '.mov', '.wmv',
                '.xls', '.xlsx', '.csv'
            ];
        const allowedMimeTypes = 
            [
                'image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp',
                'application/txt', 'application/docx', 'application/pdf',
                'application/zip', 'application/x-rar-compressed',
                'video/mp4', 'video/mov', 'video/wmv',
                'application/vnd.ms-excel', // .xls (Excel 97-2003)
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx (Excel 2007+)
                'text/csv'
            ];
        const fileExtension = path.extname(file.name).toLowerCase();
        if (!allowedExtensions.includes(fileExtension) || !allowedMimeTypes.includes(file.mimetype)) {
            return reject({ msg: "Invalid file type." });
        }

        const fileName = Date.now() + path.extname(file.name);
        const uploadPath = path.join(uploadDir, fileName);
        
        file.mv(uploadPath, (err) => {
            if (err) {
                return reject({ msg: "File upload failed", error: err });
            }
        });
        resolve(fileName);
    });
};

const updateFile = (new_file, old_file, updateDir, default_file) => {
    return new Promise((resolve, reject) => {
        if(!new_file) {
            return reject({ msg: "New File not found" });
        }
        const maxSize = 10 * 1024 * 1024;
        if(new_file.size > maxSize) {
            return reject({ msg: "File size exceeds 10MB limit." });
        }

        const allowedExtensions = 
            [
                '.png', '.jpg', '.jpeg', '.gif', '.webp', 
                '.txt', '.docx', '.pdf', '.zip', '.rar',
                '.mp4', '.mov', '.wmv',
                '.xls', '.xlsx', '.csv'
            ];
        const allowedMimeTypes = 
            [
                'image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp',
                'application/txt', 'application/docx', 'application/pdf',
                'application/zip', 'application/x-rar-compressed',
                'video/mp4', 'video/mov', 'video/wmv',
                'application/vnd.ms-excel', // .xls (Excel 97-2003)
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx (Excel 2007+)
                'text/csv'
            ];
        const fileExtension = path.extname(new_file.name).toLowerCase();
        if (!allowedExtensions.includes(fileExtension) || !allowedMimeTypes.includes(new_file.mimetype)) {
            return reject({ msg: "Invalid file type." });
        }

        const fileName = Date.now() + path.extname(new_file.name);
        const updatePath = path.join(updateDir, fileName);
        
        new_file.mv(updatePath, (err) => {
            if (err) {
                return reject({ msg: "File upload failed", error: err });
            }
            if (old_file != default_file){
                fs.unlinkSync(updateDir + old_file);
            }
        });
        resolve(fileName);
    });
};

const deleteFile = (file, deleteDir, default_file) => {
    if(file != default_file){
        fs.unlinkSync(deleteDir + file);
    }
}

const updateImageFile = (new_file, old_file, updateDir, default_file) => {
    return new Promise((resolve, reject) => {
        if(!new_file) {
            return reject({ msg: "New image file not found" });
        }
        const maxSize = 10 * 1024 * 1024;
        if(new_file.size > maxSize) {
            return reject({ msg: "Image file size exceeds 10MB limit." });
        }

        const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
        const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif','image/webp'];
        const fileExtension = path.extname(new_file.name).toLowerCase();
        if (!allowedExtensions.includes(fileExtension) || !allowedMimeTypes.includes(new_file.mimetype)) {
            return reject({ msg: "Invalid image file type." });
        }

        const fileName = Date.now() + path.extname(new_file.name);
        const updatePath = path.join(updateDir, fileName);
        
        new_file.mv(updatePath, (err) => {
            if (err) {
                return reject({ msg: "Image file upload failed", error: err });
            }
            if (old_file != default_file){
                fs.unlinkSync(updateDir + old_file);
            }
        });
        resolve(fileName);
    });
};

module.exports = { 
    uploadFile,
    updateFile,
    updateImageFile,
    deleteFile,
};