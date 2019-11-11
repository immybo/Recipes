import React from 'react';
import {
  View,
  Text
} from 'react-native';
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
      <View>
        <Text>{this.props.ingredient.name}</Text>
        <Text>{this.props.ingredient.quantity.quantity.toString()}</Text>
      </View>
    );
  }
}

export default IngredientDisplay;
