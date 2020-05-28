const { Relation } = require("../models/Animal/Relation");
const { validateRelationInput } = require("../validation/relation");
class RelationController {
    constructor() { }

    //breeder create relations
    async create(req,res){
      const { errors, isValid } = validateRelationInput(req.body);
      if (!isValid) {
        return res.json({ status: 400, message: "errors present", errors: errors, data: {} });
      }
       
        try {      

            const relations= await new Relation(req.body)
            const doc=await relations.save()
            ////
            if (req.body.relationName == "parent") {
                req.body.relationName="children"
            } 
            else if(req.body.relationName == "children"){
                req.body.relationName="parent"
            }
            else {
                req.body.relationName
            }
            const relationother= await new Relation({otherAnimalId:req.body.animalId,animalId:req.body.otherAnimalId,relationName:req.body.relationName})
            await relationother.save()
            ///
            return res.status(200).json({ status: 200, message: "Relation created successfully", data: doc });
        } catch (err) {
            if(err.code == 11000){
                return res.json({ status: 400, message: "Relation already present", errors: err, data: {} });
            }
            return res.json({ status: 400, message: "Error in creating Relation", errors: err, data: {} });
        }
    }

    async getAll(req, res){
        try {
          const relations= await Relation.find();
          if(relations== ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "Relation",data: relations});
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Relation", errors: err, data: {} });
        }
      }


      async getAllAnimalRelation(req, res){
        try {
          const relations= await Relation.find({animalId:req.params.animalId});
          if(relations== ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "Relation",data: relations});
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Relation", errors: err, data: {} });
        }
      }

    async getbyId(req, res){
        try {
          const relations= await Relation.find({_id:req.params.id});
          if(relations== ''){
            return res.json({ status: 400, message: "Invalid Id",  data: {} }); 
          }
          return res.status(200).json({ status: 200, message: "Relation",data: relations});
        } catch (err) {
          return res.json({ status: 400, message: "Error in get Relation", errors: err, data: {} });
        }
      }

      async deletebyId(req,res){
        try {
            const relations= await Relation.deleteOne({_id:req.params.id});
            return res.status(200).json({ status: 200, message: "Relation deleted successfully",data: relations});
        } catch (err) {
            return res.json({ status: 400, message: "Error in deleting Relation", errors: err, data: {} });
        }
    }

    async updatebyId(req,res){

        try {
            const relations = await Relation.updateOne({_id:req.params.id},req.body,{ runValidators: true });

            const data=await Relation.findOne({_id:req.params.id}).then(result => result)
              ////
              if (req.body.relationName == "parent") {
                req.body.relationName="children"
            } 
            else if(req.body.relationName == "children"){
                req.body.relationName="parent"
            }
            else {
                req.body.relationName="sibling"
            }
            ////
            await Relation.updateOne({animalId:data.otherAnimalId, otherAnimalId:data.animalId},req.body)
            
            return res.status(200).json({ status: 200, message: "Relation updated successfully",data: relations });
        } catch (err) {
            return res.json({ status: 400, message: "Error in updating Relation", errors: err, data: {} });
        }
    }
    
};

module.exports = new RelationController();