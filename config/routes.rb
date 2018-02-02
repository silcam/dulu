Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  # Dashboard
  root    'dashboard#dashboard'
  get     'dashboard/:dmn',           to: 'dashboard#dashboard', as: :dashboard
  get     'search',                   to: 'searches#search'

  # Sessions
  get     'not_allowed',              to: 'people#not_allowed'
  get     '/login',                   to: 'sessions#new'
  delete  '/logout',                  to: 'sessions#destroy'
  get     '/auth/:provider/callback', to: 'sessions#create'
  get     '/auth/failure',            to: redirect('/')
  get     '/login_as/:id',            to: 'sessions#login_as'

  # Surveys
  get     '/programs/:program_id/surveys/:survey_id', to: 'survey_completions#new', as: :program_survey
  post    '/programs/:program_id/surveys/:survey_id', to: 'survey_completions#create'
  delete  '/programs/:program_id/surveys/:survey_id', to: 'survey_completions#destroy'
  get     '/surveys/:id',                             to: 'survey_completions#show', as: :survey
  get     '/surveys/:id/report/:report',              to: 'survey_completions#report', as: :survey_report

  resources :people do
    get 'find', on: :collection
    resources :person_roles do
      post 'finish', on: :member
    end
  end
  resources :organizations
  resources :languages
  resources :events do
    get 'past', on: :collection
    member do
      patch 'add_update'
      patch 'remove_update'
    end
  end
  resources :reports
  resources :audits, only: [:index, :show]

  resources :clusters do
    resources :participants, shallow: true do
      member do
        get 'finish'
        patch 'finish'
        patch 'add_update'
        patch 'remove_update'
      end
    end
  end

  resources :programs do
    get 'dashboard', on: :member
    resources :activities, shallow: true do
      member do
        post 'update_workshops'
        patch 'add_update'
        patch 'remove_update'
      end
      resources :stages, only: [:new, :create, :update, :destroy], shallow: true
      resources :workshops, shallow: true do
        post 'complete', on: :member
      end
    end
    resources :participants, shallow: true do
      member do
        get 'finish'
        patch 'finish'
        patch 'add_update'
        patch 'remove_update'
      end
    end
    resources :events do
      get 'past', on: :collection
      member do
        patch 'add_update'
        patch 'remove_update'
      end
    end
    resources :publications, shallow: true
    resources :domain_updates, shallow: true
  end
end
