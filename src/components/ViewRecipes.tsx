import React from 'react';
import {
  View,
  Text,
  Button
} from 'react-native';
import { connect } from 'react-redux';
import { Recipe } from '../model/Recipe';
import { AppState } from '../reducers/Reducers';
import { withNavigation } from 'react-navigation';
import { RouteAddRecipe, RouteViewIndividualRecipe } from '../Routes';
import { selectRecipe } from '../actions/RecipeActions';
import RecipeCompactDisplay from './shared/RecipeCompactDisplay';

interface ViewRecipesProps extends React.Props<ViewRecipes> {
  recipes: Recipe[]
}

const mapStateToProps = (state: AppState) => 
{
  return {
    recipes: state.recipes.recipes
  };
}

const mapDispatchToProps = {
  selectRecipe
};

class ViewRecipes extends React.Component<ViewRecipesProps, any> {
  constructor(props: ViewRecipesProps) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <View>
        { this.getRecipeList() }
        <Button title="Add Recipe" onPress={ (event: any) => this.props.navigation.navigate(RouteAddRecipe) }>Add Recipe</Button>
      </View>
    );
  }

  private getRecipeList(): JSX.Element[] {
    return this.props.recipes.map((recipe, key) => <RecipeCompactDisplay onClick={(recipe) => this.selectRecipe(recipe)} key={key} recipe={recipe} />);
  }

  private selectRecipe(recipe: Recipe) {
    this.props.selectRecipe(recipe);
    this.props.navigation.navigate(RouteViewIndividualRecipe);
  }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(ViewRecipes));
