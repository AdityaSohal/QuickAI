/* This JavaScript code snippet is setting up a file upload configuration using the `multer` middleware
in a Node.js application. Here's a breakdown of what each part of the code is doing: */
import multer from "multer";

/* This part of the code snippet is configuring the storage settings for file uploads using the
`multer` middleware in a Node.js application. Here's a breakdown of what each function inside
`multer.diskStorage` is doing: */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

/**
 * The function `fileFilter` checks if the file is an image or a PDF and calls the callback function
 * accordingly.
 * @param req - The `req` parameter typically represents the request object in a Node.js application.
 * It contains information about the HTTP request made by the client, such as headers, parameters, and
 * body data. In the context of the `fileFilter` function you provided, the `req` parameter is not
 * directly used
 * @param file - The `file` parameter in the `fileFilter` function represents the file that is being
 * uploaded. It typically contains information about the file, such as its name, size, mimetype, and
 * other metadata. This parameter is used to determine whether the file meets certain criteria, such as
 * being an image or
 * @param cb - The `cb` parameter in the `fileFilter` function is a callback function that is used to
 * either accept or reject a file based on its mimetype. It is typically called with two arguments: an
 * error object (if any) as the first argument and a boolean value as the second argument. The
 */
const fileFilter = (req, file, cb) => {
  // Accept images and PDFs
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and PDFs are allowed.'), false);
  }
};

/* This code snippet is exporting a configured instance of the `multer` middleware for handling file
uploads in a Node.js application. The `multer` middleware is configured with the following options: */
export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 
  }
}); 