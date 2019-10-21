import React from 'react';
import {
  View,
  TextInput,
  Button
} from 'react-native';
import { connect } from 'react-redux';
import { AppState } from '../reducers/Reducers';
import { Ingredient, getBlankIngredient } from '../model/Ingredient';
import IngredientInput from './shared/IngredientInput';
import { Recipe } from '../model/Recipe';
import { addRecipe } from '../actions/RecipeActions';
import { withNavigation } from 'react-navigation';

interface AddRecipeState {
  recipeName: string,
  recipeDescription: string,
  ingredients: Ingredient[]
}

const mapStateToProps = (state: AppState) => 
{
  return {};
}

const mapDispatchToProps = {
  addRecipe
};

class AddRecipe extends React.Component<React.Props<AddRecipe>, AddRecipeState> {
  constructor(props: any) {
    super(props);

    this.state = {
      recipeName: "",
      recipeDescription: "",
      ingredients: []
    };
  }

  public render(): JSX.Element {
    return (
      <View>
        <TextInput placeholder="Recipe Name" onChangeText={(text) => this.onRecipeNameChange(text)} />
        <TextInput placeholder="Recipe Description" onChangeText={(text) => this.onRecipeDescriptionChange(text)} />
        { this.getIngredientInputList() }
        <Button title="Add Ingredient" onPress={(event) => this.addNewIngredient()}>Add Ingredient</Button>
        <Button title="Submit Recipe" onPress={(event) => this.submitRecipe()}>Submit Recipe</Button>
      </View>
    );
  }

  private getIngredientInputList(): JSX.Element[] {
    return this.state.ingredients.map((ingredient: Ingredient, key: number) => <IngredientInput ingredient={ingredient} key={key} onChangeIngredient={(newIngredient) => this.onChangeIngredient(newIngredient, key)} />);
  }

  private addNewIngredient(): void {
    this.setState({ingredients: this.state.ingredients.concat(getBlankIngredient())});
  }

  private onRecipeNameChange(newName: string): void {
    this.setState({recipeName: newName});
  }

  private onRecipeDescriptionChange(newDescription: string) {
    this.setState({recipeDescription: newDescription});
  }

  private onChangeIngredient(ingredient: Ingredient, index: number) {
    this.setState({ingredients: [...this.state.ingredients.slice(0, index), ingredient, ...this.state.ingredients.slice(index+1)]});
  }

  private submitRecipe(): void {
    let recipe: Recipe = this.buildRecipe();
    this.props.addRecipe(recipe);
    this.props.navigation.navigate("ViewRecipes");
  }

  private buildRecipe(): Recipe {
    return {
      name: this.state.recipeName,
      description: this.state.recipeDescription,
      ingredients: this.state.ingredients.filter((ingredient: Ingredient) => this.isValidIngredient(ingredient))
    };
  }

  private isValidIngredient(ingredient: Ingredient): boolean {
    return ingredient.name != null && ingredient.name.length > 0;
  }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(AddRecipe));
