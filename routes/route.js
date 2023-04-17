const express = require("express")
const router =  express.Router()


const { createUser ,getUserById ,getAllUsers ,updateUser , deleteUser}  = require("../controllers/controller.js")

const {produce}=require("../creatationKafkaKibana/producer.js")

const {consume} =require("../creatationKafkaKibana/consumer.js")

const{updateConsume} = require("../updateKafkaKibana/consumer.js")
const {updateProduce} = require("../updateKafkaKibana/producer.js")


router.post("/createUser",produce,consume,createUser)
router.get("/getUserById/:userId",getUserById)
router.get("/getAllUsers",getAllUsers)
router.put("/updateUser/:userName",updateUser,updateProduce,updateConsume)
router.delete("/deleteUser/:userName",deleteUser)

module.exports=router