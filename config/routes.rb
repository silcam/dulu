Rails.application.routes.draw do
  #get 'sessions/new'  #I think this line is a mistake

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root 'people#index'

  resources :people
  resources :organizations
  
  get     '/login',     to: 'sessions#new'
  post    '/login',     to: 'sessions#create'
  delete  '/logout',    to: 'sessions#destroy'
end
