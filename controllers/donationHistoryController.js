const Donation = require("../Models/donation");

const getalldonationhistory = async (req, res) => {
  try {
    const donations = await Donation.find()
      .select(
        "FullName ContactNumber category amount createdAt paymentstatus donation"
      )
      .populate("donation");

    res.status(200).json(donations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { getalldonationhistory };
