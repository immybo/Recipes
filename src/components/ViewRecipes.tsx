import React from 'react';
import {
  View,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import { Recipe } from '../model/Recipe';
import { AppState } from '../reducers/Reducers';
import RecipeComponent from './RecipeComponent';

interface ViewRecipesProps {
  recipes: Recipe[]
}

const mapStateToProps = (state: AppState) => 
{
  return {
    recipes: state.recipes.recipes
  };
}

class ViewRecipes extends React.Component<ViewRecipesProps, any> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <View>
        { this.getRecipeList() }
      </View>
    );
  }

  private getRecipeList(): JSX.Element[] {
    return this.props.recipes.map(recipe => <RecipeComponent key={recipe.name} recipe={recipe} />);
  }
}

export default connect(mapStateToProps)(ViewRecipes);
