const Fundraiser = require('../Models/Fundraiser');


exports.createFundraiser = async (req, res) => {
  try {
    const newFundraiser = new Fundraiser(req.body);
    await newFundraiser.save();
    // await sendApprovalEmail(newFundraiser);
    res.status(201).json({ message: 'Fundraiser submitted for approval.' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating fundraiser', error });
  }
};

exports.getAllFundraisers = async (req, res) => {
  const fundraisers = await Fundraiser.find().sort({ createdAt: -1 });
  res.json(fundraisers);
};

exports.approveFundraiser = async (req, res) => {
  await Fundraiser.findByIdAndUpdate(req.params.id, { status: 'approved' });
  res.send('Fundraiser approved');
};

exports.rejectFundraiser = async (req, res) => {
  await Fundraiser.findByIdAndUpdate(req.params.id, { status: 'rejected' });
  res.send('Fundraiser rejected');
};
