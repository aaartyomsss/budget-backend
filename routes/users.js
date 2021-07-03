const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');
require('dotenv/config');
const nodemailer = require('nodemailer');
const confiramtionUrl = 'http://localhost:3001/api/users/confirmation';

userRouter.get('/', async (req, res) => {
  const users = await User.find({});
  res.json(users.map((user) => user.toJSON()));
});

userRouter.get('/:id', async (req, res) => {
  const user = User.findById(req.params.id);
  res.json(user);
});

//Continue writing code for verification
userRouter.get('/confirmation/:token', async (req, res) => {
  const token = req.params.token;
  const decodedUser = jwt.verify(token, process.env.EMAIL_TOKEN);
  console.log(token, decodedUser);
  if (!decodedUser) {
    return res.status(404).json({ error: 'Something went wrong' });
  }
  const user = await User.findById(decodedUser.id);
  user.confirmed = true;
  try {
    await user.save();
    res.redirect('http://localhost:3000/activated');
  } catch (error) {}
});

// Reseting passord from user options
userRouter.patch('/reset-password', async (req, res) => {
  const body = req.body;
  if (!body.currentPassword || !body.newPassword) {
    return res.status(400).json({ error: 'Please fill all required fields ' });
  }

  const user = await User.findOne({ username: body.username });
  if (!user) {
    return res.status(404).json({ error: 'User was not found' });
  }

  const passwordValidation = await bcrypt.compare(
    body.currentPassword,
    user.passwordHash
  );
  if (!passwordValidation) {
    return res.status(401).json({ error: 'Invalid current password' });
  }

  const newPasswordHash = await bcrypt.hash(
    body.newPassword,
    parseInt(config.SALT_ROUNDS)
  );

  try {
    await User.updateOne(
      { _id: user._id },
      { $set: { passwordHash: newPasswordHash } }
    );
    return res
      .status(200)
      .json({ message: 'Password was successfully changed ' });
  } catch (error) {
    return res.status(400).json({
      error: `Error occured while saving new password ${error.message}`,
    });
  }
});

// Registration
userRouter.post('/', async (req, res) => {
  const body = req.body;
  if (!body.name || !body.username || !body.password || !body.email) {
    return res.status(400).json({ error: 'Please fill all required fields' });
  }
  if (body.password.length < 6) {
    return res.status(400).json({ error: 'password length is less than 6' });
  }
  if (body.username.length < 3) {
    return res.status(400).json({ error: 'password length is less than 3' });
  }

  const passwordHash = await bcrypt.hash(
    body.password,
    parseInt(config.SALT_ROUNDS)
  );

  const user = new User({
    username: body.username,
    name: body.name,
    email: body.email,
    passwordHash,
  });

  const emailToken = jwt.sign(user.toJSON(), config.EMAIL_TOKEN);

  try {
    const savedUser = await user.save();

    // Sending email block of code
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: config.GMAIL_USER,
        pass: config.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: '"Test Budget App" <noreplyconfirmationtest@gmail.com>', // sender address
      to: `${user.email}`, // list of receivers
      subject: 'Confirm your account', // Subject line
      text: `Hi, ${user.name}`, // plain text body
      html: `<p>Thank you for your registration.</p><p>By clicking following link you will activate your account:</p><p><a>${confiramtionUrl}/${emailToken}</a></p>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Email sent: ', info.response);
      }
    });

    res.json(savedUser);
  } catch (error) {
    return res.json({ error: error.message });
  }
});

module.exports = userRouter;
