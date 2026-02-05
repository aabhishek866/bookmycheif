

import express from 'express'
import { addchef,adminDashboard,allchefs,appointmentCancel,appointmentsAdmin,loginAdmin } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js';
import { changeAvailablity } from '../controllers/chefController.js';

const adminRouter = express.Router()

adminRouter.post('/add-chef',authAdmin,upload.single('image'),addchef)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-chefs',authAdmin,allchefs)
adminRouter.post('/change-availability',authAdmin,changeAvailablity)
adminRouter.get('/appointments',authAdmin,appointmentsAdmin)
adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel)
adminRouter.get('/dashboard',authAdmin,adminDashboard)

export default adminRouter