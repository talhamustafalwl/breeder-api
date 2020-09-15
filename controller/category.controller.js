const { Category } = require("../models/Animal/Category");
const { restart } = require("nodemon");
const { imageURL, baseImageURL } = require("../config/dev");
class CategoryController {
  constructor() { }

  //only admin
  async create(req, res) {
    const { name, active, parentId, type, icon } = req.body
    console.log(name);
    if (!name) {
      return res.json({ status: 400, message: "Name is required",errors:{name:"Name is required"}, data: {} });
    }
    try {
      const animal = await new Category({ name, active, type, icon });
      const doc = await animal.save()
      return res.status(200).json({ status: 200, message: "Category of animal created successfully", data: doc });
    } catch (err) {
      return res.json({ status: 400, message: "Error in creating Category of animal", errors: err, data: {} });
    }
  }


  async getall(req, res) {
    try {
      console.log('getting categories');
      const category = await Category.find(req.query.type ?  {type: req.query.type} : {}).populate('parentId');
      return res.status(200).json({ status: 200, message: "All Categories", data: category.map(e => ({...e.toObject(), ...{icon: `${baseImageURL}form/${e.toObject().icon}`}})) });
    } catch (err) {
      return res.json({ status: 400, message: "Error in get Categories", errors: err, data: {} });
    }
  }

  async deleteall(req, res) {
    try {
      const category = await Category.deleteMany({});
      return res.status(200).json({ status: 200, message: "All Categories deleted successfully", data: category });
    } catch (err) {
      return res.json({ status: 400, message: "Error in deleting Category", errors: err, data: {} });
    }
  }



  async getbyId(req, res) {
    try {
      const category = await Category.find({ _id: req.params.id });
      if (category == '') {
        return res.json({ status: 400, message: "Invalid Id", data: {} });
      }
      return res.status(200).json({ status: 200, message: "Category", data: category });
    } catch (err) {
      return res.json({ status: 400, message: "Error in get Category", errors: err, data: {} });
    }
  }

  async deletebyId(req, res) {
    try {
      const category = await Category.deleteOne({ _id: req.params.id });
      return res.status(200).json({ status: 200, message: "Category deleted successfully", data: category });
    } catch (err) {
      return res.json({ status: 400, message: "Error in deleting Category", errors: err, data: {} });
    }
  }

  async updatebyId(req, res) {
    const { name, active } = req.body
    if (!name) {
      return res.json({ status: 400, message: "name required", data: {} });
    }
    try {
      const category = await Category.updateOne({ _id: req.params.id }, { name, active });

      return res.status(200).json({ status: 200, message: "Category updated successfully", data: category });
    } catch (err) {
      return res.json({ status: 400, message: "Error in updating Category", errors: err, data: {} });
    }
  }

  async getCategoryByIdAndFindParent(_id) {
    return await Category.find().then(res => {
      console.log('filter category');
      return res.filter(e=> (e.parentId==_id))[0] ? {error: true, message: 'This is parent category'} : res;
    }).then(res => {
      if(res.error) return res;
     
      return res.filter(e => (e._id==_id))[0] ? {error: false, message: ''} : {error: true, message: 'Category is not available'} 
    });
  }

};

module.exports = new CategoryController();