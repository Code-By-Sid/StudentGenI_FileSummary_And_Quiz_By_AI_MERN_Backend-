import File from "../model/file.model.js";
import cloudinary from "../config/cloud.js";


export const addFile = async (req, res) => {
  try {
    const { title, description, subject } = req.body;

    if (!title || !description || !subject) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized: user not found in request" });
    }

    let fileUrl = undefined;

    if (req.file) {
      try 
      {
        const base64File = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
        const uploadResult = await cloudinary.uploader.upload(base64File, {folder: "File",resource_type: "auto"});

        fileUrl = uploadResult.secure_url;
      } 
      catch (error) 
      {
        console.error(error);
        return res.status(500).json({ message: "File upload failed"});
      }
    }

    const newFile = await File.create({ title, description, subject, fileUrl, createdBy: req.user._id,});

    res.status(201).json({ success: true, message: "File uploaded successfully", newFile});

  } 
  catch (error) 
  {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllFile = async (req, res) => {
    try {
        const files = await File.find();
        res.status(200).json({success: true, counts: files.length, files});

    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const getFileById = async (req, res) => {
    try {
        
        const {id} = req.params;
        const file = await File.findById(id);

        if(!file){
            return res.status(404).json({
                message: "File not found"
            })
        }
        res.status(200).json({success: true, file});

    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}