Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  namespace :api, defaults: {format: :json} do
    get 'search', to: 'searches#search'
    get 'countries/search', to: 'countries#search'

    resources :activities, shallow: true do
      resources :workshops
    end

    resources :clusters do
      get 'dashboard', on: :member
      get 'search', on: :collection
    end

    resources :events do
      get 'find/:year/:month', on: :collection, action: :find
    end

    resources :languages do
      get 'more_events', on: :member
      get 'get_event', on: :member
      get 'search', on: :collection
      get 'lang_search', on: :collection
    end

    resources :notifications do
      get 'global', on: :collection
      post 'mark_read', on: :collection
    end

    resources :organizations do
      get 'search', on: :collection
    end

    resources :organization_people

    resources :participants

    resources :people do
      put 'update_view_prefs', on: :collection
      get 'search', on: :collection
    end

    get '/permissions/check', to: 'permissions#check'

    resources :person_roles do
      post 'finish', on: :collection
    end

    resources :programs, shallow: true do
      resources :media_activities
      resources :research_activities
      resources :translation_activities
      resources :workshops_activities
      get 'dashboard_list', on: :collection
      get 'dashboard', on: :member
    end

    resources :regions

    resources :reports do
      get 'report_data', on: :collection
    end

    resources :stages
  end

  # Sessions
  get     'not_allowed',              to: 'people#not_allowed'
  get     '/login',                   to: 'sessions#new'
  post    '/logout',                  to: 'sessions#destroy'
  get     '/auth/:provider/callback', to: 'sessions#create'
  get     '/auth/failure',            to: redirect('/')
  get     '/login_as/:id',            to: 'sessions#login_as' 

  root 'web#index'
  get '*route', to: 'web#index'
end
