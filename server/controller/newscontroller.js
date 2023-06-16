import fs from 'fs';
import newsmodel from '../model/newsmodel.js';

// Add a new News record:
export const addnews = async (req, res, next) => {
  const { category, title, description } = req.body;
  const userId = req.user._id; // Assuming your authentication middleware attaches the user ID to req.user._id

  try {
    const news = new newsmodel({
      category,
      title,
      description,
      image: {
        data: fs.readFileSync("uploads/" + req.file.filename),
        contentType: req.file.mimetype,
      },
      user: userId, // Add the user ID to the news article
    });

    const savedNews = await news.save();
    res.status(201).json({ message: 'News created successfully', news: savedNews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
    // Call the error handling middleware
    next(err);
  }
};

// Retrieve all News records:
export const getnews = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const filter = req.query.filter || ""; // by category
    const startDate = req.query.startDate || "";
    const endDate = req.query.endDate || "";

    // Construct the query object
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (filter) {
      query.category = filter;
    }
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      query.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.date = { $lte: new Date(endDate) };
    }

    const news = await newsmodel.find(query);
    res.status(200).json({ message: 'News retrieved successfully', news });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
    // Call the error handling middleware
    next(err);
  }
};

// Retrieve News records by user ID:
export const getnewsbyuserid = async (req, res, next) => {
  const userId = req.user._id; // Assuming your authentication middleware attaches the user ID to req.user._id

  try {
    const search = req.query.search || "";
    const filter = req.query.filter || ""; // by category
    const startDate = req.query.startDate || "";
    const endDate = req.query.endDate || "";

    // Construct the query object
    const query = { user: userId };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (filter) {
      query.category = filter;
    }
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      query.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.date = { $lte: new Date(endDate) };
    }

    const news = await newsmodel.find(query);
    res.status(200).json({ message: 'News retrieved successfully', news });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
    // Call the error handling middleware
    next(err);
  }
};

// Update a News record by ID:
export const updatenews = async (req, res) => {
  const { id } = req.params;
  const { category, title, description } = req.body;
  const userId = req.user._id; // Assuming your authentication middleware attaches the user ID to req.user._id

  try {
    const updatedNews = await newsmodel.findByIdAndUpdate(
      id,
      {
        category,
        title,
        description,
        image: {
          data: fs.readFileSync("uploads/" + req.file.filename),
          contentType: req.file.mimetype,
        },
        user: userId, // Add the user ID to the news article
      },
      { new: true }
    );
    if (!updatedNews) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.status(200).json({ message: 'News updated successfully', news: updatedNews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete News record by ID:
export const deletenews = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNews = await newsmodel.findByIdAndDelete(id);
    if (!deletedNews) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json({ message: 'News deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
