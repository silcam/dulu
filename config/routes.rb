Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root    'dashboard#dashboard'
  get     'dashboard/:dmn',           to: 'dashboard#dashboard', as: :dashboard
  get     'search',                   to: 'searches#search'
  get     'not_allowed',              to: 'people#not_allowed'
  get     '/login',                   to: 'sessions#new'
  delete  '/logout',                  to: 'sessions#destroy'
  get     '/auth/:provider/callback', to: 'sessions#create'
  get     '/auth/failure',            to: redirect('/')
  get     '/programs/:program_id/surveys/:survey_id', to: 'survey_completions#new', as: :program_survey
  post    '/programs/:program_id/surveys/:survey_id', to: 'survey_completions#create'
  delete  '/programs/:program_id/surveys/:survey_id', to: 'survey_completions#destroy'

  resources :people
  resources :organizations
  resources :languages
  resources :events
  shallow do
    resources :clusters do
      resources :participants do
        member do
          get 'finish'
          patch 'finish'
        end
      end
    end

    resources :programs do
      get 'dashboard', on: :member
      resources :translation_activities do
        resources :stages, only: [:new, :create, :update, :destroy]
      end
      resources :activities do
        resources :stages, only: [:new, :create, :update, :destroy]
      end
      resources :participants do
        member do
          get 'finish'
          patch 'finish'
        end
      end
      resources :events
      resources :publications
      resources :domain_updates
    end
  end
end
