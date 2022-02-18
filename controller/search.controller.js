const { Animal } = require("../models/Animal/Animal");
const { Product } = require("../models/Product");
const { User } = require("../models/User");

class SearchController {
  constructor() {}

  async globalSearch(req, res, next) {
    const { type } = req.query;
    let animal, charity, charityMap,
    animalMap,
      business,
      businessMap,
      individual,
      individualMap,
      productMap,
      all,
      (product = []);

    try {
      const regex = new RegExp(req.params.name);
      if (type == "animal") {
        animal = await Animal.find({
          "data.name": { $regex: req.params.name, $options: "i" },
        });
        animalMap = animal.map((x) => {
          x.data["name"], x._id;
          return {
            name: x.data["name"],
            id: x._id,
            breederId: x.breederId,
          };
        });

        if (!animal) {
          return res.json({
            status: 404,
            message: "Animal Not Found",
            data: {},
          });
        }
        return res.status(200).json({
          status: 200,
          message: "Animal Found",
          data: animalMap,
        });
      }

      if (type == "business") {
        business = await User.find({
          $and: [
            {
              //    name: regex
              name: { $regex: req.params.name, $options: "i" },
            },
            { accountType: "Business" },
          ],
        });
        businessMap = business.map((x) => {
          x.name, x._id;
          return {
            name: x.name,
            id: x._id,
          };
        });
        if (!business) {
          return res.json({
            status: 404,
            message: "Business Profile Not Found",
            data: {},
          });
        }
        return res.status(200).json({
          status: 200,
          message: "Business Profile Found",
          data: business,
        });
      }

      if (type == "individual") {
        individual = await User.find({
          $and: [
            {
              //    name: regex
              name: { $regex: req.params.name, $options: "i" },
            },
            { packageType: "Individual" },
          ],
        });
        individualMap = individual.map((x) => {
          x.name, x._id;
          return {
            name: x.name,
            id: x._id,
          };
        });
        if (!individual) {
          return res.json({
            status: 404,
            message: "Individual Profile Not Found",
            data: {},
          });
        }
        return res.status(200).json({
          status: 200,
          message: "Individual Profile Found",
          data: individual,
        });
      }

      if (type == "charity") {
        charity = await User.find({
          $and: [
            {
              //    name: regex
              name: { $regex: req.params.name, $options: "i" },
            },
            { packageType: "Charity Organization" },
          ],
        });
        charityMap = charity.map((x) => {
          x.name, x._id;
          return {
            name: x.name,
            id: x._id,
          };
        });
        if (!charity) {
          return res.json({
            status: 404,
            message: "Charity Organization Profile Not Found",
            data: {},
          });
        }
        return res.status(200).json({
          status: 200,
          message: "Charity Organization Profile Found",
          data: charity,
        });
      }

      if (type == "product") {
        product = await Product.find({
          // "data.name": regex
          "data.name": { $regex: req.params.name, $options: "i" },
        });

        productMap = product.map((x) => {
          x.data["name"], x._id;
          return {
            name: x.data["name"],
            id: x._id,
            breederId: x.breederId,
          };
        });
        if (!product) {
          return res.json({
            status: 404,
            message: "Product Not Found",
            data: {},
          });
        }
        return res.status(200).json({
          status: 200,
          message: "Product Found",
          data: productMap,
        });
      }

      if (type == "all") {
        animal = await Animal.find({
          isPrivate: false,
          "data.name": { $regex: req.params.name, $options: "i" },
        });

        animalMap = animal.map((x) => {
          console.log("x", x);
          x.data["name"], x._id;
          x.breederId;
          return {
            name: x.data["name"],
            id: x._id,
            type: "Animal",
            breederId: x.breederId,
          };
        });
        console.log("animalMap", animalMap);

        product = await Product.find({
          "data.name": { $regex: req.params.name, $options: "i" },
        });
        console.log("product", product);
        productMap = product.map((x) => {
          x.data["name"], x._id, x.breederId;
          return {
            name: x.data["name"],
            id: x._id,
            type: "Product",
            breederId: x.breederId,
          };
        });
        console.log("productMap", productMap);
        business = await User.find({
          $and: [
            {
              //   name: regex
              name: { $regex: req.params.name, $options: "i" },
            },
            { accountType: "Business" },
          ],
        });
        console.log("business", business);

        businessMap = business.map((x) => {
          x.name, x._id;
          return {
            name: x.name,
            id: x._id,
            type: "Business",
          };
        });
        individual = await User.find({
          $and: [
            {
              //   name: regex
              name: { $regex: req.params.name, $options: "i" },
            },
            { packageType: "Individual" },
          ],
        });
        console.log("individual", individual);
        individualMap = individual.map((x) => {
          x.name, x._id;
          return {
            name: x.name,
            id: x._id,
            type: "Pet Lover",
          };
        });
        // console.log("individualMap", individualMap);

        all = [].concat.apply(
          [],
          [animalMap, productMap, businessMap, individualMap, charityMap]
        );
        console.log(all);
      }
      return res.status(200).json({
        status: 200,
        message: "Search Found",
        data: all,
      });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }
}

module.exports = new SearchController();
