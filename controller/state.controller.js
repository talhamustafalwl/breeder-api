const { State } = require("../models/State");
// Load input validation
class StateController {
    constructor() { }

    //only breeders
    async create(req,res){

        try {      
            const employee = await new State(req.body)
            const doc=await employee.save()
            return res.status(200).json({ status: 200, message: "State  created successfully", data: doc });
        } catch (err) {
            return res.json({ status: 400, message: "Error in creating State ", errors: err, data: {} });
        }
    }


    async getall(req, res) {
        try {
          const state = await State.find({});
          return res.status(200).json({ status: 200, message: "All State", data: state });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get State", errors: err, data: {} });
        }
      }

      async deleteall(req,res){
        try {
            const state = await State.deleteMany({});
            return res.status(200).json({ status: 200, message: "All State deleted successfully", data: state });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting State", errors: err, data: {} });
        }
    }



    async getbyId(req, res){
        try {
          const state = await State.find({_id:req.params.id});
          if(state == ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "State", data: state });
        } catch (err) {
          return res.json({ status: 400, message: "Error in get State", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const state = await State.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "State deleted successfully", data: state });
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting State", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){

        try {
            const state = await State.updateOne({_id:req.params.id},req.body);
    
            return res.status(200).json({ status: 200, message: "State updated successfully", data: state });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating State", errors: err, data: {} });
        }
    }
    
};

module.exports = new StateController();