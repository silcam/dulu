import axios from 'axios'
import update from 'immutability-helper'
import React from 'react'

/*
    Required props:
        id
*/

function backedModel(WrappedComponent, modelPath, modelName) {
    return class extends React.PureComponent {
        constructor(props) {
            super(props)
            this.state = {
                model: null,
                saving: 0,
                savedChanges: false,
                can: {
                    update: false,
                    delete: false
                }
            }
        }

        // Reset when the component is shifted to a different instance of the model
        static getDerivedStateFromProps(nextProps, prevState) {
            if (!prevState.model || prevState.model.id == nextProps.id) return null

            return {
                model: null,
                saving: 0,
                savedChanges: false
            }
        }

        componentDidMount() {
            this.fetch()
        }

        componentDidUpdate() {
            if (!this.state.model) {
                this.fetch()
            }
        }

        fetch = () => {
            axios.get(`${modelPath}/${this.props.id}`)
                .then(response => {
                    this.setState({ 
                        model: response.data[modelName],
                        can: response.data.can
                    })
                })
                .catch(error => console.error(error))
        }

        update = (model) => {
            this.setState((prevState) => {
                return {
                    model: update(prevState.model, {$merge: model}),
                    saving: ++prevState.saving
                }
            })
            axios.put(`${modelPath}/${this.props.id}`,
                        {
                            authenticity_token: this.props.authToken,
                            [modelName]: model
                        })
                .then(response => {
                    this.setState((prevState) => {
                        return {
                            model: response.data[modelName],
                            saving: --prevState.saving,
                            savedChanges: true
                        }
                    })
                })
                .catch(error => {
                    this.setState((prevState) => {
                        return { saving: --prevState.saving }
                    })
                    console.error(error)
                })
        }

        render() {
            const modelProp = { [modelName]: this.state.model }
            return <WrappedComponent {...modelProp} 
                                     {...this.props}
                                     can={this.state.can} 
                                     saving={this.state.saving}
                                     savedChanges={this.state.savedChanges}
                                     update={this.update} />
        }
    }
}

export default backedModel