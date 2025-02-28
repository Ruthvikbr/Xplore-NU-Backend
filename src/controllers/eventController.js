const Event = require('../models/event');
const mongoose = require('mongoose');

// Create Event
exports.createEvent = async (req, res) => {
  try {
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

    // Create event
    const newEvent = new Event({
      name,
      date,
      time,
      location,
      description,
      images,
      building_id: building_id ? new mongoose.Types.ObjectId(building_id) : null,
    });

    // Save event to the database
    await newEvent.save();

    res.status(201).json({ message: 'Event created successfully!', event: newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while creating the event.', error: error.message });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const { event_id } = req.params;

    const deletedEvent = await Event.findByIdAndDelete(event_id);

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    res.status(200).json({ message: 'Event deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while deleting the event.', error: error.message });
  }
};
