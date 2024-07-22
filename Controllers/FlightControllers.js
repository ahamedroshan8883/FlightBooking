const CustomAPIError = require("../ErrorHandler/CustomAPIError");
const FlightsModel = require("../Model/FlightsModel");
const UserModel = require("../Model/UserModel");
const AddFlightDetails = async (req, res, next) => {
    const email = req.params.email;
    try {
      const user = await UserModel.findOne({ email: email });
      if (!user) {
        return next(new CustomAPIError('User not found', 404));
      }
  
      if (user.role !== 'admin') {
        return next(new CustomAPIError('User is not admin', 403));
      }
  
      const flightData = req.body;
      await FlightsModel.create(flightData);
      res.status(200).send('Details added successfully');
    } catch (error) {
      return next(new CustomAPIError(error.message || 'Server Error', 500));
    }
  };
  const getFlightDetails = async (req,res,next)=>{
    
    try{
      const user = await UserModel.findOne({ email: req.params.email });
      if (!user) {
        return next(new CustomAPIError('User not found', 404));
      }
  
      if (user.role !== 'admin') {
        return next(new CustomAPIError('User is not admin', 403));
      }
      const flight = await FlightsModel.findById(req.params._id);
      res.status(302).json({flight});
    }catch(error){
      next(new CustomAPIError(error),404);
    }
  }

  const UpdateFlightDetails = async (req, res, next) => {
    try {
      const user = await UserModel.findOne({ email: req.params.email });
      if (!user) {
        return next(new CustomAPIError('User not found', 404));
      }
  
      if (user.role == 'admin') {
        console.log("Request body:", req.body);
        console.log("Flight ID:", req.params._id);
  
        const Updatedflight = await FlightsModel.findByIdAndUpdate(req.params._id, req.body, { new: true });
        if (Updatedflight) {
          console.log("Updated flight:", Updatedflight);
          return res.status(200).json(Updatedflight);
        } else {
          return next(new CustomAPIError('No flight found', 404));
        }
      } else {
        return next(new CustomAPIError('User is not admin', 403));
      }
    } catch (error) {
      console.error("Error updating flight:", error);
      return next(new CustomAPIError(error.message, 500));
    }
  }
  const deleteFlightDetails = async(req,res,next)=>{
    try {
      const user = await UserModel.findOne({ email: req.params.email });
      if (!user) {
        return next(new CustomAPIError('User not found', 404));
      }
  
      if (user.role == 'admin') {
  
        const Deletedflight = await FlightsModel.findByIdAndDelete(req.params._id, req.body);
        if (Deletedflight) {
          console.log("Deletedflight:", Deletedflight);
          return res.status(200).json(Deletedflight);
        } else {
          return next(new CustomAPIError('No flight found', 404));
        }
      } else {
        return next(new CustomAPIError('User is not admin', 403));
      }
    } catch (error) {
      console.error("Error updating flight:", error);
      return next(new CustomAPIError(error.message, 500));
    }
  }
 module.exports = {AddFlightDetails,getFlightDetails,UpdateFlightDetails,deleteFlightDetails};