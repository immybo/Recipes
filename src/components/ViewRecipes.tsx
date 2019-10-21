import React from 'react';
import {
  View,
  Text,
  Button
} from 'react-native';
import { connect } from 'react-redux';
import { Recipe } from '../model/Recipe';
import { AppState } from '../reducers/Reducers';
import RecipeComponent from './shared/RecipeComponent';
import { withNavigation } from 'react-navigation';

interface ViewRecipesProps extends React.Props<ViewRecipes> {
  recipes: Recipe[]
}

const mapStateToProps = (state: AppState) => 
{
  return {
    recipes: state.recipes.recipes
  };
}

class ViewRecipes extends React.Component<ViewRecipesProps, any> {
  constructor(props: ViewRecipesProps) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <View>
        { this.getRecipeList() }
        <Button title="Add Recipe" onPress={ (event: any) => this.props.navigation.navigate("AddRecipe") }>Add Recipe</Button>
      </View>
    );
  }

  private getRecipeList(): JSX.Element[] {
    return this.props.recipes.map((recipe, key) => <RecipeComponent key={key} recipe={recipe} />);
  }
}

export default withNavigation(connect(mapStateToProps)(ViewRecipes));
