import { fetchRecipes } from "../actions/RecipeActions";
import { AppState, View } from "react-native";
import React from "react";
import { connect } from "react-redux";

interface InitialStateLoaderProps extends React.Props<InitialStateLoader> {
    fetchRecipes: () => Promise<void>
    onLoad: () => void
}

const mapStateToProps = (state: AppState) => {
    return {};
}

const mapDispatchToProps = {
    fetchRecipes
};

class InitialStateLoader extends React.Component<InitialStateLoaderProps, any> {
    constructor(props: InitialStateLoaderProps) {
        super(props);
    }
    
    public render(): JSX.Element {
        return <View />;
    }

    public componentDidMount(): void {
        this.props.fetchRecipes()
            .then(_ => this.props.onLoad());
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InitialStateLoader);