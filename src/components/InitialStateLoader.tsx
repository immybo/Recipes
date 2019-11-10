import { Category } from "../model/Category";
import { setAllCategories } from "../actions/CategoryActions";
import { setAllRecipes } from "../actions/RecipeActions";
import { AppState, View } from "react-native";
import React from "react";
import { Recipe, getUniqueRecipeId } from "../model/Recipe";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";

interface InitialStateLoaderProps extends React.Props<InitialStateLoader> {
    onLoad: () => void
}

const mapStateToProps = (state: AppState) => {
    return {};
}

const mapDispatchToProps = {
    setAllCategories,
    setAllRecipes
};

class InitialStateLoader extends React.Component<InitialStateLoaderProps, any> {
    constructor(props: InitialStateLoaderProps) {
        super(props);
    }
    
    public render(): JSX.Element {
        return <View />;
    }

    public componentDidMount(): void {
        let categories: Category[] = this.loadAllCategories();
        let recipes: Recipe[] = this.loadAllRecipes(categories);

        this.props.setAllRecipes(recipes);
        this.props.setAllCategories(categories);

        this.props.onLoad();
    }

    private loadAllCategories(): Category[] {
        return [
            {
                id: 0,
                name: "Pizza"
            },
            {
                id: 1,
                name: "Pasta"
            },
            {
                id: 2,
                name: "Vegetarian"
            }
        ];
    }

    private loadAllRecipes(allCategories: Category[]): Recipe[] {
        return [
            {
                id: getUniqueRecipeId(),
                name: "Mushroom Pasta",
                categories: allCategories.filter(x => x.name === "Pasta" || x.name === "Vegetarian"),
                description: "Some sort of mushroom pasta dish.",
                ingredients: [
                    {
                        name:  "Rigatoni",
                        quantity: {
                            quantity: 3
                        }
                    },
                    {
                        name: "Portobello mushrooms",
                        quantity: {
                            quantity: 1.5
                        }
                    }
                ]
            },
            {
                id: getUniqueRecipeId(),
                name: "Pizza",
                categories: allCategories.filter(x => x.name === "Pizza" || x.name === "Italian"),
                description: "Classic margherita pizza.",
                ingredients: [
                    {
                        name:  "Flour",
                        quantity: {
                            quantity: 5
                        }
                    },
                    {
                        name: "Active dry yeast",
                        quantity: {
                            quantity: 1
                        }
                    },
                    {
                        name: "Mozarella",
                        quantity: {
                            quantity: 5
                        }
                    },
                    {
                        name: "Tomato",
                        quantity: {
                            quantity: 2
                        }
                    },
                    {
                        name: "Sugar",
                        quantity: {
                            quantity: 1
                        }
                    },
                    {
                        name: "Whole basil leaf",
                        quantity: {
                            quantity: 3
                        }
                    },
                    {
                        name: "Cherry tomato",
                        quantity: {
                            quantity: 5
                        }
                    }
                ]
            }
        ];
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InitialStateLoader);