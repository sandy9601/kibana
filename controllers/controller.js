const { ObjectId } = require('mongodb');
const { dbConnect } = require('../models/model');
const { users } = require('../models/model');
const userClass = users();
const errorMessage = process.env.errorMessage;

// creating User

const createUser = async (req, res) => {
  try {
    const data = req.body;
    const { fullName, userName, mobileNumber, email, password } = data;
    const userData = new userClass(
      fullName,
      userName,
      mobileNumber,
      email,
      password
    );
    const usersdb = await dbConnect();
    const userNameCheck = await usersdb.findOne({ userName: userName }); // want to check  with is Deleted will include or not..?
    if (userNameCheck) {
      return res.status(400).send({
        status: false,
        message: `${userName} is already exist use another one`
      });
    }
    const mobileNumberCheck = await usersdb.findOne({
      mobileNumber: mobileNumber
    }); // want to check  with is Deleted will include or not..?
    if (mobileNumberCheck) {
      return res.status(400).send({
        status: false,
        message: `${mobileNumber} is already exist use another one`
      });
    }
    const eamilCheck = await usersdb.findOne({ email: email }); // want to check  with is Deleted will include or not..?
    if (eamilCheck) {
      return res.status(400).send({
        status: false,
        message: `${email} is already exist use another one`
      });
    }

    const userCreated = await usersdb.insertOne(userData);

    return res.status(201).send({ status: true, data: userCreated });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

// getUser By Id

const getUserById = async (req, res) => {
  try {
    const usersdb = await dbConnect();
    const userDataById = await usersdb.findOne({
      _id: new ObjectId(req.params.userId),
      isDeleted: false
    });
    if (!userDataById) {
      return res.status(404).send({ status: false, message: 'no user found' });
    }
    return res.status(200).send({ status: true, data: userDataById });
  } catch (err) {
    if (err.message == errorMessage) {
      return res.status(400).send({ status: false, error: 'invalild userId' });
    }
    return res.status(500).send({ status: false, error: err.message });
  }
};

// get All users

const getAllUsers = async (req, res) => {
  const usersdb = await dbConnect();
  const page = req.query.page || 0;
  const countPerPage = 2;
  const allUsers = await usersdb
    .aggregate([
      { $match: { isDeleted: false } },
      { $sort: { timeStamp: 1 } },
      { $skip: page * countPerPage },
      { $limit: countPerPage }
    ])
    .toArray();

  if (allUsers.length == 0) {
    return res.status(404).send({ status: false, message: 'no user found' });
  }
  return res.status(200).send({ status: true, data: allUsers });
};

// update user

const updateUser = async (req, res,next) => {
  try {
    const usersdb = await dbConnect();
    const data = req.body;
    //const {userName,mobileNumber,email,fullName,password} = data
    const userNameFromParams = req.params.userName
    if (Object.keys(data).includes('userName')) {
      const userNameCheck = await usersdb.findOne({ userName: data.userName });
      if (userNameCheck) {
        return res.status(400).send({
          status: false,
          message: `${data.userName} is already exist use another one`
        });
      }
    } else if (Object.keys(data).includes('mobileNumber')) {
      const mobileNumberCheck = await usersdb.findOne({
        mobileNumber: data.mobileNumber
      }); 
      if (mobileNumberCheck) {
        return res.status(400).send({
          status: false,
          message: `${data.mobileNumber} is already exist use another one`
        });
      }
    } else if (Object.keys(data).includes('email')) {
      const eamilCheck = await usersdb.findOne({ email: data.email }); 
      if (eamilCheck) {
        return res.status(400).send({
          status: false,
          message: `${data.email} is already exist use another one`
        });
      }
    }
    const updatedData = await usersdb.updateOne({userName:userNameFromParams,isDeleted:false}, { $set: data });
    next()//return res.status(200).send({ status: true, data: updatedData });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};


const deleteUser = async (req,res)=>{
    try{
    const usersdb = await dbConnect()
    const userName = req.params.userName
    const deletedUser = await usersdb.updateOne({userName:userName,isDeleted:false},{$set:{isDeleted:true}})
    if(deletedUser.modifiedCount==1){
        return res.status(200).send({status:false,message:"user deleted"})
    }else{
        return res.status(404).send({status:false,message:"no user found"})
    }
}
catch(err){
    return res.status(500).send({status:false,error:err.message})
}
}




module.exports = { createUser, getUserById, getAllUsers, updateUser , deleteUser};
