Rails.application.routes.draw do

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root 'programs#index'

  resources :people
  resources :organizations
  resources :languages
  shallow do
    resources :programs do
      resources :books_in_translation do
        resources :book_translation_stages
      end
    end
  end
  
  get     '/login',     to: 'sessions#new'
  post    '/login',     to: 'sessions#create'
  delete  '/logout',    to: 'sessions#destroy'
end
