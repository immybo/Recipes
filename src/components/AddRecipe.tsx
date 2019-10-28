import React from 'react';
import {
  View,
  TextInput,
  Button,
  TouchableHighlight
} from 'react-native';
import { connect } from 'react-redux';
import { AppState } from '../reducers/Reducers';
import { Ingredient, getBlankIngredient } from '../model/Ingredient';
import IngredientInput from './shared/IngredientInput';
import { Recipe } from '../model/Recipe';
import { addRecipe } from '../actions/RecipeActions';
import { withNavigation } from 'react-navigation';
import { RouteViewRecipes } from '../Routes';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Category } from '../model/Category';
import { styles } from '../style/AddRecipe';

interface AddRecipeState {
  recipeName: string,
  recipeDescription: string,
  ingredients: Ingredient[],
  categories: Category[]
}

const mapStateToProps = (state: AppState) => 
{
  return {};
}

const mapDispatchToProps = {
  addRecipe
};

class AddRecipe extends React.Component<any, AddRecipeState> {
  constructor(props: any) {
    super(props);

    this.state = {
      recipeName: "",
      recipeDescription: "",
      ingredients: [],
      categories: []
    };
  }

  public render(): JSX.Element {
    return (
      <View>
        <TextInput placeholder="Recipe Name" onChangeText={(text) => this.onRecipeNameChange(text)} />
        <TextInput placeholder="Recipe Description" onChangeText={(text) => this.onRecipeDescriptionChange(text)} />
        { this.getIngredientInputList() }
        <TouchableHighlight onPress={(event) => this.addNewIngredient()}>
          <View style={styles.rightButton}>
            <Icon name="plus" size={30} color="black" />
          </View>
        </TouchableHighlight>
        { this.getCategoryList() }
        <TouchableHighlight onPress={(event) => this.addNewCategory()}>
          <View style={styles.rightButton}>
            <Icon name="plus" size={30} color="black" />
          </View>
        </TouchableHighlight>
        <Button title="Submit Recipe" onPress={(event) => this.submitRecipe()}>Submit Recipe</Button>
      </View>
    );
  }

  private getIngredientInputList(): JSX.Element[] {
    return this.state.ingredients.map(
      (ingredient: Ingredient, key: number) => <IngredientInput ingredient={ingredient} key={"ingredient-"+key} onChangeIngredient={(newIngredient) => this.onChangeIngredient(newIngredient, key)} />
    );
  }

  private getCategoryList(): JSX.Element[] {
    return this.state.categories.map(
      (category: Category, key: number) => <TextInput placeholder="Category Name" key={"category-"+key} onChangeText={(text) => this.onCategoryTextChange(text, key)} />
    );
  }

  private addNewIngredient(): void {
    this.setState({ingredients: this.state.ingredients.concat(getBlankIngredient())});
  }

  private addNewCategory(): void {
    this.setState({categories: this.state.categories.concat({name: ""})});
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

  private onCategoryTextChange(newText: string, index: number) {
    this.setState({categories: [...this.state.categories.slice(0, index), {name: newText}, ...this.state.categories.slice(index+1)]});
  }

  private submitRecipe(): void {
    let recipe: Recipe = this.buildRecipe();
    this.props.addRecipe(recipe);
    this.props.navigation.navigate(RouteViewRecipes);
  }

  private buildRecipe(): Recipe {
    return {
      name: this.state.recipeName,
      description: this.state.recipeDescription,
      ingredients: this.state.ingredients.filter((ingredient: Ingredient) => this.isValidIngredient(ingredient)),
      categories: this.state.categories
    };
  }

  private isValidIngredient(ingredient: Ingredient): boolean {
    return ingredient.name != null && ingredient.name.length > 0;
  }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(AddRecipe));
