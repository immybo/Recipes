import React from 'react';
import {
  TextInput
} from 'react-native';
import { Ingredient } from '../../model/Ingredient';

interface IngredientInputProps {
  ingredient: Ingredient,
  onChangeIngredient: (ingredient: Ingredient) => void
}

class IngredientInput extends React.Component<IngredientInputProps, any> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
        <TextInput placeholder={ this.props.ingredient.name == null ? this.props.ingredient.name : "" } />
    );
  }
}

export default IngredientInput;
