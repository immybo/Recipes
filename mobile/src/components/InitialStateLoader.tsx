import { fetchRecipes } from "../actions/RecipeActions";
import { fetchIngredients } from "../actions/IngredientActions";
import { View } from "react-native";
import React from "react";
import { connect } from "react-redux";

interface InitialStateLoaderProps extends React.Props<InitialStateLoader> {
    fetchRecipes: () => Promise<void>
    fetchIngredients: () => Promise<void>
    onLoad: () => void
    shouldReload: boolean
}

interface InitialStateLoaderState {
    isLoading: boolean
}

const mapDispatchToProps = {
    fetchRecipes,
    fetchIngredients
};

const mergeProps = (stateProps: InitialStateLoaderProps, dispatchProps: InitialStateLoaderProps, ownProps: InitialStateLoaderProps): InitialStateLoaderProps => {
    return {
        fetchRecipes: dispatchProps.fetchRecipes,
        fetchIngredients: dispatchProps.fetchIngredients,
        onLoad: ownProps.onLoad,
        shouldReload: ownProps.shouldReload
    }
}

class InitialStateLoader extends React.Component<InitialStateLoaderProps, InitialStateLoaderState> {
    constructor(props: InitialStateLoaderProps) {
        super(props);

        this.state = {
            isLoading: false
        }
    }
    
    public render(): JSX.Element {
        return <View />;
    }

    public componentDidMount(): void {
        this.setState({ isLoading: true });

        this.props.fetchRecipes()
            .then(_ => { this.setState({ isLoading: false }); this.props.onLoad()});
    }

    public componentDidUpdate(): void {
        if (this.props.shouldReload && !this.state.isLoading) {
            this.setState({ isLoading: true });

            this.props.fetchRecipes()
                .then(_ => this.props.fetchIngredients())
                .then(_ => { this.setState({ isLoading: false }); this.props.onLoad()});
        }
    }
}

export default connect(null, mapDispatchToProps, mergeProps)(InitialStateLoader);