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
  end
  resources :organizations
  resources :languages
  resources :events
  resources :audits, only: [:index, :show]
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
