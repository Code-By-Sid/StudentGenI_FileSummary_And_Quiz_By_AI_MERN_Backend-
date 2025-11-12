import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    title :{
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }   
})

const File = new mongoose.model('File', fileSchema);

export default File;

