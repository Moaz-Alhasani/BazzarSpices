import express, { Application } from 'express'
import adminRouter from '../../features/adminDashborad/router/adminRouter'
import authRouter from '../../features/userauth/router/router'
import User_Auth_Router from '../../features/userGoogleAuth/router/User_Auth_Route'
import ProfileRoute from '../../features/userGoogleAuth/router/profile_router'
import mainrouter from '../../features/homePage/router/homeRouter'


const appRouter=(app:Application)=>{
    app.use('/',mainrouter)
    app.use('/api/v1/admin',adminRouter)
    app.use('/api/v2/auth',authRouter)
    app.use('/auth_google',User_Auth_Router)
    app.use('/profile',ProfileRoute)
}
export default appRouter