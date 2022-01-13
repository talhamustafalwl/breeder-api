const { Product } = require("../models/Product");
const { validateProductInput } = require("../validation/product");
const configKey = require("../config/key");

class ProductController {
  constructor() {}

  async isProductAvailableByCategory(categoryId) {
    return new Promise((resolve, reject) => {
      Product.find({ categoryId }).then((result) => {
        if (result[0]) resolve(true);
        resolve(false);
      });
    });
  }

  async create(req, res, next) {
    console.log("<<===", req.body);
    const { errors, isValid } = validateProductInput(req.body);
    if (!isValid) {
      console.log(errors);
      return res.json({
        status: 400,
        message: "errors present",
        errors: errors,
        data: {},
      });
    }
    const data = JSON.parse(req.body.data);

    // let Images=[];
    // await req.files.map((f)=>{
    //   Images.push(f.filename)
    // })

    //req.body.breederId=req.user.role == "employee" ? req.user.breederId : req.user._id
    req.body.breederId =
      req.user.role == "employee" ? req.user.breederId : req.user._id;
    req.body.addedBy = req.user._id;
    req.body.image = req.file ? req.file.filename : null;
    req.body.data = JSON.parse(req.body.data);
    console.log("data is ===> ", data);
    //delete req.body.data.quantity;
    req.body.quantity = data.quantity;
    req.body.unit_quantity = data.unit_quantity;
    req.body.goodConditionQuantity = data.quantity;
    req.body.status = req.body.quantity > 0 ? "InStock" : "Out of Stock";
    try {
      const products = await new Product(req.body);
      const doc = await products.save();
      return res.status(200).json({
        status: 200,
        message: "Product created successfully",
        data: doc,
      });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in creating Product",
        errors: err,
        data: {},
      });
    }
  }

  async getallbreeder(req, res) {
    console.log(req.user._id);
    const breederId =
      req.user.role == "employee" ? req.user.breederId : req.user._id;
    // const breederId="5f3ba1f7a989412710841d5a"
    try {
      Product.find({ breederId, isArchived: false })
        .sort({ createdAt: -1 })
        .populate("addedBy", "name")
        .then((result) => {
          console.log(result);
          return res.status(200).json({
            status: 200,
            message: "All Products",
            data: result.map((e) => ({
              ...e.toObject(),
              ...{
                image: e.toObject().image
                  ? `${configKey.baseImageURL}${e.toObject().image}`
                  : null,
              },
              ...{
                gallery: e.toObject().gallery.map((eimg) => ({
                  ...eimg,
                  filename: `${configKey.baseImageURL}${eimg.filename}`,
                })),
              },
            })),
          });
        });
    } catch (err) {
      console.log(err);
      return res.json({
        status: 400,
        message: "Error in get Product ",
        errors: err,
        data: {},
      });
    }
  }

  async deleteallbreeder(req, res) {
    const breederId =
      req.user.role == "employee" ? req.user.breederId : req.user._id;
    try {
      const products = await Product.deleteMany({ breederId });
      return res.status(200).json({
        status: 200,
        message: "All Products deleted successfully",
        data: products,
      });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in deleting Product",
        errors: err,
        data: {},
      });
    }
  }

  async uploadGalleryImage(req, res, next) {
    try {
      console.log("uploadGalleryImage", req.files);
      console.log(req.body.id);

      Product.updateOne(
        { _id: req.body.id },
        {
          $push: {
            gallery: {
              $each: req.files.map((file) => ({
                filename: file.filename,
                size: file.size,
                addedBy: req.user._id,
              })),
            },
          },
        }
      )
        .then((animalResult) => {
          return res.status(200).json({
            status: 200,
            message: "Product gallery uploaded successfully",
          });
        })
        .catch((error) => {
          return res.json({
            status: 400,
            message: "Error in upload gallary image record",
            errors: err,
            data: {},
          });
        });
    } catch (error) {
      console.log(error);
      return res.json({
        status: 400,
        message: "Error in upload gallary image record",
        errors: err,
        data: {},
      });
    }
  }

  async getbyId(req, res) {
    try {
      console.log("get product by id");
      const products = await Product.findById(req.params.id);
      if (products == "") {
        return res.json({ status: 400, message: "Invalid Id", data: {} });
      }
      return res.status(200).json({
        status: 200,
        message: "Product",
        data: {
          ...products.toObject(),
          image: products.toObject().image
            ? `${configKey.baseImageURL}${products.toObject().image}`
            : null,

          gallery: products.toObject().gallery
            ? products.toObject().gallery.map((eimg) => ({
                ...eimg,
                filename: `${configKey.baseImageURL}${eimg.filename}`,
              }))
            : [],
        },
      });
    } catch (err) {
      console.log(err);
      return res.json({
        status: 400,
        message: "Error in get Product",
        errors: err,
        data: {},
      });
    }
  }

  async deleteproduct(req, res) {
    try {
      console.log("delete product");

      const data = await Product.findOne({ _id: req.params.id });
      data.isArchived = !data.isArchived;
      data.save().then((result) => {
        return res.status(200).json({
          status: 200,
          message: "Product updated successfully",
          data: result,
        });
      });
    } catch (err) {
      console.log(err);
      return res.json({
        status: 400,
        message: "Error in delete Product",
        errors: err,
        data: {},
      });
    }
  }

  async uploadGalleryImage(req, res, next) {
    try {
      console.log("uploadGalleryImage", req.files);
      console.log(req.body.id);

      Product.updateOne(
        { _id: req.body.id },
        {
          $push: {
            gallery: {
              $each: req.files.map((file) => ({
                filename: file.filename,
                size: file.size,
                addedBy: req.user._id,
              })),
            },
          },
        }
      )
        .then((animalResult) => {
          return res.status(200).json({
            status: 200,
            message: "Product gallery uploaded successfully",
          });
        })
        .catch((error) => {
          return res.json({
            status: 400,
            message: "Error in upload product gallery image record",
            errors: err,
            data: {},
          });
        });
    } catch (error) {
      console.log(err);
      return res.json({
        status: 400,
        message: "Error in uploading images",
        errors: err,
        data: {},
      });
    }
  }

  async deletebyId(req, res) {
    try {
      const products = await Product.deleteOne({ _id: req.params.id });
      return res.status(200).json({
        status: 200,
        message: "Product deleted successfully",
        data: products,
      });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in deleting Product",
        errors: err,
        data: {},
      });
    }
  }

  async updatebyId(req, res, next) {
    console.log("<<===", req.body);
    if (req.file) {
      req.body.image = req.file.filename;
    }
    req.body.data = JSON.parse(req.body.data);
    req.body.quantity = req.body.data.quantity;
    req.body.goodConditionQuantity = req.body.data.quantity;
    try {
      const products = await Product.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );
      return res.status(200).json({
        status: 200,
        message: "Product updated successfully",
        data: products,
      });
    } catch (err) {
      return res.json({
        status: 400,
        message: "Error in updating Product",
        errors: err,
        data: {},
      });
    }
  }

  // For Inventory
  async getProductForInventory(breederId) {
    return new Promise(async (resolve, reject) => {
      await Product.find({ breederId }).then(resolve).catch(reject);
    });
  }

  async updateProductAfterSale(animalArr, buyer, seller) {
    // animalId, price, quantity
    return new Promise((resolve, reject) => {
      async
        .eachSeries(animalArr, function updateObj(obj, done) {
          console.log("Calling each series ... ");
          Product.updateOne(
            { _id: obj.productId },
            {
              $inc: {
                goodConditionQuantity: -obj.quantity,
                soldQuantityPending: obj.quantity,
              },
            }
          )
            .then((resultDone) => {
              console.log(resultDone);
              console.log("This is done condition ... ");
              done();
            })
            .catch((error) => {
              console.log("this is error condition... ");
              console.log(error);
              done();
            });
        })
        .then((alldone) => {
          console.log("all done");
          resolve(true);
        })
        .catch((error) => {
          console.log("Error ");
          console.log(error);
          reject();
        });
    });
  }

  async getbyIdShare(req, res) {
    try {
      console.log("get product by id");
      const products = await Product.findById(req.params.id);
      if (products == "") {
        return res.json({ status: 400, message: "Invalid Id", data: {} });
      }
      return res.status(200).json({
        status: 200,
        message: "Product",
        data: {
          ...products.toObject(),
          image: products.toObject().image
            ? `${configKey.baseImageURL}${products.toObject().image}`
            : null,

          gallery: products.toObject().gallery
            ? products.toObject().gallery.map((eimg) => ({
                ...eimg,
                filename: `${configKey.baseImageURL}${eimg.filename}`,
              }))
            : [],
        },
      });
    } catch (err) {
      console.log(err);
      return res.json({
        status: 400,
        message: "Error in get Product",
        errors: err,
        data: {},
      });
    }
  }
}

module.exports = new ProductController();
