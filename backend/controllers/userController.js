

import validator from 'validator'
import bcrypt from 'bcryptjs'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import chefModel from "../models/chefModel.js"
import appointmentModel from "../models/appointmentModel.js"
import Razorpay from 'razorpay'


// API to register user
const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        // checking for all data to register user
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to login user
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user profile data
const getProfile = async (req, res) => {

    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
// API to update user profile
const updateProfile = async (req, res) => {

    try {

        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book appointment 
const bookAppointment = async (req, res) => {

    try {

        const { userId, docId, slotDate, slotTime } = req.body
        const docData = await chefModel.findById(docId).select("-password")

        if (!docData.available) {
            return res.json({ success: false, message: 'Chef Not Available' })
        }

        let slots_booked = docData.slots_booked

        // checking for slot availablity 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select("-password")

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in docData
        await chefModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Chef Booked' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {

        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {

        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user 
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing chef slot 
        const { docId, slotDate, slotTime } = appointmentData

        const chefData = await chefModel.findById(docId)

        let slots_booked = chefData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await chefModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Booking Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// API to make payment of appointment using razorpay

console.log("Razorpay Key ID:",process.env.RAZORPAY_KEY_ID);
console.log("Razorpay Key Secret:",process.env.RAZORPAY_KEY_SECRET);


const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const paymentRazorpay = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        console.log("Razorpay Credentials:", process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET);

        const appointmentData = await appointmentModel.findById(appointmentId);
        
        if (!appointmentData || appointmentData.cancelled) {
            return res.status(400).json({ success: false, message: 'Booking Cancelled or not found' });
        }

        const options = {
            amount: appointmentData.amount * 100, // Convert to paisa
            currency: process.env.CURRENCY || "INR",
            receipt: appointmentId
        };

        console.log("Order Options:", options);

        // Create an order
        const order = await razorpayInstance.orders.create(options);
        console.log("Order Created:", order);

        res.json({ success: true, order });

    } catch (error) {
        console.error("Payment Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// API to verify payment of razorpay
// const verifyRazorpay = async (req, res) => {
//     try {
//         const { razorpay_order_id } = req.body
//         const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

//         console.log("razorpay_order_id", razorpay_order_id)
//         console.log(orderInfo)
//         if (orderInfo.status === 'paid') {
//             await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
//             res.json({ success: true, message: "Payment Successful" })
//         }
//         else {
//             res.json({ success: false, message: 'Payment Failed' })
//         }
//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }

const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;
        
        if (!razorpay_order_id) {
            return res.status(400).json({ success: false, message: "Invalid Order ID" });
        }

        // Fetch Order Details from Razorpay Test Mode
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        console.log("Razorpay Order ID:", razorpay_order_id);
        console.log("Fetched Order Info:", orderInfo);

        if (orderInfo.status === "paid") {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            return res.json({ success: true, message: "Payment Successful" });
        } else {
            return res.json({ success: false, message: "Payment Not Completed" });
        }
    } catch (error) {
        console.error("Error Verifying Payment:", error);
        return res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};

export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentRazorpay,verifyRazorpay}
