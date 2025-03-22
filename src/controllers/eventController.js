const Event = require('../models/event');
const mongoose = require('mongoose');

// Create Event
exports.createEvent = async (req, res) => {
  try {
    // Access the authenticated user from the request object
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Allow only admin to create events
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Only admin users can create events.' });
    }
    
    const { name, date, time, location, description, images, building_id } = req.body;

     // Validate the images field is not empty and contains valid URLs
     if (!Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ message: "Images cannot be empty" });
      }
  
      // Validate each image in the array is a non-empty string (URL)
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
  
        // Check if image is an empty string
        if (image.trim() === "") {
          return res.status(400).json({ message: "Image URL cannot be empty" });
        }

      }
  

    // Validate required fields
    if (!name || !date || !time || !location || !description || !images) {
      return res.status(400).json({ message: 'Missing required fields. Please ensure all fields are provided.' });
    }

    // Create event with the user ID of the creator
    const newEvent = new Event({
      name,
      date,
      time,
      location,
      description,
      images,
      building_id: building_id ? new mongoose.Types.ObjectId(building_id) : null,
      created_by: userId // Add the user ID who created the event
    });

    // Save event to the database
    await newEvent.save();

    res.status(201).json({ message: 'Event created successfully!', event: newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while creating the event.', error: error.message });
  }
};

// Get Upcoming Events
exports.getUpcomingEvents = async (req, res) => {
  try {
    // Get current date at the start of the day
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Find all events with date greater than or equal to current date
    const upcomingEvents = await Event.find({ 
      date: { $gte: currentDate } 
    })
    .sort({ date: 1 }) // Sort by date in ascending order (nearest first)
    .populate('created_by', 'firstName lastName email') // Optional: populate user info
    .exec();

    res.status(200).json({  
      count: upcomingEvents.length,
      events: upcomingEvents 
    });
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({  
      message: 'Error fetching upcoming events', 
      error: error.message 
    });
  }
};

// Get Event by ID
exports.getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ 
        
        message: 'Invalid event ID format' 
      });
    }

    // Find event by ID
    const event = await Event.findById(eventId)
      .populate('created_by', 'firstName lastName email')
      .exec();

    // Check if event exists
    if (!event) {
      return res.status(404).json({ 
        
        message: 'Event not found' 
      });
    }

    res.status(200).json({ 
      event 
    });
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching event details', 
      error: error.message 
    });
  }
};

// Update Event
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Validate event ID
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }

    // Find existing event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Allow only admin to update events
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Only admin users can update events.' });
    }

    // Destructure request body
    const { name, date, time, location, description, images, building_id } = req.body;

    // Validate images if provided
    if (images) {
      if (!Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ message: "Images cannot be empty" });
      }
      for (const image of images) {
        if (image.trim() === "") {
          return res.status(400).json({ message: "Image URL cannot be empty" });
        }
      }
    }

    // Update event fields
    event.name = name || event.name;
    event.date = date || event.date;
    event.time = time || event.time;
    event.location = location || event.location;
    event.description = description || event.description;
    event.images = images || event.images;
    event.building_id = building_id ? new mongoose.Types.ObjectId(building_id) : event.building_id;

    // Save updated event
    await event.save();

    res.status(200).json({ message: 'Event updated successfully', event });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};