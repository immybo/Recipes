import React from 'react';
import {
    View,
    Text
} from 'react-native';
import { IngredientWithQuantity } from '../../model/IngredientWithQuantity';
import { styles } from '../../style/Style';

interface IngredientDisplayProps {
    ingredient: IngredientWithQuantity
}

class IngredientDisplay extends React.Component<IngredientDisplayProps, any> {
    constructor(props: any) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <View style={styles.rowWithoutJustify}>
                <Text>{this.props.ingredient.quantity.toString()}</Text>
                <Text> </Text>
                <Text>{this.props.ingredient.ingredient.name}</Text>
            </View>
        );
    }
}

export default IngredientDisplay;
