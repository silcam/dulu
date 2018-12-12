
# json.elements @data[:elements]
# json.clusters @data[:clusters] do |cluster, programs|
#   json.call(cluster, :id, :name)
#   json.programs programs do |program, report|
#     json.call(program, :id, :name)
#     json.report do
#       json.publications report[:publications]
#       json.activities do
#         report[:activities].each do |testament, books|
#           json.set! testament do
#             new_books = books.collect do |book|
#               book[:stage] ? book[:stage][:name] : ''
#             end
#             json.array! new_books
#           end
#         end
#       end
#     end
#   end
# end