Rails.application.routes.draw do

  get 'pers_prog_rels/new'

  get 'pers_prog_rels/create'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root 'programs#index'

  resources :people
  resources :organizations
  resources :languages
  shallow do
    resources :programs do
      get 'dashboard', on: :member
      resources :translation_activities do
        resources :stages
      end
      resources :pers_prog_rels do
        member do
          get 'finish'
          patch 'finish'
        end
      end
    end
  end
  
  get     '/login',     to: 'sessions#new'
  post    '/login',     to: 'sessions#create'
  delete  '/logout',    to: 'sessions#destroy'
end
