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
    onEdit: (recipe: Recipe) => void
    onDelete: (recipe: Recipe) => void
}

class RecipeCompactDisplay extends React.Component<RecipeCompactDisplayProps, any> {
    constructor(props: any) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <TouchableHighlight onPress={(event) => this.props.onClick(this.props.recipe)}>
                <View style={styles.rowLayout}>
                    <Text>{this.props.recipe.name}</Text>
                    <View style={styles.rowRightButton}>
                        <TouchableHighlight style={styles.marginSmall} onPress={(event) => this.props.onEdit(this.props.recipe)}>
                            <Icon name="edit" size={20} color="black" />
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.marginSmall} onPress={(event) => this.props.onDelete(this.props.recipe)}>
                            <Icon name="trash" size={20} color="black" />
                        </TouchableHighlight>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

export default RecipeCompactDisplay;
