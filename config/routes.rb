# frozen_string_literal: true

Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  namespace :api, defaults: { format: :json } do
    get 'search', to: 'searches#search'
    get 'countries/search', to: 'countries#search'
    post 'errors', to: 'errors#create'

    resources :activities, shallow: true do
      resources :workshops
    end

    resources :clusters do
      resources :participants
      get 'dashboard', on: :member
      get 'search', on: :collection
    end

    resources :events do
      get 'find/:year/:month', on: :collection, action: :find
    end

    resources :languages do
      resources :media_activities
      resources :research_activities
      resources :translation_activities
      resources :workshops_activities
      resources :participants
      resources :events
      resources :domain_status_items, shallow: true
      get 'more_events', on: :member
      get 'get_event', on: :member
      get 'search', on: :collection
      get 'dashboard_list', on: :collection
      get 'dashboard', on: :member
      get 'find_language_id', on: :collection
      get 'pubs', on: :member
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
      resources :events
      put 'update_view_prefs', on: :collection
      get 'search', on: :collection
    end

    get '/permissions/check', to: 'permissions#check'

    resources :person_roles do
      post 'finish', on: :collection
    end

    resources :regions

    resources :reports do
      get 'report_data', on: :collection
      get 'domain_report', on: :collection
    end

    resources :stages
  end

  # Sessions
  get 'not_allowed', to: 'people#not_allowed'
  get '/login', to: 'sessions#new'
  post '/logout', to: 'sessions#destroy'
  get '/auth/:provider/callback', to: 'sessions#create'
  get '/auth/failure', to: redirect('/')
  get '/login_as/:id', to: 'sessions#login_as'

  post '/test-login', to: 'sessions#test_create' if Rails.env.test?

  root 'web#index'
  get '*route', to: 'web#index'
end
