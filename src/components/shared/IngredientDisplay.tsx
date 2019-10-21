import React from 'react';
import {
  View,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import { Recipe } from '../../model/Recipe';
import { AppState } from '../../reducers/Reducers';
import { Ingredient } from '../../model/Ingredient';

interface IngredientDisplayProps {
  ingredient: Ingredient
}

class IngredientDisplay extends React.Component<IngredientDisplayProps, any> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
        <Text>{this.props.ingredient.name}</Text>
    );
  }
}

export default IngredientDisplay;
