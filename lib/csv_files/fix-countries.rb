doublequote = '"'
write_file = File.new('better_countries.csv', 'w')
File.open('countries.csv', 'r') do |read_file|
  while line = read_file.gets
    items = []
    i = line.index(',')
    while line 
      if line[0..i].count(doublequote)==1
        i = line.index(',', i+1)
      else
        items << line[0..i-1]
        line = line[i+1..-1]
        i = line.index(',') if line
      end
    end
    items.each do |item|
      unless item.start_with?(doublequote)
        item = doublequote + item + doublequote
      end
    end
    write_file.puts(items.join(','))
  end
end