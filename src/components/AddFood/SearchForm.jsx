import {
  FormControl,
  Input,
  List,
  ListItem,
  ListItemButton,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import queryList from "../../data/FoodDB";

import {
  setSelectedIngredient,
  setSearchQueryInput,
  setSearchResultList,
  setNewIngredientInput,
} from "../../store/ingredientSlie";

const SearchForm = () => {
  const dispatch = useDispatch();

  const { searchQueryInput } = useSelector((state) => state.ingredient.UI);
  const { searchResultList, selectedIngredient } = useSelector(
    (state) => state.ingredient
  );

  const handleSelectedIngredient = (e) => {
    const ingredientID = e.target.id;
    const ingredient = searchResultList.find(
      (ingredient) => ingredient.id === ingredientID
    );
    dispatch(setSelectedIngredient(ingredient));
    dispatch(setNewIngredientInput(ingredient.unitage));
  };

  const handleQueryInputChange = (e) => {
    dispatch(setSearchQueryInput(e.target.value));
    if (e.target.value === "") setSelectedIngredient("");
  };

  useEffect(() => {
    const resultList =
      searchQueryInput === ""
        ? []
        : queryList.filter(
            (data) =>
              data.ingredientName
                .toLowerCase()
                .includes(searchQueryInput.toLowerCase()) &&
              searchQueryInput.length > 2
          );

    dispatch(setSearchResultList(resultList));
  }, [searchQueryInput]);

  return (
    <>
      <Sheet
        color="primary"
        variant="outlined"
        invertedColors
        sx={{ p: 2, my: 2, borderRadius: "md" }}
      >
        <form>
          <Typography level="title-md">Étel keresése:</Typography>{" "}
          <Stack direction="row" my={1}>
            <FormControl sx={{ flex: 1 }}>
              <Input
                type="search"
                name="ingredient"
                value={searchQueryInput}
                onChange={handleQueryInputChange}
                placeholder="Keresés..."
              ></Input>
            </FormControl>
          </Stack>
        </form>
      </Sheet>

      {searchResultList.length === 0 ? (
        ""
      ) : (
        <>
          <Typography level="title-md">Találatok:</Typography>
          <List
            variant="outlined"
            sx={{
              borderRadius: "md",
              p: 0,
              mt: 1,
              mb: 4,
              overflow: "hidden",
            }}
          >
            {searchResultList.map((result) => {
              return (
                <ListItem key={result.id}>
                  <ListItemButton
                    sx={{
                      borderRadius: 0,
                      fontSize: 12,
                      fontWeight:
                        result.id === selectedIngredient?.id ? 700 : "",
                    }}
                    id={result.id}
                    onClick={handleSelectedIngredient}
                  >
                    {result.ingredientName}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </>
      )}
    </>
  );
};

export default SearchForm;
