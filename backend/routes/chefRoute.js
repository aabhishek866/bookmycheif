

import express from 'express'
import { 
    changeAvailablity,
    chefList,
    loginchef,
    appointmentComplete,
    appointmentCancel,
    chefDashboard,
    chefProfile,
    updatechefProfile,
    appointmentschef 
} from '../controllers/chefController.js'
import authChef from '../middlewares/authChef.js'

const chefRouter = express.Router()

chefRouter.get('/list',chefList)
chefRouter.post('/login',loginchef)
chefRouter.get('/appointments',authChef,appointmentschef)
chefRouter.post("/complete-appointment", authChef, appointmentComplete)
chefRouter.post("/cancel-appointment", authChef, appointmentCancel)
chefRouter.get("/dashboard", authChef, chefDashboard)
chefRouter.get("/profile", authChef, chefProfile)
chefRouter.post("/update-profile", authChef, updatechefProfile)


export default chefRouter