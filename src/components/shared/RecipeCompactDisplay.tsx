import React from 'react';
import {
    View,
    Text,
    TouchableHighlight
} from 'react-native';
import { Recipe } from '../../model/Recipe';
import { styles } from '../../style/Style';
import Icon from 'react-native-vector-icons/FontAwesome';

interface RecipeCompactDisplayProps {
    recipe: Recipe,
    onClick: (recipe: Recipe) => void
    onDelete: (recipe: Recipe) => void
}

class RecipeCompactDisplay extends React.Component<RecipeCompactDisplayProps, any> {
    constructor(props: any) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <TouchableHighlight onPress={(event) => this.props.onClick(this.props.recipe)}>
                <View style={[styles.rowLayout, styles.verticalMiddleAlign]}>
                    <Text>{this.props.recipe.name}</Text>
                    <TouchableHighlight onPress={(event) => this.props.onDelete(this.props.recipe)}>
                        <View style={styles.rightButton}>
                            <Icon name="trash" size={20} color="black" />
                        </View>
                    </TouchableHighlight>
                </View>
            </TouchableHighlight>
        );
    }
}

export default RecipeCompactDisplay;
