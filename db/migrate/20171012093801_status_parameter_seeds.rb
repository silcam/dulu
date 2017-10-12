class StatusParameterSeeds < ActiveRecord::Migration[5.0]
  def up
    seeds.each do |params|
      StatusParameter.create! params
    end
  end

  def down
    seeds.each do |params|
      StatusParameter.find_by(prompt: params[:prompt], domain: params[:domain]).try(:destroy)
    end
  end

  def seeds
    [{
        prompt: "Awareness level of mother tongue scriptures",
        domain: 'Scripture_use'
     },
    {
        prompt: "Where and how are scriptures accessed?",
        domain: 'Scripture_use'
     },
    {
        prompt: "Number of people literate in the community",
        domain: 'Literacy',
        number_field: true,
        number_unit: 'people'
     },
     {
         prompt: "Percent of the community that is literate",
         domain: 'Literacy',
         number_field: true,
         number_unit: 'percent'
     },
     {
         prompt: "Training of literacy workers",
         domain: 'Literacy'
     },
     {
         prompt: "Percentage of individuals engaging with the Scriptures for personal growth or societal transformation",
         domain: 'Scripture_use',
         number_field: true,
         number_unit: 'percent'
     },
     {
         prompt: "Percentage of communities of believers engaging with the Scriptures for personal growth or societal transformation",
         domain: 'Scripture_use',
         number_field: true,
         number_unit: 'percent'
     },
     {
         prompt: "Observed impact of mother tongue Scriptures in the lives of believers and communities of believers",
         domain: 'Scripture_use'
     },
     {
         prompt: "Are churches organized to work together on language development and Bible translation?",
         domain: 'Mobilization'
     },
     {
         prompt: "Who are likely leaders in a sustainable Bible translation and Scripture use movement?",
         domain: 'Mobilization'
     },
     {
         prompt: "How sustainable is the literacy program?",
         domain: 'Literacy'
     }]
  end
end
