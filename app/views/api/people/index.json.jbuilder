json.people @people, partial: "person_for_index", as: :person

json.can do
  json.create can?(:create, Person)
end
