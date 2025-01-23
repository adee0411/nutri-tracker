import db from "../firebase/firestore_config";
import { collection, getDocs } from "firebase/firestore";

import { Sheet, Stack, Typography } from "@mui/joy";
import { useSelector, useDispatch } from "react-redux";
import { useLoaderData, useParams } from "react-router";

import ContentWrapper from "../UI/ContentWrapper";
import MealNutritionSummary from "../components/MealNutritionSummary";
import SearchForm from "../components/AddFood/SearchForm";
import SelectedIngredient from "../components/AddFood/SelectedIngredient";
import QuickIngredientTab from "../components/AddFood/QuickIngredientTab";
import EditIngredientModal from "../components/IngredientList/EditIngredientModal";
import ConfirmEmptyListModal from "../components/IngredientList/ConfirmEmptyListModal";

import {
  setQueryList,
  setFavoriteIngredients,
  setRecentIngredients,
  setFrequentIngredients,
  setCustomIngredients,
  setIsEditIngredientModalOpen,
} from "../store/ingredientSlice";
import { useEffect } from "react";

const AddFood = () => {
  const dispatch = useDispatch();
  const {
    queryList,
    favoriteIngredients,
    recentIngredients,
    frequentIngredients,
    customIngredients,
  } = useLoaderData();

  const { mealTitle } = useParams();

  const { editableIngredient } = useSelector((state) => state.ingredient);
  const {
    isEditIngredientModalOpen,
    isConfirmEmptyListModalOpen,
    emptyListName,
  } = useSelector((state) => state.ingredient.UI);
  const { actionName, listName } = useSelector(
    (state) => state.ingredient.UI.ingredientAction
  );

  const mergedQueryList = queryList.concat(customIngredients);

  const mealTexts = {
    breakfast: "a reggelihez",
    meal2: "a 2. étkezéshez",
    meal3: "a 3. étkezéshez",
    meal4: "a 4. étkezéshez",
    snack: "a nasihoz",
  };

  // Avoid parallel component rendering
  useEffect(() => {
    dispatch(setQueryList(mergedQueryList));
    dispatch(setFavoriteIngredients(favoriteIngredients));
    dispatch(setRecentIngredients(recentIngredients));
    dispatch(setFrequentIngredients(frequentIngredients));
    dispatch(setCustomIngredients(customIngredients));
    dispatch(setIsEditIngredientModalOpen(false));
  }, []);

  const { selectedIngredient } = useSelector((state) => state.ingredient);

  const currentDate = new Date().toLocaleDateString();

  return (
    <ContentWrapper>
      <Stack gap={4}>
        {/*********** Title ***********/}
        <Stack>
          <Typography textAlign="center" level="h1" fontWeight={300} mb={2}>
            {currentDate}
          </Typography>
          <Typography textAlign="center" level="title-lg">
            Alapanyag hozzáadása {mealTexts[mealTitle]}
          </Typography>
        </Stack>
        {/********** Meal Nutritions ***********/}
        <MealNutritionSummary />
        {/********** Ingredient Search ***********/}
        <Stack>
          <SearchForm />

          {/** Render ingredient details conditionally */}
          {!selectedIngredient ? (
            ""
          ) : (
            <SelectedIngredient selectedIngredient={selectedIngredient} />
          )}
        </Stack>

        <QuickIngredientTab />
      </Stack>

      {isConfirmEmptyListModalOpen ? (
        <ConfirmEmptyListModal listName={emptyListName} />
      ) : (
        ""
      )}
      {isEditIngredientModalOpen ? (
        <EditIngredientModal
          isModalOpen={isEditIngredientModalOpen}
          ingredient={editableIngredient}
          ingredientAction={actionName}
          listName={listName}
        />
      ) : (
        ""
      )}
    </ContentWrapper>
  );
};

export const ingredientLoader = async () => {
  const listMap = {
    queryList: [],
    favoriteIngredients: [],
    recentIngredients: [],
    frequentIngredients: [],
    customIngredients: [],
  };

  const querySnapshot = await getDocs(collection(db, "ingredients"));
  const favoriteIngredientsSnapshot = await getDocs(
    collection(db, "favoriteIngredients")
  );
  const recentIngredientsSnapshot = await getDocs(
    collection(db, "recentIngredients")
  );
  const frequentIngredientsSnapshot = await getDocs(
    collection(db, "frequentIngredients")
  );
  const customIngredientsSnapshot = await getDocs(
    collection(db, "customIngredients")
  );

  querySnapshot.forEach((ingredient) => {
    const ingredientData = { id: ingredient.id, ...ingredient.data() };
    listMap.queryList.push(ingredientData);
  });

  favoriteIngredientsSnapshot.forEach((ingredient) => {
    const ingredientData = { id: ingredient.id, ...ingredient.data() };
    listMap.favoriteIngredients.push(ingredientData);
  });
  recentIngredientsSnapshot.forEach((ingredient) => {
    const ingredientData = { id: ingredient.id, ...ingredient.data() };
    listMap.recentIngredients.push(ingredientData);
  });
  frequentIngredientsSnapshot.forEach((ingredient) => {
    const ingredientData = { id: ingredient.id, ...ingredient.data() };
    listMap.frequentIngredients.push(ingredientData);
  });
  customIngredientsSnapshot.forEach((ingredient) => {
    const ingredientData = { id: ingredient.id, ...ingredient.data() };
    listMap.customIngredients.push(ingredientData);
  });

  return listMap;
};

export default AddFood;
