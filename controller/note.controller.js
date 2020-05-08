const { Note } = require("../models/Note");
const { validateNoteInput } = require("../validation/notes");
class NoteController {
    constructor() { }

    //breeder create notes
    async create(req,res){
      const { errors, isValid } = validateNoteInput(req.body);
      // Check validation
      if (!isValid) {
        return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
      }
        const {animalId,empId,note,date}=req.body
        console.log(req.body)
        try {      
            const notes= await new Note({animalId,empId,note,userId:req.user._id,date})
            const doc=await notes.save()
            //await Note.updateOne({ _id: doc._id }, { $set : { animalId: ["5eb110b3480eee32c2c368b2","5eb110a9480eee32c2c368b1"] }})

            return res.status(200).json({ status: 200, message: "Note of animal created successfully", data: doc });
        } catch (err) {
            return res.json({ status: 400, message: "Error in creating Note of animal", errors: err, data: {} });
        }
    }

///admin
    async getall(req, res) {
      try {
        const notes= await Note.find({});
        return res.status(200).json({ status: 200, message: "All Note ",data: notes});
      } catch (err) {
        return res.json({ status: 400, message: "Error in get Note ", errors: err, data: {} });
      }
    }

    async deleteall(req,res){
      try {
          const notes= await Note.deleteMany({});
          return res.status(200).json({ status: 200, message: "All Notes deleted successfully",data: notes});
      } catch (err) {
          return res.json({ status: 400, message: "Error in deleting Note", errors: err, data: {} });
      }
  }



    async getallbreeder(req, res) {
        try {
          const notes= await Note.find({userId:req.user._id});
          return res.status(200).json({ status: 200, message: "All Note ",data: notes});
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Note ", errors: err, data: {} });
        }
      }

      async deleteallbreeder(req,res){
        try {
            const notes= await Note.deleteMany({userId:req.user._id});
            return res.status(200).json({ status: 200, message: "All Notes deleted successfully",data: notes});
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Note", errors: err, data: {} });
        }
    }



    async getbyId(req, res){
        try {
          const notes= await Note.find({_id:req.params.id});
          if(notes== ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "Note",data: notes});
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Note", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const notes= await Note.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "Note deleted successfully",data: notes});
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Note", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){
        //const {name,active}=req.body
    
        try {
            const notes = await Note.updateOne({_id:req.params.id},req.body);
    
            return res.status(200).json({ status: 200, message: "Note updated successfully",data: notes });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating Note", errors: err, data: {} });
        }
    }
    
};

module.exports = new NoteController();