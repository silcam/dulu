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

        update = (model, callback) => {
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
                .then((response) => {
                    this.handleResponse(response)
                    if (callback) callback()
                })
                .catch(this.handleError)
        }

        rawPost = (url, data) => {
            this.addSaving()
            data.authenticity_token = this.props.authToken
            axios.post(url, data)
                .then(this.handleResponse)
                .catch(this.handleError)
        }

        rawPut = (url, data) => {
            this.addSaving()
            data.authenticity_token = this.props.authToken
            axios.put(url, data)
                .then(this.handleResponse)
                .catch(this.handleError)
        }

        rawDelete = (url) => {
            this.addSaving()
            axios({
                method: 'delete',
                url: url,
                data: {
                    authenticity_token: this.props.authToken
                }
            })
            .then(this.handleResponse)
            .catch(this.handleError)
        }

        addSaving = () => {
            this.setState((prevState) => {
                return {
                    saving: ++prevState.saving
                }
            })
        }

        handleResponse = (response) => {
            this.setState((prevState) => {
                return {
                    model: response.data[modelName],
                    saving: --prevState.saving,
                    savedChanges: true
                }
            })
        }

        handleError = (error) => {
            this.setState((prevState) => {
                return { saving: --prevState.saving }
            })
            console.error(error)
        }

        render() {
            const modelProp = { [modelName]: this.state.model }
            return <WrappedComponent {...modelProp} 
                                     {...this.props}
                                     can={this.state.can} 
                                     saving={this.state.saving}
                                     savedChanges={this.state.savedChanges}
                                     update={this.update}
                                     rawPost={this.rawPost}
                                     rawPut={this.rawPut}
                                     rawDelete={this.rawDelete} />
        }
    }
}

export default backedModel