import jobmodel from '../model/jobmodel.js'
// Create a Job API
export const addJob = async (req, res) => {
  try {
    const userId = req.user._id; // Retrieve the user ID from req.user
    
    const job = new jobmodel({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      company: req.body.company,
      user: userId, // Assign the user ID as the reference to the associated user
      date: new Date(), // Set the date field to the current date and time
      image: {
        data: await fs.promises.readFile("uploads/" + req.file.filename), // Read image file asynchronously
        contentType: req.file.mimetype,
      },
    });

    const savedJob = await job.save();
    res.status(201).json({ message: 'Job created successfully', job: savedJob });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create job' });
  }
};

  
//get jobs by id it used to retieve alljobs posted by one farmer/...
export const getjobsbyuserid = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * pageSize;
   // const endIndex = startIndex + pageSize;
    const searchQuery = req.query.search || '';
    const userId = req.user.id;
     // Assuming you are using an authentication middleware or 
    //function that populates the req.user object with the authenticated user's information, 
    //you can access the user's ID through req.user._id. you can pass these middleware in route folder
   

    const searchOptions = {
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { location: { $regex: searchQuery, $options: 'i' } },
        { company: { $regex: searchQuery, $options: 'i' } },
      ],
      user: userId,
    };

    const totalItems = await jobmodel.countDocuments(searchOptions);
    const jobs = await jobmodel.find(searchOptions)
    .sort({ date: -1 }) // Sort by date field in descending order (-1)
    .skip(startIndex)
    .limit(pageSize)
    .exec();

    res.status(200).json({ message: 'Jobs retrieved successfully', jobs, totalItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve jobs' });
     //in front end
    // fetch('/api/jobs') // Replace with the actual API endpoint URL
    //   .then(response => response.json())
    //   .then(data => {
    //     // Access the jobs array from the JSON response
    //     const receivedJobs = data.jobs;

    //     // Update the state with the received jobs
    //     setJobs(receivedJobs);
  }
};


//get all jobs
export const getjobs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * pageSize;
   // const endIndex = startIndex + pageSize;
    const searchQuery = req.query.search || '';

    const searchOptions = {
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { location: { $regex: searchQuery, $options: 'i' } },
        { company: { $regex: searchQuery, $options: 'i' } },
      ],
    };

    const totalItems = await jobmodel.countDocuments(searchOptions);

    const jobs = await jobmodel.find(searchOptions)
    .sort({ date: -1 }) // Sort by date field in descending order (-1)
    .skip(startIndex)
    .limit(pageSize)
    .exec();

    res.status(200).json({ message: 'Jobs retrieved successfully', jobs, totalItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve jobs' });

        //in front end
    // fetch('/api/jobs') // Replace with the actual API endpoint URL
    //   .then(response => response.json())
    //   .then(data => {
    //     // Access the jobs array from the JSON response
    //     const receivedJobs = data.jobs;

    //     // Update the state with the received jobs
    //     setJobs(receivedJobs);
  
  }
};


/// Update Job API
export const updatejobs = async (req, res, next) => {
  const id = req.params.id;

  try {
    const userId = req.user._id; // Retrieve the user ID from req.user assumming you are using authenticate middleware

    const updatedData = {
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      company: req.body.company,
      user: userId, // Associate the job with the user
      date: new Date(), // Set the date field to the current date and time
    };

    if (req.file) {
      // If an image is uploaded, add the image data to the update data
      updatedData.image = {
        data: await fs.promises.readFile('uploads/' + req.file.filename),
        contentType: req.file.mimetype,
      };
    }

    const updatedJob = await jobmodel.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ message: 'Job updated successfully', job: updatedJob });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update job' });
  }
};



export const deletejobs = async (req, res, next) => {
  const id = req.params.id;

  jobmodel.findByIdAndRemove(id, (err, deletedJob) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete job' });
    }

    if (!deletedJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ message: 'Job deleted successfully' });
  });
};


    
  
     