import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
var ingredients = [];
var measures = [];
var ingredientsAndMeasures = [];


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req,res)=>{
  res.render("index.ejs");
});

app.post("/", async (req, res)=>{
  ingredientsAndMeasures = [];
  ingredients = [];
  measures = [];
  try {
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${req.body.category}`, {
      params:{
        apiKey: 1
      }
    });
    const randomMeal = response.data.meals[Math.floor(Math.random() * response.data.meals.length)];
    
    try {
      const meal = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${randomMeal.idMeal}`, {
        params:{
          apiKey:1
        }
      });
      const currentMeal = meal.data;
      // Evaluate the key "meals" into the object from the API 
      currentMeal.meals.forEach((meal) => {

        for (let i = 1; i <= 20; i++) {
          //  Check if the ingredient and measure exists and adding these to the arrays
          if (meal[`strIngredient${i}`] && meal[`strMeasure${i}`]) {
            ingredients.push(meal[`strIngredient${i}`]);
            measures.push(meal[`strMeasure${i}`]);
          }
        }
      // Create an object with this information
      ingredientsAndMeasures.push({ ingredients, measures });
    });
    res.render('index.ejs', { ingredientsList : ingredientsAndMeasures, name : currentMeal.meals[0].strMeal, instructions : currentMeal.meals[0].strInstructions });
    } catch (error) {
      console.error(error.message);
    }
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  } 
}); 

app.listen(port, ()=>{
  console.log(`Listening on port ${port}`);
});