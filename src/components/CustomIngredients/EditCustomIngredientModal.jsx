import {
  Modal,
  ModalDialog,
  ModalClose,
  Typography,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Option,
  Button,
} from "@mui/joy";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setIsEditCustomIngredientModalOpen,
  updateIngredient,
} from "../../store/ingredientSlice";

const EditCustomIngredientModal = ({ isModalOpen, ingredient }) => {
  const dispatch = useDispatch();

  const ingredientNameRef = useRef();
  const unitageRef = useRef();
  const unitRef = useRef();
  const carbRef = useRef();
  const proteinRef = useRef();
  const fatRef = useRef();
  const energyRef = useRef();

  const [unit, setUnit] = useState(ingredient.unit);

  const handleUnitChange = (e, newValue) => {
    setUnit(newValue);
  };

  const handleShowModal = () => {
    dispatch(setIsEditCustomIngredientModalOpen());
  };

  const handleUpdateCustomIngredient = (e) => {
    e.preventDefault();
    const newIngredient = {
      ...ingredient,
      ingredientName: ingredientNameRef,
      unitage: unitageRef,
      unit: unitRef,
      nutritionDataPerUnit: {
        ...ingredient.nutritionDataPerUnit,
        carb: carbRef,
        protein: proteinRef,
        fat: fatRef,
        energy: energyRef,
      },
    };

    dispatch(
      updateIngredient({
        listName: "customIngredients",
        ingredient: newIngredient,
      })
    );
  };
  return (
    <Modal open={isModalOpen} onClose={handleShowModal}>
      <ModalDialog>
        <ModalClose />
        <Typography level="title-lg">Saját alapanyag szerkesztése</Typography>
        <form onSubmit={handleUpdateCustomIngredient}>
          <Stack gap={2} my={4}>
            <FormControl>
              <FormLabel>Alapanyag neve</FormLabel>
              <Input
                slotProps={{
                  input: {
                    ref: ingredientNameRef,
                    style: { width: "100%" },
                  },
                }}
                defaultValue={ingredient.ingredientName}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Mennyiségi egység</FormLabel>
              <Input
                defaultValue={ingredient.unitage}
                type="number"
                slotProps={{
                  input: { ref: unitageRef, style: { width: "100%" } },
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Mértékegység</FormLabel>
              <Select
                value={unit}
                onChange={handleUnitChange}
                sx={{ width: "100%" }}
              >
                <Option value="g" ref={unitRef}>
                  g
                </Option>
                <Option value="ml" ref={unitRef}>
                  ml
                </Option>
                <Option value="db" ref={unitRef}>
                  db
                </Option>
              </Select>
            </FormControl>

            <FormControl sx={{ flex: 1 }}>
              <FormLabel>Szénhidrát</FormLabel>
              <Input
                type="number"
                slotProps={{
                  input: { style: { width: "100%" }, ref: carbRef },
                }}
                endDecorator="g"
                placeholder="0"
              />
            </FormControl>
            <FormControl sx={{ flex: 1 }}>
              <FormLabel>Fehérje</FormLabel>
              <Input
                type="number"
                slotProps={{
                  input: { style: { width: "100%" }, ref: proteinRef },
                }}
                endDecorator="g"
                placeholder="0"
              />
            </FormControl>
            <FormControl sx={{ flex: 1 }}>
              <FormLabel>Zsír</FormLabel>
              <Input
                type="number"
                slotProps={{
                  input: { style: { width: "100%" }, ref: fatRef },
                }}
                endDecorator="g"
                placeholder="0"
              />
            </FormControl>
            <FormControl sx={{ flex: 1 }}>
              <FormLabel>Energia</FormLabel>
              <Input
                type="number"
                slotProps={{
                  input: { style: { width: "100%" }, ref: energyRef },
                }}
                endDecorator="kcal"
                placeholder="0"
              />
            </FormControl>

            <Button type="submit">Módosít</Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
};

export default EditCustomIngredientModal;
