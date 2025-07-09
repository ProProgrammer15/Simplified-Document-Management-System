const Document = require('../models/Document');

exports.createDocument = async (req, res) => {
    const {title, content} = req.body;
    const owner = req.user._id;

    try {
        if (title && title.length > 255) {
            return res.status(400).json({"error": "Title is required and must be less than 255 characters"});
        }

        if (!content || content.length === 0) {
            return res.status(400).json({"error": "Content is required"});
        }

        const document = new Document({title, content, owner});
        await document.save();
        
        return res.status(201).json({"message": "Document created successfully", "document": document});

    }
    catch (error) {
        return res.status(500).json({"error": "Server error", "details": error.message});
    }
};

exports.getDocuments = async (req, res) => {
    owner = req.user_id;

    try {
        if (req.user.role === 'admin') {
            documents = await Document.find();
        }
        else {
            documents = await Document.find({owner: owner});
        }

        return res.status(200).json({"documents": documents});
    }
    catch (error) {
        return res.status(500).json({"error": "Server error", "details": error.message});
    }
}

exports.getDocumentById = async (req, res) => {
    const {id} = req.params;
    const owner = req.user._id;

    const document = await Document.findById(id);

    try {
        if (document.owner.toString() !== owner.toString() && req.user.role !== 'admin') {
            return res.status(403).json({"error": "Access denied"});
        }

        return res.status(200).json({"document": document});
    }
    catch (error) {
        return res.status(500).json({"error": "Server error", "details": error.message});
    }
}

exports.updateDocument = async (req, res) => {
    const {id} = req.params;
    const owner = req.user._id;
    const {title, content} = req.body;

    const document = await Document.findById(id);

    try {
        if (document.owner.toString() !== owner.toString() && req.user.role !== 'admin') {
            return res.status(403).json({"error": "Access denied"});
        }

        document.title = title || document.title;
        document.content = content || document.content;
        await document.save();

        return res.status(200).json({"message": "Document updated successfully", "document": document});
    }
    catch (error) {
        return res.status(500).json({"error": "Server error", "details": error.message});
    }
}

exports.deleteDocument = async (req, res) => {
    const {id} = req.params;    
    const document = await Document.findById(id);

    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({"error": "Failed to delete document"});
        }

        document.remove();
        return res.status(200).json({"message": "Document deleted successfully"});
    }
    catch (error) {
        return res.status(500).json({"error": "Server error", "details": error.message});
    }
}
