const Event = require("../Models/Event");


const createEvent = async (req, res) => {
  try {
    const newEvent = new Event({
      ...req.body,
      image: req.file?.path || "", 
    });

    await newEvent.save();

    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: error.message });
  }
};


const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createEvent, getAllEvents };
