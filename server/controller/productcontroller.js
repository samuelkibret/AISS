import productmodel from '../model/productmodel.js'
// Create a Job API
export const addproduct = async (req, res) => {
  try {
    const userId = req.user._id; // Retrieve the user ID from req.user
     // Assuming you are using an authentication middleware or 
    //function that populates the req.user object with the authenticated user's information, 
    //you can access the user's ID through req.user._id. you can pass these middleware in route folder
  
    const product = new productmodel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        category: req.body.category,
        user: userId, // Associate the job with the user
        date: new Date(), // Set the date field to the current date and time
        image: {
          data: await fs.promises.readFile("uploads/" + req.file.filename), // Read image file asynchronously
          contentType: req.file.mimetype,
        },
    });

    const savedproduct = await product.save();
    res.status(201).json({ message: ' created successfully', product: savedproduct});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create ' });
  }
};
  
//get jobs by id it used to retieve alljobs posted by one farmer/...
export const getproductbyuserid = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * pageSize;
    //const endIndex = startIndex + pageSize;

    const searchQuery = req.query.search || '';
    const userId = req.user.id;
     // Assuming you are using an authentication middleware or 
    //function that populates the req.user object with the authenticated user's information, 
    //you can access the user's ID through req.user._id. you can pass these middleware in route folder
   

    const searchOptions = {
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { category: { $regex: searchQuery, $options: 'i' } },
        { price: { $regex: searchQuery, $options: 'i' } },
      ],
      user: userId,
    };

    const totalItems = await productmodel.countDocuments(searchOptions);

    const product = await productmodel.find(searchOptions)
    .sort({ date: -1 }) // Sort by date field in descending order (-1)
    .skip(startIndex)
    .limit(pageSize)
    .exec();

    res.status(200).json({ message: ' retrieved successfully', product, totalItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve ' });
  }
};


//get all product
export const getproduct = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * pageSize;
   // const endIndex = startIndex + pageSize;

    const searchQuery = req.query.search || '';

    const searchOptions = {
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { price: { $regex: searchQuery, $options: 'i' } },
        { category: { $regex: searchQuery, $options: 'i' } },
      ],
    };

    const totalItems = await productmodel.countDocuments(searchOptions);

    const product = await productmodel.find(searchOptions)
      .sort({ date: -1 }) // Sort by date field in descending order (-1)
      .skip(startIndex)
      .limit(pageSize)
      .exec();

    res.status(200).json({ message: 'product retrieved successfully', product, totalItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
};


/// Update product API
export const updateproduct = async (req, res, next) => {
  const id = req.params.id;

  try {
    const userId = req.user._id; // Retrieve the user ID from req.user assumming you are using authenticate middleware

    const updatedData = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        category: req.body.category,
        user: userId, // Associate the job with the user
        date: new Date(), // Set the date field to the current date and time
        image: {
          data: await fs.promises.readFile("uploads/" + req.file.filename), // Read image file asynchronously
          contentType: req.file.mimetype,
        },
    }

    const updatedproduct = await productmodel.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedproduct) {
      return res.status(404).json({ error: 'product not found' });
    }

    res.json({ message: 'product updated successfully', product: updatedproduct});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};



export const deleteproduct = async (req, res, next) => {
  const id = req.params.id;

  productmodel.findByIdAndRemove(id, (err, deletedproduct) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete product' });
    }

    if (!deletedproduct) {
      return res.status(404).json({ error: 'product not found' });
    }

    res.json({ message: 'product deleted successfully' });
  });
};


    
  
     