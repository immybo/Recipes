import React from 'react';
import {
    View
} from 'react-native';
import { connect } from 'react-redux';
import { AppState } from '../reducers/Reducers';
import { withNavigation, ScrollView } from 'react-navigation';
import { styles } from '../style/Style';
import NavigationBar from './shared/NavigationBar';
import { Ingredient } from '../model/Ingredient';
import { deleteIngredient } from '../actions/IngredientActions';
import IngredientCompactDisplay from './shared/IngredientCompactDisplay';
import { removeDisplayedError } from '../actions/NetworkActions';
import { RouteEditIngredient } from '../Routes';

interface ViewIngredientsProps extends React.Props<ViewIngredients> {
    navigation: any,
    ingredients: Ingredient[],
    deleteIngredient: (deletedIngredient: Ingredient) => void,
    removeDisplayedError: () => void
}

const mapStateToProps = (state: AppState) => {
    return {
        ingredients: state.ingredients.allIngredients
    };
}

const mapDispatchToProps = {
    deleteIngredient,
    removeDisplayedError
}

class ViewIngredients extends React.Component<ViewIngredientsProps, any> {
    constructor(props: ViewIngredientsProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View>
                        {this.getIngredientsList()}
                    </View>
                </ScrollView>
            </View>
        );
    }

    private getIngredientsList(): JSX.Element[] {
        return this.props.ingredients.map((ingredient, key) =>
            <IngredientCompactDisplay
                onClick={(recipe) => this.editIngredient(recipe)}
                onEdit={(recipe) => this.editIngredient(recipe)}
                onDelete={(recipe) => this.deleteIngredient(recipe)}
                key={key}
                ingredient={ingredient} />);
    }

    private editIngredient(ingredient: Ingredient) {
        this.props.navigation.navigate(RouteEditIngredient, { ingredient: ingredient });
    }

    private deleteIngredient(ingredient: Ingredient) {
        this.props.deleteIngredient(ingredient);
    }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(ViewIngredients));
