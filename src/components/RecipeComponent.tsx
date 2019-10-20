import React from 'react';
import {
  View,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import { Recipe } from '../model/Recipe';
import { AppState } from '../reducers/Reducers';
import IngredientComponent from './IngredientComponent';

interface RecipeComponentProps {
  recipe: Recipe
}

const mapStateToProps = (state: AppState) => 
{
  return {
  };
}

class RecipeComponent extends React.Component<RecipeComponentProps, any> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
        <View>
            <Text>{this.props.recipe.name}</Text>
            {this.getIngredientList()}
        </View>
    );
  }

  private getIngredientList(): JSX.Element[] {
      return this.props.recipe.ingredients.map(ingredient => <IngredientComponent key={ingredient} ingredient={ingredient} />);
  }
}

export default connect(mapStateToProps)(RecipeComponent);
