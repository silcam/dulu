# frozen_string_literal: true

json.languages [@language] do |language|
  json.call(language, :id, :name)

  json.domain_status_items language.domain_status_items do |ds_item|
    json.call(
      ds_item,
      :id,
      :language_id,
      :category,
      :subcategory,
      :description,
      :title,
      :year,
      :platforms,
      :organization_ids,
      :person_ids,
      :creator_id,
      :bible_book_ids,
      :count,
      :details,
      :completeness,
      :link
    )
    if ds_item.dsi_location
      json.dsiLocation do
        json.call(ds_item.dsi_location, :id, :name)
      end
    end
  end
end

person_ids = @language
             .domain_status_items
             .map do |ds_item|
               ds_item.person_ids + [ds_item.creator_id]
             end
             .flatten
             .uniq
people = Person.where(id: person_ids)
json.people people do |person|
  json.call(person, :id, :first_name, :last_name)
end

org_ids = @language.domain_status_items.map(&:organization_ids).flatten.uniq
orgs = Organization.where(id: org_ids)
json.organizations orgs do |org|
  json.call(org, :id, :short_name)
end
