import passport from "passport";
import AppError from "../Utils/app.error.js";


const getUserData = async (req, res, next) => {
    try {
        const isAuthenticated = req.isAuthenticated()
        if (!isAuthenticated) {
            return next(new AppError("User not authenticated", 404));
            
        }
            //get the user data from req.user
            const user = req.user
            //if everything is fine
            res.status(200).json({
                success: true,
                message: 'user data retrieve successfully',
                data: user
            });
        
    } catch (error) {
        return next(new AppError("Internal Server Error", 500));
    }
}

const logout= async (req, res, next) => {
 
   req.logout()
    res.redirect('http://localhost:5500'); 

}

export {getUserData, logout}