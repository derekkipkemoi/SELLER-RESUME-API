const axios = require("axios");
const User = require("../models/user");

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_CALLBACK_URL = process.env.PAYSTACK_CALLBACK_URL; // Add this in your .env

exports.createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      company,
      country,
      id: packageId,
      name: packageName,
      price: packagePrice,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !country ||
      !packageId ||
      !packageName ||
      !packagePrice
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided." });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      company,
      country,
      packageId,
      packageName,
      packagePrice,
    });

    await user.save();

    // Convert price string to integer amount in kobo
    const amountInKobo = parseInt(packagePrice.replace(/[^0-9]/g, "")) * 100;

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amountInKobo,
        callback_url: PAYSTACK_CALLBACK_URL, // This line adds the callback URL
        metadata: {
          firstName,
          lastName,
          packageId,
          packageName,
          country,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const authorizationUrl = response.data.data.authorization_url;

    res.status(201).json({
      message: "User created successfully. Proceed to payment.",
      user,
      authorizationUrl,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to create user",
      detail: err.response?.data || err.message,
    });
  }
};

exports.getUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
};
