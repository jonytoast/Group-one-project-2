// imports required packages 
const router = require('express').Router();
const fetch = require('node-fetch');
require('dotenv').config();
const API_KEY = process.env.FDC_API_KEY;
const API_SERVER = 'https://api.nal.usda.gov/fdc';
const SEARCH_ENDPOINT = '/v1/foods/search';
const isVegan = require('is-vegan');
const { Recipe } = require('../../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const withAuth = require('../../utils/auth');

// node-fetch GET request to retriece queried food's nutritional data
router.get('/:name',withAuth, async (req,res) =>{

    try {

        // retrieves all recipes from database that contain the searched keyword
        const query = req.params.name;

        const recipes = await Recipe.findAll({
            where: {
                recipe_text: {
                    [Op.like]: '%' + query + '%'
                }
            }
        }); 

        // formats retrieved recipe data
        const recipeData = recipes.map((recipe)=>
        recipe.get({plain:true}));


        // node-fetch to retrieve the fdcid of queried food
        fetch(`${API_SERVER}${SEARCH_ENDPOINT}?api_key=${API_KEY}&query=${encodeURIComponent(query)}&pageSize=20`)
        .then(res => res.json())
        .then(data=> {

            // if no food is found by API
            if (data.foods.length ===0) {

                // render nutrition page with related recipes
                const noResult = true;
                res.status(404).render('nutrition',{ noResult, query, recipeData });
                return;

            // if serving size or unit of measure is not present in API result
            } else if (!data.foods[0].servingSize || !data.foods[0].servingSizeUnit) {
                
                // render nutrition page with related data
                const noResult = true;
                res.status(404).render('nutrition',{ noResult, query, recipeData });
                return;

            // if API returns sufficient data
            } else {

                // if searched keyword is more than one word
                if (req.params.name.split(" ").length > 1) {

                    // responds without is-vegan warning
                    const servingSize = Math.round(data.foods[0].servingSize);
                    const unit = data.foods[0].servingSizeUnit;
        
                    // filters out nutrient items whose value is 0
                    const nutrients = data.foods[0].foodNutrients;
                    const filteredNutrients = nutrients.filter((nutrient)=>{
                        if (nutrient.value !== 0) {
                            return true;
                        } else {
                            return false
                        }
                    });
    
                    // constructs an object with necessary info to pass to handlebars
                    const result = {
                        foodName: req.params.name.toUpperCase(),
                        servingSize: servingSize,
                        unit: unit,
                        nutrients: filteredNutrients,
                    };
    
                    // returns response and renders nutrition page with ingredient nutritional facts, searched keyword, and related recipe data
                    res.status(200).render('nutrition',{ result, query, recipeData });
                    
                // renders nutrition page with is-vegan result 
                } else {

                    const vegan = isVegan.isVeganIngredient(req.params.name.toLowerCase());

                    let veganWarning;

                    // assigns the warning based on result from is-vegan method
                    if (vegan) {
                        veganWarning = "This ingredient is vegan!"
                    } else {
                        veganWarning = "This ingredient is NOT vegan!"
                    };

                    const servingSize = Math.round(data.foods[0].servingSize);
                    const unit = data.foods[0].servingSizeUnit;
        
                    // filters out unnecessary nutrient items whose value is 0
                    const nutrients = data.foods[0].foodNutrients;
                    const filteredNutrients = nutrients.filter((nutrient)=>{
                        if (nutrient.value !== 0) {
                            return true;
                        } else {
                            return false
                        }
                    });
    
                    // constructs an object of data to pass to handlebars
                    const result = {
                        foodName: req.params.name.toUpperCase(),
                        servingSize: servingSize,
                        unit: unit,
                        nutrients: filteredNutrients,
                        isVegan: veganWarning
                    };
    
                    // returns response and renders nutrition page with nutrition facts, searched keyword, and related recipes
                    res.status(200).render('nutrition',{ result, query, recipeData });
                
                };

            }


        });

    // catches and returns error message
    } catch(err) {
        res.status(500).json({ err: err.message });
    }

});






// exports router
module.exports = router;